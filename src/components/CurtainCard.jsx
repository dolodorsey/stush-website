'use client';
import { formatPrice } from '@/lib/shopify';
import { getCommerceLeadImage, getCommerceHoverImage } from '@/lib/stush-merchandising';

export default function CurtainCard({ product, priority = false }) {
  if (!product) return null;
  const variant = product.variants?.find(item => item.available !== false) || product.variants?.[0];
  const coverImage = getCommerceLeadImage(product);
  const revealImage = getCommerceHoverImage(product);
  const cover = coverImage?.src || coverImage?.url || null;
  const reveal = revealImage?.src || revealImage?.url || null;
  const price = formatPrice(variant?.price);
  const productUrl = `/products/${product.handle}`;
  const hasReveal = Boolean(reveal && reveal !== cover);

  return (
    <a href={productUrl} className="curtain" aria-label={product.title} data-cursor="view">
      {hasReveal && <img src={reveal} alt="" className="curtain__base" loading={priority ? 'eager' : 'lazy'} />}
      {!hasReveal && cover && <img src={cover} alt={coverImage?.alt || coverImage?.altText || product.title} className="curtain__base" loading={priority ? 'eager' : 'lazy'} />}
      {hasReveal && <div className="curtain__panels" aria-hidden="true"><div className="curtain__panel curtain__panel--left" style={{ '--curtain-img': `url("${cover}")` }}/><div className="curtain__panel curtain__panel--right" style={{ '--curtain-img': `url("${cover}")` }}/></div>}
      <div className="curtain__meta"><span className="curtain__name">{product.title}</span><span className="curtain__price">{price}</span></div>
      {variant?.id && <span className="curtain__add">View the piece</span>}
    </a>
  );
}
