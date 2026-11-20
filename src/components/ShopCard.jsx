'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { money } from '@/lib/stush-shop-cards';

export default function ShopCard({ product, priority = false }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const options = product.options || [];
  const singleVariant = options.length === 0 || product.variants.length === 1;

  const variant = useMemo(() => {
    if (singleVariant) return product.variants[0] || null;
    if (options.some(option => !picked[option.name])) return null;
    return product.variants.find(item => options.every((option, index) => item.options[index] === picked[option.name])) || null;
  }, [picked, product.variants, options, singleVariant]);

  const isAvailable = (name, value) => {
    const index = options.findIndex(option => option.name === name);
    return product.variants.some(item => item.available && item.options[index] === value
      && options.every((option, i) => i === index || !picked[option.name] || item.options[i] === picked[option.name]));
  };

  const buy = async () => {
    if (!variant?.available) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productHandle: product.handle, variantId: variant.id, variantTitle: variant.title, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) throw new Error(data.message || 'Checkout is unavailable.');
      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout is unavailable.');
      setBusy(false);
    }
  };

  const href = `/products/${product.handle}`;
  const label = !product.available ? 'Sold out'
    : busy ? 'Opening checkout…'
    : variant ? (variant.available ? `Buy now · ${money(variant.price)}` : 'Unavailable')
    : `Select ${options.find(option => !picked[option.name])?.name?.toLowerCase() || 'option'}`;

  return (
    <article className={`sf-card${product.hover ? ' sf-card--hover' : ''}${open ? ' is-open' : ''}`}>
      <a href={href} className="sf-card__media" aria-label={product.title}>
        {product.cover && (
          <Image src={product.cover} alt={product.title} fill className="sf-card__img sf-card__img--a"
            sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" priority={priority} />
        )}
        {product.hover && (
          <Image src={product.hover} alt="" aria-hidden="true" fill className="sf-card__img sf-card__img--b"
            sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" />
        )}
        {!product.available && <span className="sf-card__flag">Sold out</span>}
        {product.compareAt && parseFloat(product.compareAt) > parseFloat(product.price) && <span className="sf-card__flag sf-card__flag--sale">Sale</span>}
      </a>

      {product.available && (
        <button type="button" className="sf-card__quick" onClick={() => setOpen(value => !value)} aria-expanded={open}>
          {open ? 'Close' : 'Quick buy +'}
        </button>
      )}

      {open && (
        <div className="sf-card__panel">
          {options.map(option => (
            <div className="sf-card__opt" key={option.name}>
              <span>{option.name}</span>
              <div>
                {option.values.map(value => {
                  const ok = isAvailable(option.name, value);
                  return (
                    <button type="button" key={value} disabled={!ok}
                      className={picked[option.name] === value ? 'is-picked' : ''}
                      onClick={() => setPicked(prev => ({ ...prev, [option.name]: value }))}>
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button type="button" className="sf-card__buy" disabled={!variant?.available || busy} onClick={buy}>{label}</button>
          {error && <p className="sf-card__error" role="status">{error}</p>}
        </div>
      )}

      <a href={href} className="sf-card__meta">
        <span className="sf-card__name">{product.title}</span>
        <span className="sf-card__price">
          {product.compareAt && parseFloat(product.compareAt) > parseFloat(product.price) && <s>{money(product.compareAt)}</s>}
          {money(product.price)}
        </span>
      </a>
    </article>
  );
}
