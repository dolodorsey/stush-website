'use client';

import { useState, useMemo } from 'react';

// Client-side interactive product page: variant selection + image gallery + cart URL
// Props:
//   product   — full Shopify Admin product JSON
//   store     — 'https://bodgeaworldwide.myshopify.com' (already includes protocol)
//   descriptionHtml — raw first-party body_html from Shopify (spec bullets, care line, size chart)

export default function ProductInteractive({ product, descriptionHtml }) {
  const images = product.images || [];
  const variants = product.variants || [];
  const optionNames = (product.options || []).filter(o => o.name !== 'Title');
  const hasSupplierSpecCover =
    images.length > 1 &&
    /(cap|hat|visor)/i.test(`${product.product_type || ''} ${product.title || ''}`);

  const firstAvailable = variants.find(variant => variant.available !== false) || variants[0];

  // Initialize selected options from the first purchasable variant.
  const [selected, setSelected] = useState(() => {
    const initial = {};
    optionNames.forEach((opt, idx) => {
      const optionKey = `option${idx + 1}`;
      initial[opt.name] = firstAvailable?.[optionKey] || opt.values[0];
    });
    return initial;
  });

  const [mainImgIdx, setMainImgIdx] = useState(hasSupplierSpecCover ? 1 : 0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Compute the currently selected variant based on selected options
  const currentVariant = useMemo(() => {
    if (variants.length === 0) return null;
    if (optionNames.length === 0) return variants[0];
    return variants.find(v =>
      optionNames.every((opt, idx) => v[`option${idx + 1}`] === selected[opt.name])
    ) || variants[0];
  }, [selected, variants, optionNames]);

  // Format price
  const fmt = (v) => v ? `$${parseFloat(v).toFixed(0)}` : '';
  const price = fmt(currentVariant?.price);
  const comparePrice = currentVariant?.compare_at_price ? fmt(currentVariant.compare_at_price) : null;

  const inStock = currentVariant?.available !== false;

  const selectOption = (name, value) => {
    const next = { ...selected, [name]: value };
    setSelected(next);
    const match = variants.find(variant =>
      optionNames.every((option, index) => variant[`option${index + 1}`] === next[option.name])
    );
    const imageId = match?.image_id || match?.featured_image?.id;
    const imageSrc = match?.featured_image?.src;
    const imageIndex = images.findIndex(image =>
      (imageId && image.id === imageId) || (imageSrc && image.src === imageSrc)
    );
    if (imageIndex >= 0) setMainImgIdx(hasSupplierSpecCover && imageIndex === 0 ? 1 : imageIndex);
  };

  const mainImg = images[mainImgIdx] || images[0];

  const beginCheckout = async () => {
    if (!currentVariant || !inStock) return;
    setCheckingOut(true);
    setCheckoutError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productHandle: product.handle,
          variantId: currentVariant.id,
          variantTitle: currentVariant.title,
          quantity: 1,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) throw new Error(data.message || 'Checkout is unavailable.');
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Checkout is unavailable.');
      setCheckingOut(false);
    }
  };

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

        {/* Full first-party product copy from Shopify — specs, care, size chart */}
        {descriptionHtml && (
          <div
            className="pdp__description"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

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
          <button
            type="button"
            onClick={beginCheckout}
            className="btn-primary"
            disabled={checkingOut || !currentVariant || !inStock}
            aria-disabled={!currentVariant || !inStock}
            style={{ opacity: currentVariant && inStock ? 1 : 0.5, pointerEvents: currentVariant && inStock ? 'auto' : 'none' }}
          >
            {inStock === false ? 'Sold Out' : checkingOut ? 'Preparing private checkout…' : 'Acquire this piece'}
          </button>
          <a href="/shop" className="btn-ghost">Continue Shopping</a>
        </div>
        {checkoutError && <p className="pdp__checkout-error" role="alert">{checkoutError}</p>}
        <div className="pdp__assurance" aria-label="Purchase assurances">
          <span>Live edition verification</span>
          <span>Secure Shopify checkout</span>
          <span>Curated fulfillment</span>
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
