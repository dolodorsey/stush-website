'use client';
import { formatPrice, pickHoverImage } from '@/lib/shopify';

/**
 * CurtainCard — STUSH signature interaction.
 *
 * The card has TWO image layers:
 * 1. Base layer (background image of the product) — visible on hover
 * 2. Curtain layer split into LEFT and RIGHT panels, each
 *    showing a HALF of the COVER image. On hover the panels slide outward,
 *    revealing the base layer underneath like a curtain parting.
 *
 * The illusion: the cover is "drawn back" to reveal what's behind it.
 */
export default function CurtainCard({ product, priority = false }) {
  if (!product) return null;
  const variant = product.variants?.find(item => item.available !== false) || product.variants?.[0];
  const variantImage = product.images?.find(image => image.id === variant?.image_id)?.src;
  const cover = variantImage || product.images?.[0]?.src;
  const reveal =
    product.images?.find(image => image.src !== cover)?.src ||
    pickHoverImage(product);
  const price = formatPrice(variant?.price);
  const productUrl = `/products/${product.handle}`;

  // If we don't have two distinct images, fall back to a simple zoom card
  const hasReveal = reveal && reveal !== cover;

  return (
    <a href={productUrl} className="curtain" aria-label={product.title}>
      {/* Base image — what's revealed when curtains part */}
      {hasReveal && (
        <img
          src={reveal}
          alt=""
          className="curtain__base"
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      {!hasReveal && cover && (
        <img
          src={cover}
          alt={product.title}
          className="curtain__base"
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* Curtain panels — each shows half of the cover image */}
      {hasReveal && (
        <div className="curtain__panels" aria-hidden="true">
          <div
            className="curtain__panel curtain__panel--left"
            style={{ '--curtain-img': `url("${cover}")` }}
          />
          <div
            className="curtain__panel curtain__panel--right"
            style={{ '--curtain-img': `url("${cover}")` }}
          />
        </div>
      )}

      <div className="curtain__meta">
        <span className="curtain__name">{product.title}</span>
        <span className="curtain__price">{price}</span>
      </div>

      {variant?.id && <span className="curtain__add">View the piece</span>}
    </a>
  );
}
