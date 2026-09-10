'use client';

import { useEffect, useMemo, useState } from 'react';
import CurtainCard from '@/components/CurtainCard';

export default function CollectionBrowser({ products = [], categories = [] }) {
  const validKeys = useMemo(() => new Set(['all', ...categories.map(category => category.key)]), [categories]);
  const [active, setActive] = useState('all');

  useEffect(() => {
    const syncFromHash = () => {
      const next = window.location.hash.replace('#', '').toLowerCase() || 'all';
      setActive(validKeys.has(next) ? next : 'all');
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [validKeys]);

  const filtered = active === 'all' ? products : products.filter(product => product.stushCategory === active);
  const activeCategory = categories.find(category => category.key === active);
  const title = active === 'all' ? 'The Full Edit' : activeCategory?.label || 'The Full Edit';
  const eyebrow = active === 'all' ? 'STUSH / CURRENT COLLECTION' : activeCategory?.eyebrow || 'STUSH / CURRENT COLLECTION';

  const choose = (key) => {
    setActive(key);
    if (window.location.hash !== `#${key}`) history.replaceState(null, '', `#${key}`);
    document.querySelector('.collection-browser__head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="collection-browser" aria-label="STUSH collection browser">
      <nav className="collection-browser__nav" aria-label="Filter STUSH collection">
        <button type="button" className={active === 'all' ? 'is-active' : ''} onClick={() => choose('all')} aria-pressed={active === 'all'}>
          <span>All</span><small>{products.length}</small>
        </button>
        {categories.map(category => (
          <button type="button" key={category.key} className={active === category.key ? 'is-active' : ''} onClick={() => choose(category.key)} aria-pressed={active === category.key}>
            <span>{category.label}</span><small>{category.count}</small>
          </button>
        ))}
      </nav>

      <div className="collection-browser__head" data-stush-reveal>
        <div>
          <span className="collection-browser__eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <div className="collection-browser__summary">
          <strong>{filtered.length}</strong>
          <span>{filtered.length === 1 ? 'piece' : 'pieces'}</span>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="collection-browser__grid">
          {filtered.map((product, index) => (
            <CurtainCard key={product.id} product={product} priority={index < 6} />
          ))}
        </div>
      ) : (
        <div className="collection-browser__empty">
          <span>THIS EDIT IS BEING CURATED.</span>
          <button type="button" onClick={() => choose('all')}>Return to all pieces</button>
        </div>
      )}
    </section>
  );
}
