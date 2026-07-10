// server-only Shopify wrapper for master multi-brand store (thehautehalloween.myshopify.com)
// Uses Admin REST API; never exposes the token to the client.

const STORE = 'thehautehalloween.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API   = `https://${STORE}/admin/api/2024-10`;

const HEADERS = TOKEN
  ? { 'X-Shopify-Access-Token': TOKEN, 'Accept': 'application/json' }
  : null;

async function shopifyFetch(endpoint, init = {}) {
  if (!HEADERS) {
    console.error('SHOPIFY_ADMIN_TOKEN not set');
    return null;
  }
  try {
    const res = await fetch(`${API}${endpoint}`, {
      headers: HEADERS,
      cache: 'no-store',
      ...init,
    });
    if (!res.ok) {
      console.error(`Shopify ${res.status}: ${endpoint}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Shopify fetch error (${endpoint}): ${err.message}`);
    return null;
  }
}

// -------- products --------

export async function getProducts(opts = {}) {
  const { status = 'active', limit = 250, fields } = opts;
  const params = new URLSearchParams({ status, limit: String(limit) });
  if (fields) params.set('fields', fields);
  const data = await shopifyFetch(`/products.json?${params}`);
  const all = data?.products ?? [];
  return all.filter(p => (p.tags || '').split(',').map(t => t.trim()).includes('brand_stush'));
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  // Shopify Admin doesn't have a direct "by handle" endpoint without pagination.
  // We fetch first 250 active products and lookup by handle.
  // For 250+ catalogs we'd switch to GraphQL Admin or Storefront API.
  const products = await getProducts({ limit: 250, status: 'active' });
  return products.find(p => p.handle === handle) ?? null;
}

// -------- collections --------

export async function getCollections() {
  const data = await shopifyFetch('/smart_collections.json?limit=50');
  return data?.smart_collections ?? [];
}

export async function getCollectionByHandle(handle) {
  const colls = await getCollections();
  return colls.find(c => c.handle === handle) ?? null;
}

export async function getCollectionProducts(collectionId, limit = 60) {
  if (!collectionId) return [];
  const data = await shopifyFetch(
    `/products.json?collection_id=${collectionId}&limit=${limit}&status=active`
  );
  const all = data?.products ?? [];
  return all.filter(p => (p.tags || '').split(',').map(t => t.trim()).includes('brand_stush'));
}

// -------- helpers --------

export function formatPrice(price) {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return '';
  return '$' + num.toFixed(0);
}

// Pick a "second" image for the curtain reveal — prefer one that's clearly different from the cover
export function pickHoverImage(product) {
  const imgs = product?.images ?? [];
  if (imgs.length === 0) return null;
  if (imgs.length === 1) return imgs[0]?.src ?? null;
  // Prefer an image at index 1 (typically "alt angle"), fall back to the last
  return imgs[1]?.src ?? imgs[imgs.length - 1]?.src ?? null;
}

// Stable Shopify URL for cart/product
export const SHOP_URL = `https://${STORE}`;

// Build cart-add deeplink
export function cartAddUrl(variantId, quantity = 1) {
  if (!variantId) return `${SHOP_URL}/cart`;
  return `${SHOP_URL}/cart/${variantId}:${quantity}`;
}

// Convert raw HTML body to a safe, readable string for product descriptions
export function plainDescription(html, max = 280) {
  if (!html) return '';
  const stripped = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped.length > max ? stripped.slice(0, max - 1).trimEnd() + '…' : stripped;
}
