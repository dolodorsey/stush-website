import { getCommerceLeadImage, getCommerceHoverImage } from '@/lib/stush-merchandising';
import { stushCategoryKey, stushCategoryKeys } from '@/lib/stush-categories';

const src = image => image?.src || image?.url || null;

// Compact, serializable card payload for the shop-first UI (2026-11-19 rebuild).
// Carries just enough variant data for quick-buy without a second fetch.
export function toShopCard(product) {
  const variants = (product?.variants || []).map(variant => ({
    id: variant.id,
    title: variant.title,
    price: variant.price,
    compareAt: variant.compare_at_price || null,
    available: variant.available !== false,
    options: [variant.option1, variant.option2, variant.option3].filter(Boolean),
  }));
  const options = (product?.options || [])
    .filter(option => option?.name && option.name !== 'Title')
    .map(option => ({ name: option.name, values: option.values || [] }));
  const lead = variants.find(variant => variant.available) || variants[0];
  const cover = src(getCommerceLeadImage(product));
  const hover = src(getCommerceHoverImage(product));
  const title = (product?.title || '').replace(/^Stush\s*[—-]\s*/i, '') || 'STUSH piece';

  return {
    id: product?.id,
    handle: product?.handle,
    title,
    type: product?.product_type || '',
    price: lead?.price || null,
    compareAt: lead?.compareAt || null,
    available: variants.some(variant => variant.available),
    cover,
    hover: hover && hover !== cover ? hover : null,
    createdAt: product?.created_at || product?.published_at || null,
    category: stushCategoryKey(product),
    categories: stushCategoryKeys(product),
    options,
    variants,
  };
}

export function money(value) {
  const number = parseFloat(value);
  return Number.isNaN(number) ? '' : `$${number.toFixed(0)}`;
}
