import { getProducts, formatPrice } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
const S = 'https://stushusa.myshopify.com';

const COLLECTIONS = [
  { title: 'New Arrivals', href: `${S}/collections/new-arrivals`, key: 'new-arrival-tag' },
  { title: 'Outerwear', href: `${S}/collections/outerwear`, key: 'Outerwear' },
  { title: 'Blazers & Suits', href: `${S}/collections/blazers-suits`, key: 'Blazers & Suits' },
  { title: 'Tops', href: `${S}/collections/tops`, key: 'Tops' },
  { title: 'Accessories', href: `${S}/collections/accessories`, key: 'Accessories' },
  { title: 'Denim & Trousers', href: `${S}/collections/denim-trousers`, key: 'Denim & Trousers' },
  { title: 'Sets', href: `${S}/collections/sets-1`, key: 'Sets' },
  { title: 'Hoodies & Sweatshirts', href: `${S}/collections/hoodies-sweatshirts`, key: 'hoodies-tag' },
  { title: 'Premium Collection', href: `${S}/collections/premium`, key: 'premium-tag' },
];

function FeaturedCard({ p }) {
  const img = p.images?.[0]?.src;
  const pr = p.variants?.[0]?.price;
  const vid = p.variants?.[0]?.id;
  if (!img) return null;
  return (
    <a href={`${S}/products/${p.handle}`} className="dc">
      <div className="dc__wrap">
        <img src={img} alt={p.title} className="dc__img" loading="lazy" />
        <a href={`${S}/cart/${vid}:1`} className="dc__cta">Add to Cart</a>
      </div>
      <div className="dc__info">
        <div className="dc__name">{p.title}</div>
        <div className="dc__price">{formatPrice(pr)}</div>
      </div>
    </a>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  // Get featured products (first from key categories)
  const featured = [];
  const categories = ['Outerwear', 'Blazers & Suits', 'Tops', 'Accessories'];
  categories.forEach(cat => {
    const items = products.filter(p => p.product_type === cat);
    featured.push(...items.slice(0, 3));
  });

  // Build category counts
  const byType = {};
  products.forEach(p => {
    const t = p.product_type || 'Other';
    if (!byType[t]) byType[t] = [];
    byType[t].push(p);
  });

  // Get first product image per collection for covers
  const collectionCovers = COLLECTIONS.map(c => {
    const items = byType[c.key] || [];
    const coverProduct = items[0];
    return { ...c, img: coverProduct?.images?.[0]?.src, count: items.length };
  }).filter(c => c.count > 0);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        {/* Placeholder — Dr. Dorsey will upload hero video/image */}
        <div className="hero__bg" style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #131313 100%)',
          position: 'absolute', inset: 0
        }} />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__tag">2026 Collection</div>
          <h1 className="hero__title">Stush<br /><em>Luxury</em></h1>
          <p className="hero__sub">Elevated streetwear and designer fashion for the culture. Where luxury meets the streets. Every piece is a statement.</p>
          <div className="hero__actions">
            <a href="/shop" className="btn-primary">Shop the Collection</a>
            <a href={`${S}/collections/all-products`} className="btn-secondary">View All</a>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="shop" style={{ borderTop: '1px solid var(--tx03)' }}>
        <div className="shop__header">
          <h2 className="shop__title">Featured Pieces</h2>
          <a href="/shop" className="shop__link">View All {products.length} Pieces &rarr;</a>
        </div>
        <div className="dgrid">
          {featured.slice(0, 10).map(p => <FeaturedCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* LOGOS */}
      <section style={{ padding: 'clamp(40px,5vw,64px) clamp(16px,3vw,48px)', background: 'var(--bg)', borderTop: '1px solid var(--tx03)', borderBottom: '1px solid var(--tx03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 'clamp(16px,2vw,32px)', maxWidth: 1100, margin: '0 auto', alignItems: 'center', justifyItems: 'center' }}>
          {[
            '/brand/StushW.png',
            '/brand/STUSH_COLLEGE.png',
            '/brand/RED.png',
            '/brand/STUSH2.png',
            '/brand/STUSH_OLYPICS.png',
            '/brand/stushsss.png',
            '/brand/ST.png',
            '/brand/STUSH4.png',
            '/brand/STUSH3.png',
            '/brand/STUSSS_.png',
            '/brand/STUSH.png',
            '/brand/STUSH0.png',
          ].map((src, i) => (
            <a key={i} href="/shop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: '1', padding: 'clamp(12px,2vw,24px)', transition: 'transform 0.5s var(--lux)' }}
              onMouseEnter={undefined}>
              <img src={src} alt="" loading="lazy" style={{ maxHeight: 'clamp(56px,7vw,90px)', maxWidth: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))' }} />
            </a>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <p className="manifesto__text">
          This isn&rsquo;t fast fashion. This isn&rsquo;t basic. This is <strong>elevated streetwear</strong> for the ones who understand
          that style is a language. <strong>Every piece tells a story. Make yours worth hearing.</strong>
        </p>
      </section>

      {/* COLLECTIONS */}
      <section className="collections">
        <div className="collections__header">
          <div className="section-tag">Shop by Category</div>
          <h2 className="section-title">The Collections</h2>
        </div>
        <div className="collections__grid">
          {collectionCovers.map((c, i) => (
            <a key={i} href={c.href} className="col-card">
              <div className="col-card__img">
                {c.img ? (
                  <img src={c.img} alt={c.title} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--s2)' }} />
                )}
              </div>
              <div className="col-card__info">
                <span className="col-card__title">{c.title}</span>
                <span className="col-card__count">{c.count}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee">
        <div className="marquee__track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="marquee__item">LUXURY IS A LIFESTYLE &bull; ELEVATED STREETWEAR &bull; STUSH &bull; THE KOLLECTIVE &bull;</span>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="movement" id="subscribe">
        <div className="movement__tag">Join the Movement</div>
        <h2 className="movement__title">First Dibs on Drops</h2>
        <p className="movement__desc">Exclusive access to new collections, limited drops, and insider-only pricing.</p>
        <div className="movement__form">
          <input type="email" className="movement__input" placeholder="Enter your email" />
          <button className="movement__submit">Join</button>
        </div>
      </section>
    </>
  );
}
