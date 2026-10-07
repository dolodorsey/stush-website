import assert from 'node:assert/strict';
import { resolveVariantForSelection } from '../src/lib/variant-selection.mjs';

const optionNames = [{ name: 'Size' }, { name: 'Color' }];
const variants = [
  { id: 'gid://shopify/ProductVariant/101', option1: 'S', option2: 'Black', available: true },
  { id: 'gid://shopify/ProductVariant/102', option1: 'M', option2: 'White', available: true },
];

assert.equal(
  resolveVariantForSelection(variants, optionNames, { Size: 'S', Color: 'Black' })?.id,
  'gid://shopify/ProductVariant/101',
  'exact option combination should resolve the exact Shopify variant'
);

assert.equal(
  resolveVariantForSelection(variants, optionNames, { Size: 'M', Color: 'Black' }),
  null,
  'an unavailable option combination must never fall back to the first variant'
);

assert.equal(
  resolveVariantForSelection([], optionNames, { Size: 'S', Color: 'Black' }),
  null,
  'empty variant lists must not produce a checkout variant'
);

assert.equal(
  resolveVariantForSelection(variants, [], {})?.id,
  'gid://shopify/ProductVariant/101',
  'products without selectable options may use their only/default first variant'
);

console.log('STUSH variant-selection safety regression passed.');
