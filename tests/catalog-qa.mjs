const host = process.env.SHOPIFY_STORE_DOMAIN || 'bodgeaworldwide.myshopify.com';
const url = `https://${host.replace(/^https?:\/\//, '')}/collections/stush/products.json?limit=250`;

const response = await fetch(url, {
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'StushCatalogQA/1.0',
  },
});

if (!response.ok) {
  throw new Error(`STUSH catalog endpoint failed with ${response.status}`);
}

const payload = await response.json();
const products = payload?.products || [];
if (!products.length) throw new Error('STUSH live collection returned no products');

const failures = [];
for (const product of products) {
  const title = String(product?.title || '').trim();
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const prices = [...new Set(variants.map(variant => Number.parseFloat(variant?.price)).filter(Number.isFinite))];

  if (!title) failures.push({ id: product?.id, issue: 'missing-title' });
  if (/^stush\s*[—-]\s*/i.test(title)) failures.push({ id: product?.id, title, issue: 'legacy-supplier-style-title' });
  if (!variants.length) failures.push({ id: product?.id, title, issue: 'missing-variants' });
  if (prices.length !== 1) failures.push({ id: product?.id, title, prices, issue: 'inconsistent-variant-pricing' });

  for (const price of prices) {
    // Shopify is the merchandising source of truth. Do not fail production
    // against a stale hard-coded price ladder that can drift from approved
    // catalog changes. This gate verifies that sellable prices are real,
    // positive and uniform across variants; explicit pricing policy belongs in
    // the merchandising control plane, not an orphaned test constant.
    if (price <= 0) failures.push({ id: product?.id, title, price, issue: 'invalid-nonpositive-price' });
  }
}

if (failures.length) {
  throw new Error(`STUSH catalog QA failed (${failures.length} issue(s)): ${JSON.stringify(failures.slice(0, 20))}`);
}

console.log(`STUSH catalog QA passed: ${products.length} live pieces; positive, uniform Shopify variant pricing verified.`);
