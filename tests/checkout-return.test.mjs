import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkoutReturnPath } from '../src/lib/checkout-return.mjs';

const cases = [
  ['missing parameters', undefined, '/cart'],
  ['null parameters', null, '/cart'],
  ['empty parameters', {}, '/cart'],
  ['existing payment-rail cancellation', { canceled: '1' }, '/cart?checkout=canceled'],
  ['cart cancellation marker', { checkout: 'canceled' }, '/cart?checkout=canceled'],
  ['false cancellation', { canceled: '0' }, '/cart'],
  ['duplicate parameter is not trusted', { canceled: ['1', '0'] }, '/cart'],
  ['external redirect is ignored', { redirect: 'https://example.invalid' }, '/cart'],
  ['script redirect is ignored', { next: 'javascript:alert(1)' }, '/cart'],
  ['successful-payment claim is ignored', { paid: 'true' }, '/cart'],
];
for (const [name, params, expected] of cases) test(name, () => assert.equal(checkoutReturnPath(params), expected));
test('return page does not claim payment status from URL flags', () => {
  const source = readFileSync(new URL('../src/app/cart/page.jsx', import.meta.url), 'utf8');
  assert.ok(!source.includes('Nothing was charged.'));
  assert.ok(source.includes('does not verify payment status'));
});
test('compatibility route only redirects to validated destination', () => {
  const source = readFileSync(new URL('../src/app/checkout/page.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('redirect(checkoutReturnPath(await searchParams))'));
  assert.ok(!source.includes('fetch('));
});
