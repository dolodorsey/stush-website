'use client';
import { formatPrice } from '@/lib/shopify';
import { getCommerceLeadImage, getCommerceHoverImage } from '@/lib/stush-merchandising';

export default function CurtainCard({ product, priority = false }) {
  if (!product) return null;
  const variant = product.variants?.find(item => item.available !== false) || product.variants?.[0];
  const coverImage = getCommerceLeadImage(product);
  const hoverImage = getCommerceHoverImage(product);
  const cover = coverImage?.src || coverImage?.url || null;
  const hover = hoverImage?.src || hoverImage?.url || null;
  const price = formatPrice(variant?.price);
  const productUrl = `/products/${product.handle}`;
  const hasHover = Boolean(hover && hover !== cover);

  return (
    <a href={productUrl} className="stush-product-card" aria-label={product.title} data-cursor="view">
      <div className="stush-product-card__media">
        {cover && <img src={cover} alt={coverImage?.alt || coverImage?.altText || product.title} className="stush-product-card__img stush-product-card__img--primary" loading={priority ? 'eager' : 'lazy'} />}
        {hasHover && <img src={hover} alt="" className="stush-product-card__img stush-product-card__img--hover" loading="lazy" />}
        <span className="stush-product-card__action">View piece</span>
      </div>
      <div className="stush-product-card__meta">
        <span className="stush-product-card__name">{product.title?.replace(/^Stush\s*[—-]\s*/i, '')}</span>
        <span className="stush-product-card__price">{price}</span>
      </div>
    </a>
  );
}
