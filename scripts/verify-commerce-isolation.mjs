import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const APPROVED_PAYMENT_HOST = 'dzlmtvodpyhetvektfuo.supabase.co';
const CHECKOUT_ROUTE = join(ROOT, 'src/app/api/checkout/route.js');
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
