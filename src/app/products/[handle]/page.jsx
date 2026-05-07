import { getProductByHandle, formatPrice, plainDescription, cartAddUrl, SHOP_URL } from '@/lib/shopify';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) return {};
  return {
    title: `${product.title} — STUSH`,
    description: plainDescription(product.body_html, 160),
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  const images = product.images || [];
  const variants = product.variants || [];
  const firstVariant = variants[0];
  const price = formatPrice(firstVariant?.price);
  const comparePrice = firstVariant?.compare_at_price
    ? formatPrice(firstVariant.compare_at_price)
    : null;
  const description = plainDescription(product.body_html, 600);

  // Group variant options (Size, Color, etc.)
  const optionGroups = (product.options || []).filter(o => o.name !== 'Title');

  return (
    <>
      <div className="pdp">
        {/* Gallery */}
        <div className="pdp__gallery">
          {images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={img.id || i}
                src={img.src}
                alt={img.alt || product.title}
                className="pdp__img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))
          ) : (
            <div className="pdp__img" style={{ background: 'var(--bass-soft)' }} />
          )}
        </div>

        {/* Info */}
        <div className="pdp__info">
          <div>
            <span className="meta" style={{ marginBottom: 8, display: 'block' }}>
              {product.product_type || 'STUSH'}
            </span>
            <h1 className="pdp__title">{product.title}</h1>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span className="pdp__price">{price}</span>
            {comparePrice && (
              <span className="meta" style={{ textDecoration: 'line-through' }}>
                {comparePrice}
              </span>
            )}
          </div>

          {description && <p className="pdp__desc">{description}</p>}

          {/* Variant options */}
          {optionGroups.map(opt => (
            <div className="pdp__variants" key={opt.name}>
              <span className="pdp__var-label">{opt.name}</span>
              <div className="pdp__var-options">
                {opt.values.map(val => (
                  <button
                    key={val}
                    className="pdp__var-opt"
                    aria-pressed="false"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* CTAs */}
          <div className="pdp__cta">
            {firstVariant?.id && (
              <a href={cartAddUrl(firstVariant.id)} className="btn-primary">
                Add to Bag
              </a>
            )}
            <a href="/shop" className="btn-ghost">Continue Shopping</a>
          </div>

          {/* Details */}
          <div style={{
            borderTop: '1px solid var(--bass-line)',
            paddingTop: 24, marginTop: 8,
          }}>
            <span className="eyebrow" style={{ marginBottom: 12, display: 'block' }}>Details</span>
            <div className="meta" style={{ display: 'grid', gap: 6 }}>
              {product.vendor && <span>Vendor: {product.vendor}</span>}
              {product.product_type && <span>Type: {product.product_type}</span>}
              {firstVariant?.sku && <span>SKU: {firstVariant.sku}</span>}
              <span>
                {variants.length} variant{variants.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
