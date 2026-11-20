'use client';

import { useEffect, useMemo, useState } from 'react';
import ShopCard from '@/components/ShopCard';

const SORTS = [
  ['featured', 'Featured'],
  ['new', 'Newest'],
  ['low', 'Price: low to high'],
  ['high', 'Price: high to low'],
];

export default function ShopFloor({ products = [], categories = [] }) {
  const keys = useMemo(() => new Set(['all', ...categories.map(category => category.key)]), [categories]);
  const [active, setActive] = useState('all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    const sync = () => {
      const next = window.location.hash.replace('#', '').toLowerCase() || 'all';
      setActive(keys.has(next) ? next : 'all');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [keys]);

  const choose = key => {
    setActive(key);
    history.replaceState(null, '', key === 'all' ? window.location.pathname : `#${key}`);
  };

  const list = useMemo(() => {
    const filtered = active === 'all' ? [...products] : products.filter(product => product.categories.includes(active));
    if (sort === 'low' || sort === 'high') {
      filtered.sort((a, b) => (parseFloat(a.price) - parseFloat(b.price)) * (sort === 'low' ? 1 : -1));
    } else if (sort === 'new') {
      filtered.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    }
    if (sort !== 'featured') return filtered;
    return [...filtered.filter(product => product.available), ...filtered.filter(product => !product.available)];
  }, [products, active, sort]);

  return (
    <section className="sf-floor" aria-label="Shop STUSH">
      <div className="sf-bar sf-bar--sticky">
        <nav className="sf-chips" aria-label="Filter by category">
          <button type="button" className={active === 'all' ? 'is-on' : ''} aria-pressed={active === 'all'} onClick={() => choose('all')}>
            All <small>{products.length}</small>
          </button>
          {categories.filter(category => category.count > 0).map(category => (
            <button type="button" key={category.key} className={active === category.key ? 'is-on' : ''}
              aria-pressed={active === category.key} onClick={() => choose(category.key)}>
              {category.label} <small>{category.count}</small>
            </button>
          ))}
        </nav>
        <label className="sf-sort">
          <span>Sort</span>
          <select value={sort} onChange={event => setSort(event.target.value)}>
            {SORTS.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
        </label>
      </div>

      <p className="sf-count" role="status">{list.length} {list.length === 1 ? 'piece' : 'pieces'}</p>
      <div className="sf-grid">
        {list.map((product, index) => <ShopCard key={product.id} product={product} priority={index < 8} />)}
      </div>
      {list.length === 0 && (
        <div className="sf-empty">
          <p>Nothing in this edit right now.</p>
          <button type="button" onClick={() => choose('all')}>See everything</button>
        </div>
      )}
    </section>
  );
}
