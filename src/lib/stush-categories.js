export const STUSH_CATEGORIES = [
  { key: 'essentials', label: 'Essentials', eyebrow: 'Fall foundation' },
  { key: 'women', label: 'Women', eyebrow: 'Women’s edit' },
  { key: 'outerwear', label: 'Outerwear', eyebrow: 'Jackets · layers' },
  { key: 'hoodies', label: 'Hoodies & Sweats', eyebrow: 'Fleece · crews · zip layers' },
  { key: 'jerseys', label: 'Jerseys & Polos', eyebrow: 'Sport · collar · uniform' },
  { key: 'tops', label: 'Tees & Tops', eyebrow: 'Core layers' },
  { key: 'bottoms', label: 'Bottoms', eyebrow: 'Pants · shorts · trousers' },
  { key: 'accessories', label: 'Accessories', eyebrow: 'Finishing pieces' },
];

function haystack(product) {
  const tags = Array.isArray(product?.tags) ? product.tags.join(' ') : product?.tags || '';
  return `${product?.title || ''} ${product?.handle || ''} ${product?.product_type || ''} ${product?.productType || ''} ${product?.vendor || ''} ${tags}`.toLowerCase();
}

export function isWomenProduct(product) {
  const text = haystack(product);
  return /\b(women|woman|womens|women's|female|audience:women|gender:women|line:women|collection:women)\b/.test(text);
}

export function isEssentialsProduct(product) {
  const text = haystack(product);
  return /\b(essential|essentials|line:essentials|collection:essentials|status:essential)\b/.test(text);
}

export function stushCategoryKeys(product) {
  const text = haystack(product);
  const keys = [];

  if (isEssentialsProduct(product)) keys.push('essentials');
  if (isWomenProduct(product)) keys.push('women');

  if (/\b(jacket|blazer|coat|outerwear|bomber|varsity|windbreaker|overshirt|puffer)\b/.test(text)) keys.push('outerwear');
  else if (/\b(hoodie|hooded|sweatshirt|crewneck|fleece)\b/.test(text)) keys.push('hoodies');
  else if (/\b(jersey|polo)\b/.test(text)) keys.push('jerseys');
  else if (/\b(pant|pants|trouser|trousers|short|shorts|denim|jean|jeans|jogger|joggers|skirt)\b/.test(text)) keys.push('bottoms');
  else if (/\b(hat|cap|beanie|bag|sock|socks|belt|accessory|accessories|scarf|wallet|jewelry|jewellery)\b/.test(text)) keys.push('accessories');
  else keys.push('tops');

  return [...new Set(keys)];
}

export function stushCategoryKey(product) {
  const keys = stushCategoryKeys(product);
  return keys.find(key => !['essentials', 'women'].includes(key)) || keys[0] || 'tops';
}

function familyRank(product) {
  const text = haystack(product);
  if (/\b(jacket|blazer|coat|bomber|varsity|windbreaker|overshirt|puffer)\b/.test(text)) return 10;
  if (/\b(zip hoodie|zip-up hoodie|zip through hoodie|hoodie|hooded)\b/.test(text)) return 20;
  if (/\b(sweatshirt|crewneck|fleece)\b/.test(text)) return 30;
  if (/\b(jersey)\b/.test(text)) return 40;
  if (/\b(polo)\b/.test(text)) return 45;
  if (/\b(long sleeve|long-sleeve)\b/.test(text)) return 50;
  if (/\b(tee|t-shirt|top)\b/.test(text)) return 60;
  if (/\b(tank|sleeveless)\b/.test(text)) return 65;
  if (/\b(short|shorts)\b/.test(text)) return 70;
  if (/\b(trouser|chino|denim|jean)\b/.test(text)) return 80;
  if (/\b(pant|pants|sweatpant|jogger)\b/.test(text)) return 85;
  if (/\b(hat|cap|beanie|bag|sock|belt|scarf|wallet)\b/.test(text)) return 90;
  return 99;
}

export function sortStushProducts(products = []) {
  return [...products].sort((a, b) => {
    const family = familyRank(a) - familyRank(b);
    if (family) return family;
    const typeA = `${a.product_type || a.productType || ''}`;
    const typeB = `${b.product_type || b.productType || ''}`;
    const typeCompare = typeA.localeCompare(typeB);
    if (typeCompare) return typeCompare;
    return `${a.title || ''}`.localeCompare(`${b.title || ''}`);
  });
}

export function groupStushProducts(products = []) {
  const grouped = Object.fromEntries(STUSH_CATEGORIES.map(category => [category.key, []]));
  for (const product of sortStushProducts(products)) {
    for (const key of stushCategoryKeys(product)) {
      if (grouped[key]) grouped[key].push(product);
    }
  }
  return grouped;
}

export function categoryForKey(key) {
  return STUSH_CATEGORIES.find(category => category.key === key);
}
