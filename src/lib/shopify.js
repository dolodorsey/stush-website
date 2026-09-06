// server-only Shopify wrapper — uses PUBLIC Shopify JSON endpoints, no token needed.
// Shopify exposes /products.json and /collections/{handle}/products.json on every store.
// This lets us fetch products without any Admin API token or Storefront token.

// Product JSON is fetched from the canonical .myshopify.com host (public JSON endpoints
// work reliably there). Cart/checkout links point at the branded custom domain.
const FETCH_HOST = process.env.SHOPIFY_STORE_DOMAIN || 'bodgeaworldwide.myshopify.com';
const CHECKOUT_HOST = 'bodgeaworldwide.myshopify.com';
const FETCH_ORIGIN = `https://${FETCH_HOST.replace(/^https?:\/\//, '')}`;
export const CART_ORIGIN = `https://${CHECKOUT_HOST}`;

const UA = 'Mozilla/5.0 (compatible; StushWeb/1.0)';
const BRAND_TAG = 'brand:stush';
const CATALOG_VALIDATION_TIMEOUT_MS = 4_000;
// Live smart collection — auto-populates from the brand:stush tag rule.
// (The legacy 'stush-usa' manual collection is stale and no longer the source of truth.)
const BRAND_COLLECTION = 'stush';
const BRAND_SOURCE_QUERY = 'utm_source=stush&utm_medium=storefront&utm_campaign=brand_store&brand_source=stush&landing_brand=stush';
const BRAND_CART_QUERY = `${BRAND_SOURCE_QUERY}&attributes%5Bbrand_source%5D=stush&attributes%5Blanding_brand%5D=stush`;

async function publicFetch(path, options = {}) {
  const { silent404 = false } = options;
  const url = `${FETCH_ORIGIN}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      // Old campaign/product URLs can outlive a Shopify handle. That is a normal
      // merchandising miss, not a production runtime failure.
      if (!(silent404 && res.status === 404)) console.error(`Shopify ${res.status}: ${path}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Shopify fetch error (${path}): ${err.message}`);
    return null;
  }
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map(tag => String(tag).trim().toLowerCase()).filter(Boolean);
  return String(tags || '')
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);
}

// Checkout must never trust a browser-supplied variant ID. Before the payment rail
// is called, verify that the requested handle is still tagged for STUSH and that the
// requested variant belongs to that exact STUSH product. This prevents a caller from
// injecting a sibling-brand/shared-store variant into the STUSH checkout contract.
export async function validateStushCheckoutSelection(handle, variantId) {
  const safeHandle = String(handle || '').trim();
  const safeVariantId = String(variantId || '').trim();
  if (!safeHandle || !safeVariantId) return { ok: false, reason: 'invalid_selection' };

  try {
    const res = await fetch(`${FETCH_ORIGIN}/products/${encodeURIComponent(safeHandle)}.json`, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(CATALOG_VALIDATION_TIMEOUT_MS),
    });

    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: 'catalog_unavailable' };

    const data = await res.json();
    const product = data?.product;
    if (!product) return { ok: false, reason: 'not_found' };

    const tags = normalizeTags(product.tags);
    if (!tags.includes(BRAND_TAG)) return { ok: false, reason: 'not_stush' };

    const variant = Array.isArray(product.variants)
      ? product.variants.find(item => String(item?.id) === safeVariantId)
      : null;

    if (!variant || variant.available === false) {
      return { ok: false, reason: 'variant_unavailable' };
    }

    return {
      ok: true,
      productHandle: String(product.handle || safeHandle),
      variantId: String(variant.id),
      variantTitle: typeof variant.title === 'string' ? variant.title.slice(0, 180) : '',
    };
  } catch (error) {
    console.error('STUSH catalog validation unavailable', {
      brand: 'stush',
      error: error instanceof Error ? error.name : 'unknown',
    });
    return { ok: false, reason: 'catalog_unavailable' };
  }
}

// -------- products --------

// Fetches STUSH brand collection directly — auto-populates from tag rule brand:stush
export async function getProducts(opts = {}) {
  const { limit = 250 } = opts;
  const data = await publicFetch(`/collections/${BRAND_COLLECTION}/products.json?limit=${limit}`);
  return data?.products ?? [];
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  const data = await publicFetch(`/products/${handle}.json`, { silent404: true });
  return data?.product ?? null;
}

// -------- collections --------

// Every published collection on the store — used for id -> handle resolution.
async function getAllCollections() {
  const data = await publicFetch('/collections.json?limit=250');
  return data?.collections ?? [];
}

export async function getCollections() {
  const all = await getAllCollections();
  // Filter to STUSH-relevant collections (brand + type subcategories)
  return all.filter(c => {
    const h = c.handle || '';
    return h === BRAND_COLLECTION;
  });
}

export async function getCollectionByHandle(handle) {
  if (!handle) return null;
  // Arbitrary retired campaign handles can still be requested by old backlinks,
  // crawlers, and saved customer URLs. A missing Shopify collection is an expected
  // content miss; Next.js will render the route-level 404 without polluting the
  // production error stream.
  const data = await publicFetch(`/collections/${handle}.json`, { silent404: true });
  return data?.collection ?? null;
}

export async function getCollectionProducts(handleOrId, limit = 250) {
  if (!handleOrId) return [];
  // Public endpoint uses handle. If a numeric ID was passed (from collections.json response),
  // look up its handle from the full collections list.
  let handle = handleOrId;
  if (/^\d+$/.test(String(handleOrId))) {
    // Resolve against the full collection list so /collections/[handle] keeps
    // working for any published collection, not just the brand collection.
    const colls = await getAllCollections();
    const match = colls.find(c => String(c.id) === String(handleOrId));
    if (!match?.handle) return [];
    handle = match.handle;
  }
  const data = await publicFetch(`/collections/${handle}/products.json?limit=${limit}`);
  const all = data?.products ?? [];
  return all;
}

// -------- helpers --------

export function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return '$' + num.toFixed(0);
}

export function pickHoverImage(product) {
  const imgs = product?.images ?? [];
  if (imgs.length === 0) return null;
  if (imgs.length === 1) return imgs[0]?.src ?? null;
  return imgs[1]?.src ?? imgs[imgs.length - 1]?.src ?? null;
}

// Stable Shopify URL for cart/product
export const SHOP_URL = CART_ORIGIN;

// Build cart-add deeplink — points to the store's custom domain
export function cartAddUrl(variantId, quantity = 1) {
  if (!variantId) return `${CART_ORIGIN}/cart?${BRAND_CART_QUERY}`;
  return `${CART_ORIGIN}/cart/${variantId}:${quantity}?${BRAND_CART_QUERY}`;
}

export function productUrl(handle) {
  return `${CART_ORIGIN}/products/${handle}?${BRAND_SOURCE_QUERY}`;
}

export function collectionUrl(handle = BRAND_COLLECTION) {
  return `${CART_ORIGIN}/collections/${handle}?${BRAND_SOURCE_QUERY}`;
}

// Convert raw HTML body to a safe, readable string
export function plainDescription(html, max = 280) {
  if (!html) return '';
  const stripped = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped.length > max ? stripped.slice(0, max - 1).trimEnd() + '…' : stripped;
}