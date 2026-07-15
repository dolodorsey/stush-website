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

async function publicFetch(path) {
  const url = `${FETCH_ORIGIN}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Shopify ${res.status}: ${path}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Shopify fetch error (${path}): ${err.message}`);
    return null;
  }
}

// -------- products --------

// Fetches STUSH brand collection directly — auto-populates from tag rule brand:stush
export async function getProducts(opts = {}) {
  const { limit = 250 } = opts;
  const data = await publicFetch(`/collections/stush-usa/products.json?limit=${limit}`);
  return data?.products ?? [];
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  const data = await publicFetch(`/products/${handle}.json`);
  return data?.product ?? null;
}

// -------- collections --------

export async function getCollections() {
  const data = await publicFetch('/collections.json?limit=50');
  const all = data?.collections ?? [];
  // Filter to STUSH-relevant collections (brand + type subcategories)
  return all.filter(c => {
    const h = c.handle || '';
    return h === 'stush-usa';
  });
}

export async function getCollectionByHandle(handle) {
  if (!handle) return null;
  const data = await publicFetch(`/collections/${handle}.json`);
  return data?.collection ?? null;
}

export async function getCollectionProducts(handleOrId, limit = 250) {
  if (!handleOrId) return [];
  // Public endpoint uses handle. If a numeric ID was passed (from collections.json response),
  // look up its handle from the full collections list.
  let handle = handleOrId;
  if (/^\d+$/.test(String(handleOrId))) {
    const colls = await getCollections();
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
  if (!variantId) return `${CART_ORIGIN}/cart`;
  return `${CART_ORIGIN}/cart/${variantId}:${quantity}`;
}

// Convert raw HTML body to a safe, readable string
export function plainDescription(html, max = 280) {
  if (!html) return '';
  const stripped = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped.length > max ? stripped.slice(0, max - 1).trimEnd() + '…' : stripped;
}
