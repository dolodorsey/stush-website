import Image from 'next/image';
import { formatPrice } from '@/lib/shopify';
import { getCommerceLeadImage, getCommerceHoverImage } from '@/lib/stush-merchandising';

export default function CurtainCard({ product, priority = false }) {
  if (!product) return null;
  const variant = product.variants?.find(item => item.available !== false) || product.variants?.[0];
  const coverImage = product.coverImage || getCommerceLeadImage(product);
  const hoverImage = product.hoverImage || getCommerceHoverImage(product);
  const cover = coverImage?.src || coverImage?.url || null;
  const hover = hoverImage?.src || hoverImage?.url || null;
  const price = formatPrice(product.price || variant?.price);
  const productUrl = `/products/${product.handle}`;
  const hasHover = Boolean(hover && hover !== cover);
  const cleanTitle = product.title?.replace(/^Stush\s*[—-]\s*/i, '') || 'STUSH piece';

  return (
    <a href={productUrl} className="stush-product-card" aria-label={product.title || cleanTitle}>
      <div className="stush-product-card__media">
        {cover && (
          <Image
            src={cover}
            alt={coverImage?.alt || coverImage?.altText || cleanTitle}
            className="stush-product-card__img stush-product-card__img--primary"
            fill
            sizes="(max-width: 620px) 50vw, (max-width: 1000px) 33vw, 25vw"
            priority={priority}
          />
        )}
        {hasHover && (
          <Image
            src={hover}
            alt=""
            className="stush-product-card__img stush-product-card__img--hover"
            fill
            sizes="(max-width: 620px) 50vw, (max-width: 1000px) 33vw, 25vw"
          />
        )}
        <span className="stush-product-card__action">View piece</span>
      </div>
      <div className="stush-product-card__meta">
        <span className="stush-product-card__name">{cleanTitle}</span>
        <span className="stush-product-card__price">{price}</span>
      </div>
    </a>
  );
}
