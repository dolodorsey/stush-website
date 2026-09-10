const STOCK_MODEL_MEDIA = /\b(model|lifestyle|on[- ]?body|wearing|worn by|person|people|man|woman|male|female|mock[- ]?up|stock photo|studio model)\b/i;
const BACK_VIEW_MEDIA = /\b(back|rear|reverse|backside|back view)\b/i;
const APPROVED_COMMERCE_MEDIA = /\b(front|hero|main|product|flat|flatlay|flat lay|detail|close[- ]?up|isolated|ghost mannequin|garment|product only)\b/i;
const BACK_FOCAL_PRODUCT = /\b(back print|back graphic|back design|rear graphic|focal:back|design:back)\b/i;

function productText(product) {
  const tags = Array.isArray(product?.tags) ? product.tags.join(' ') : product?.tags || '';
  return `${product?.title || ''} ${product?.product_type || ''} ${product?.productType || ''} ${tags}`.toLowerCase();
}

function imageText(image) {
  return `${image?.alt || image?.altText || ''} ${image?.src || image?.url || ''}`.toLowerCase();
}

function imageSrc(image) {
  return image?.src || image?.url || null;
}

function compactImage(image) {
  if (!image) return null;
  const src = imageSrc(image);
  if (!src) return null;
  return {
    id: image.id || image.mediaId || src,
    src,
    alt: image.alt || image.altText || '',
    width: image.width || 1400,
    height: image.height || 1400,
  };
}

export function isBackDesignFocal(product) {
  return BACK_FOCAL_PRODUCT.test(productText(product));
}

export function isStockModelImage(image) {
  return STOCK_MODEL_MEDIA.test(imageText(image));
}

export function isNonFocalBackImage(image, product) {
  return BACK_VIEW_MEDIA.test(imageText(image)) && !isBackDesignFocal(product);
}

export function isExplicitlyApprovedCommerceImage(image) {
  return APPROVED_COMMERCE_MEDIA.test(imageText(image));
}

function isRejected(image, product) {
  return !imageSrc(image) || isStockModelImage(image) || isNonFocalBackImage(image, product);
}

export function getCommerceLeadImage(product) {
  const images = product?.images || [];
  if (!images.length) return null;

  const explicitFront = images.find(image => {
    const text = imageText(image);
    return !isRejected(image, product) && /\b(front|hero|main|product only|isolated|ghost mannequin)\b/i.test(text);
  });
  if (explicitFront) return explicitFront;

  // Shopify's featured/first image is the safest fallback for catalog presentation.
  const first = images[0];
  if (first && !isRejected(first, product)) return first;

  return images.find(image => !isRejected(image, product)) || null;
}

export function getCommerceGalleryImages(product) {
  const images = product?.images || [];
  if (!images.length) return [];

  const lead = getCommerceLeadImage(product);
  const leadSrc = imageSrc(lead);

  // Secondary storefront media must identify itself as product/detail media.
  // Unlabelled vendor mockups are intentionally not promoted into the STUSH storefront.
  const approvedSecondary = images.filter((image, index) => {
    if (imageSrc(image) === leadSrc) return false;
    if (isRejected(image, product)) return false;
    if (index === 0) return true;
    return isExplicitlyApprovedCommerceImage(image);
  });

  const result = [lead, ...approvedSecondary].filter(Boolean);
  const seen = new Set();
  return result.filter(image => {
    const src = imageSrc(image);
    if (!src || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

export function getCommerceHoverImage(product) {
  const gallery = getCommerceGalleryImages(product);
  return gallery[1] || null;
}

// Keep collection-browser client payloads lean. Product descriptions, every variant,
// and full media galleries stay on the server; cards only receive what they render.
export function getCommerceCardProduct(product) {
  const variant = product?.variants?.find(item => item.available !== false) || product?.variants?.[0];
  return {
    id: product?.id,
    title: product?.title || '',
    handle: product?.handle || '',
    price: variant?.price || null,
    available: variant?.available !== false,
    coverImage: compactImage(getCommerceLeadImage(product)),
    hoverImage: compactImage(getCommerceHoverImage(product)),
  };
}
