'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const COLOR_MAP = {
  'Charcoal': '#36454F',
  'Sport Grey': '#8B8B8B',
  'Graphite': '#4A4A4A',
  'Natural': '#E8DCC8',
  'Dark Heather': '#5C5C5C',
  'Black': '#1A1A1A',
  'Red': '#C41E3A',
  'Military Green': '#4B5320',
  'Royal': '#2B4EA2',
  'Maroon': '#6B1C2A',
  'White': '#F0EDE6',
  'purple color': '#6A3D8E',
  'Navy': '#1B2A4A',
  'Forest': '#1E4D2B',
  'Sand': '#C2B280',
  'Light pink': '#E8B4B4',
  'Irish Green': '#009A44',
  'Light  blue': '#7FB3D8',
  'Rose Pink Color': '#D4707A',
  'dark green': '#2D5A1E',
  'Dark Blue': '#1B2A4A',
  'Royal Blue': '#2B4EA2',
  'Charcoal Black Triblend': '#333333',
  'Athletic Grey Triblend': '#999999',
  'Vintage Smoke': '#6B6B6B',
  'Vintage Navy': '#2C3E5A',
};

function getSwatchColor(colorName) {
  return COLOR_MAP[colorName] || '#555';
}

export default function ColorCycleCard({ product, storeUrl }) {
  const { title, handle, variants, images, options } = product;
  const firstImage = images?.[0]?.src;
  const firstVariantId = variants?.[0]?.id;
  const price = variants?.[0]?.price;
  if (!firstImage) return null;

  // Find color option
  const colorOption = options?.find(o => o.name.toLowerCase() === 'color');
  const colorValues = colorOption ? colorOption.values : [];

  // Build color→image map from variants
  const colorPos = colorOption?.position || 0;
  const imageMap = {};
  images?.forEach(img => { imageMap[img.id] = img.src; });

  const colorImages = [];
  const colorVariantIds = {};
  const seenColors = new Set();

  variants?.forEach(v => {
    const color = v[`option${colorPos}`];
    if (color && !seenColors.has(color) && v.image_id && imageMap[v.image_id]) {
      seenColors.add(color);
      colorImages.push({ color, src: imageMap[v.image_id], variantId: v.id });
      colorVariantIds[color] = v.id;
    }
  });

  const hasMultipleColors = colorImages.length > 1;

  // If no color-mapped images, fall back to cycling through all product images
  const cycleImages = hasMultipleColors
    ? colorImages.map(c => ({ src: c.src, label: c.color, variantId: c.variantId }))
    : images?.length > 1
      ? images.slice(0, 6).map(img => ({ src: img.src, label: '', variantId: firstVariantId }))
      : [{ src: firstImage, label: '', variantId: firstVariantId }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  const cardRef = useRef(null);

  // Auto-cycle on hover for multi-color products
  useEffect(() => {
    if (!hasMultipleColors) return;
    if (isHovering && cycleImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % cycleImages.length);
      }, 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovering, cycleImages.length, hasMultipleColors]);

  const handleDotClick = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(idx);
    clearInterval(intervalRef.current);
  }, []);

  const currentImage = cycleImages[activeIndex];
  const currentVariantId = currentImage?.variantId || firstVariantId;

  const priceNum = parseFloat(price);
  const priceStr = '$' + priceNum.toFixed(2);

  return (
    <a
      ref={cardRef}
      href={`${storeUrl}/products/${handle}`}
      className={`dc${hasMultipleColors ? ' dc--multi' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); clearInterval(intervalRef.current); }}
    >
      <div className="dc__wrap">
        {/* Preload all images, crossfade active one */}
        {cycleImages.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={`${title}${img.label ? ` — ${img.label}` : ''}`}
            className={`dc__img dc__img--layer${i === activeIndex ? ' dc__img--active' : ''}`}
            loading="lazy"
          />
        ))}

        {/* Color swatch dots — only for multi-color */}
        {hasMultipleColors && (
          <div className="dc__dots">
            {cycleImages.slice(0, 8).map((img, i) => (
              <button
                key={i}
                className={`dc__dot${i === activeIndex ? ' dc__dot--active' : ''}`}
                style={{ background: getSwatchColor(img.label) }}
                onClick={(e) => handleDotClick(e, i)}
                aria-label={img.label}
                title={img.label}
              />
            ))}
            {cycleImages.length > 8 && (
              <span className="dc__dot-more">+{cycleImages.length - 8}</span>
            )}
          </div>
        )}

        <a
          href={`${storeUrl}/cart/${currentVariantId}:1`}
          className="dc__cta"
          onClick={(e) => e.stopPropagation()}
        >
          Add to Cart
        </a>
      </div>
      <div className="dc__info">
        <div className="dc__name">{title}</div>
        <div className="dc__meta">
          <div className="dc__price">{priceStr}</div>
          {hasMultipleColors && (
            <div className="dc__color-count">{colorImages.length} colors</div>
          )}
        </div>
      </div>
    </a>
  );
}
