const STORE = 'stushusa.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API = `https://${STORE}/admin/api/2024-01`;

export async function shopifyFetch(endpoint) {
  if (!TOKEN) { console.error('SHOPIFY_ADMIN_TOKEN not set'); return null; }
  try {
    const res = await fetch(`${API}${endpoint}`, {
      headers: { 'X-Shopify-Access-Token': TOKEN },
      cache: 'no-store',
    });
    if (!res.ok) { console.error(`Shopify API ${res.status}: ${endpoint}`); return null; }
    return res.json();
  } catch (err) { console.error(`Shopify fetch error: ${err.message}`); return null; }
}

export async function getProducts(status = 'active', limit = 250) {
  const data = await shopifyFetch(`/products.json?limit=${limit}&status=${status}`);
  return data?.products || [];
}

export async function getCollections() {
  const data = await shopifyFetch('/smart_collections.json');
  return data?.smart_collections || [];
}

export function formatPrice(price) {
  const num = parseFloat(price);
  return '$' + num.toFixed(0);
}
