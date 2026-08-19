export const STUSH_CATEGORIES = [
  { key: 'tops', label: 'Tees & Tops', eyebrow: 'Core layers' },
  { key: 'outerwear', label: 'Hoodies & Outerwear', eyebrow: 'Statement layers' },
  { key: 'bottoms', label: 'Bottoms', eyebrow: 'Pants · shorts · denim' },
  { key: 'sets', label: 'Sets', eyebrow: 'Head-to-toe looks' },
  { key: 'accessories', label: 'Accessories', eyebrow: 'Finishing pieces' },
];

function haystack(product) {
  const tags = Array.isArray(product?.tags) ? product.tags.join(' ') : product?.tags || '';
  return `${product?.title || ''} ${product?.product_type || ''} ${product?.vendor || ''} ${tags}`.toLowerCase();
}

export function stushCategoryKey(product) {
  const text = haystack(product);

  if (/\b(set|tracksuit|track suit|two[- ]?piece|matching|co-?ord)\b/.test(text)) return 'sets';
  if (/\b(hoodie|hooded|sweatshirt|crewneck|jacket|coat|outerwear|fleece|bomber|varsity|windbreaker|zip[- ]?up)\b/.test(text)) return 'outerwear';
  if (/\b(pant|pants|trouser|trousers|short|shorts|denim|jean|jeans|jogger|joggers|skirt)\b/.test(text)) return 'bottoms';
  if (/\b(hat|cap|beanie|bag|sock|socks|belt|accessory|accessories|scarf|wallet|jewelry|jewellery)\b/.test(text)) return 'accessories';
  return 'tops';
}

export function groupStushProducts(products = []) {
  const grouped = Object.fromEntries(STUSH_CATEGORIES.map(category => [category.key, []]));
  for (const product of products) grouped[stushCategoryKey(product)].push(product);
  return grouped;
}

export function categoryForKey(key) {
  return STUSH_CATEGORIES.find(category => category.key === key);
}
