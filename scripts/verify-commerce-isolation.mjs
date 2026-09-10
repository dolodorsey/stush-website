import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const APPROVED_PAYMENT_HOST = 'dzlmtvodpyhetvektfuo.supabase.co';
const CHECKOUT_ROUTE = join(ROOT, 'src/app/api/checkout/route.js');
const SHOPIFY_LIB = join(ROOT, 'src/lib/shopify.js');
const DEBUG_ROUTE = join(ROOT, 'src/app/api/debug-shopify/route.js');

function fail(message) {
  console.error(`STUSH commerce isolation check failed: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

if (!existsSync(CHECKOUT_ROUTE)) {
  fail('checkout route is missing');
} else {
  const checkout = readFileSync(CHECKOUT_ROUTE, 'utf8');
  if (!checkout.includes("brand_key: 'stush'")) fail('checkout is not hard-locked to brand_key=stush');
  if (!checkout.includes(APPROVED_PAYMENT_HOST)) fail('checkout does not use the approved STUSH payment dependency');
  if (!checkout.includes('AbortSignal.timeout')) fail('checkout has no bounded upstream timeout');
  if (!checkout.includes("'Retry-After': '60'")) fail('checkout has no client retry guidance');
  if (!checkout.includes('validateStushCheckoutSelection')) fail('checkout does not verify STUSH catalog ownership before payment');
  if (!checkout.includes('variantId: selection.variantId')) fail('checkout forwards an unverified browser variant ID');
  if (!checkout.includes('variantTitle: selection.variantTitle')) fail('checkout forwards an unverified browser variant title');
  if (checkout.includes('const { productHandle, variantId, variantTitle')) fail('checkout still trusts browser-supplied variantTitle');
}

if (!existsSync(SHOPIFY_LIB)) {
  fail('Shopify library is missing');
} else {
  const shopify = readFileSync(SHOPIFY_LIB, 'utf8');
  if (!shopify.includes("const BRAND_TAG = 'brand:stush'")) fail('Shopify validation is not pinned to the STUSH brand tag');
  if (!shopify.includes('validateStushCheckoutSelection')) fail('STUSH catalog ownership validator is missing');
  if (!shopify.includes('tags.includes(BRAND_TAG)')) fail('STUSH checkout validator does not enforce the brand tag');
  if (!shopify.includes('variant.available === false')) fail('STUSH checkout validator does not reject unavailable variants');
  if (!shopify.includes('AbortSignal.timeout(CATALOG_VALIDATION_TIMEOUT_MS)')) fail('STUSH catalog validation has no bounded timeout');
}

if (existsSync(DEBUG_ROUTE)) {
  fail('public Shopify debug endpoint must not ship');
}

for (const file of walk(join(ROOT, 'src'))) {
  if (!/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/https:\/\/([a-z0-9]+)\.supabase\.co/gi)) {
    const host = `${match[1]}.supabase.co`;
    if (host !== APPROVED_PAYMENT_HOST) {
      fail(`unexpected Supabase host ${host} in ${relative(ROOT, file)}`);
    }
  }
}

if (!process.exitCode) {
  console.log('STUSH commerce isolation check passed.');
}
