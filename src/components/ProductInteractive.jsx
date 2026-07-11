'use client';

import { useState, useMemo } from 'react';

// Client-side interactive product page: variant selection + image gallery + cart URL
// Props:
//   product   — full Shopify Admin product JSON
//   store     — 'https://www.bodegabodegabodega.com' (already includes protocol)
//   description — plain-text description (pre-computed on server)

export default function ProductInteractive({ product, store, description }) {
  const images = product.images || [];
  const variants = product.variants || [];
  const optionNames = (product.options || []).filter(o => o.name !== 'Title');

  // Initialize selected options from first variant
  const [selected, setSelected] = useState(() => {
    const initial = {};
    optionNames.forEach((opt, idx) => {
      const optionKey = `option${idx + 1}`;
      initial[opt.name] = variants[0]?.[optionKey] || opt.values[0];
    });
    return initial;
  });

  const [mainImgIdx, setMainImgIdx] = useState(0);

  // Compute the currently selected variant based on selected options
  const currentVariant = useMemo(() => {
    if (variants.length === 0) return null;
    if (optionNames.length === 0) return variants[0];
    return variants.find(v =>
      optionNames.every((opt, idx) => v[`option${idx + 1}`] === selected[opt.name])
    ) || variants[0];
  }, [selected, variants, optionNames]);

  // Cart URL for the currently selected variant
  const cartUrl = currentVariant?.id
    ? `${store}/cart/${currentVariant.id}:1`
    : `${store}/cart`;

  // Format price
  const fmt = (v) => v ? `$${parseFloat(v).toFixed(0)}` : '';
  const price = fmt(currentVariant?.price);
  const comparePrice = currentVariant?.compare_at_price ? fmt(currentVariant.compare_at_price) : null;

  const inStock = currentVariant?.inventory_quantity > 0 || currentVariant?.inventory_policy === 'continue';

  const selectOption = (name, value) => {
    setSelected(prev => ({ ...prev, [name]: value }));
  };

  const mainImg = images[mainImgIdx] || images[0];

  return (
    <div className="pdp">
      {/* Gallery */}
      <div className="pdp__gallery">
        {mainImg ? (
          <img
            src={mainImg.src}
            alt={mainImg.alt || product.title}
            className="pdp__img pdp__img--main"
            loading="eager"
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
          />
        ) : (
          <div className="pdp__img" style={{ background: 'var(--bass-soft)', aspectRatio: '3/4' }} />
        )}

        {images.length > 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(images.length, 6)}, 1fr)`,
            gap: 8,
            marginTop: 16,
          }}>
            {images.slice(0, 6).map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => setMainImgIdx(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === mainImgIdx}
                style={{
                  padding: 0,
                  border: i === mainImgIdx ? '2px solid var(--gold)' : '1px solid var(--bass-line)',
                  background: 'transparent',
                  cursor: 'pointer',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
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
          {comparePrice && comparePrice !== price && (
            <span className="meta" style={{ textDecoration: 'line-through', opacity: 0.6 }}>
              {comparePrice}
            </span>
          )}
        </div>

        {description && <p className="pdp__desc">{description}</p>}

        {/* Variant options — INTERACTIVE */}
        {optionNames.map(opt => (
          <div className="pdp__variants" key={opt.name}>
            <span className="pdp__var-label">
              {opt.name}: <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>{selected[opt.name]}</em>
            </span>
            <div className="pdp__var-options">
              {opt.values.map(val => {
                const isSelected = selected[opt.name] === val;
                return (
                  <button
                    key={val}
                    onClick={() => selectOption(opt.name, val)}
                    className="pdp__var-opt"
                    aria-pressed={isSelected}
                    style={{
                      background: isSelected ? 'var(--ink)' : 'transparent',
                      color: isSelected ? 'var(--cream)' : 'var(--ink)',
                      borderColor: isSelected ? 'var(--ink)' : 'var(--bass-line)',
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTAs */}
        <div className="pdp__cta">
          <a
            href={cartUrl}
            className="btn-primary"
            aria-disabled={!currentVariant}
            style={{ opacity: currentVariant ? 1 : 0.5, pointerEvents: currentVariant ? 'auto' : 'none' }}
          >
            {inStock === false ? 'Sold Out' : 'Add to Bag'}
          </a>
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
            {currentVariant?.sku && <span>SKU: {currentVariant.sku}</span>}
            {currentVariant?.weight && <span>Weight: {currentVariant.weight}{currentVariant.weight_unit || 'g'}</span>}
            <span>{variants.length} variant{variants.length !== 1 ? 's' : ''} available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
