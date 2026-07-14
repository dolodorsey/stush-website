const CATEGORY_RULES = [
  { id: 'outerwear', label: 'Outerwear', test: /\b(jacket|blazer|coat|outerwear)\b/i },
  { id: 'hoodies', label: 'Hoodies', test: /\b(hoodie|hooded)\b/i },
  { id: 'sweatshirts', label: 'Sweatshirts', test: /\b(sweatshirt|crewneck)\b/i },
  { id: 'polos', label: 'Polos', test: /\bpolo\b/i },
  { id: 'tees', label: 'T-Shirts', test: /\b(t-?shirt|tee)\b/i },
  { id: 'tanks', label: 'Tanks', test: /\btank\b/i },
  { id: 'bottoms', label: 'Pants & Sweatpants', test: /\b(sweatpants|pants|trouser|chino)\b/i },
  { id: 'shorts', label: 'Shorts', test: /\b(shorts|biker short)\b/i },
  { id: 'jerseys', label: 'Jerseys', test: /\bjersey\b/i },
  { id: 'active', label: 'Active', test: /\b(sports bra|legging)\b/i },
  { id: 'accessories', label: 'Accessories', test: /\b(bag|cap|hat|accessor)\b/i },
  { id: 'sets', label: 'Sets', test: /\bset\b/i },
];

export function groupProductsByType(products) {
  const grouped = new Map(CATEGORY_RULES.map(rule => [rule.id, { ...rule, products: [] }]));
  const other = { id: 'other', label: 'Other', products: [] };

  products.forEach(product => {
    const searchable = `${product.product_type || ''} ${product.title || ''}`;
    const rule = CATEGORY_RULES.find(item => item.test.test(searchable));
    (rule ? grouped.get(rule.id) : other).products.push(product);
  });

  return [...grouped.values(), other].filter(section => section.products.length > 0);
}
