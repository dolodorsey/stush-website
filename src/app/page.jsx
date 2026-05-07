import { getProducts, getCollections, getCollectionProducts, formatPrice, SHOP_URL } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';

const COLLECTION_DISPLAY = [
  { handle: 'the-outerwear-vault', display: 'Outerwear', accent: 'Vault' },
  { handle: 'the-blazer-room',     display: 'Blazer',    accent: 'Room' },
  { handle: 'the-tops-gallery',    display: 'Tops',      accent: 'Gallery' },
  { handle: 'the-accessories-lab', display: 'Accessories',accent: 'Lab' },
];

export default async function HomePage() {
  const [allProducts, allCollections] = await Promise.all([
    getProducts({ limit: 250 }),
    getCollections(),
  ]);

  // Hero product — highest-priced with an image
  const sorted = [...allProducts]
    .filter(p => p.images?.length)
    .sort((a, b) => parseFloat(b.variants?.[0]?.price || 0) - parseFloat(a.variants?.[0]?.price || 0));
  const hero = sorted[0];
  const heroImg = hero?.images?.[0]?.src;

  // Collection strip — get product counts + first image per collection
  const stripData = await Promise.all(
    COLLECTION_DISPLAY.map(async (cd) => {
      const col = allCollections.find(c => c.handle === cd.handle);
      if (!col) return { ...cd, count: 0, img: null, id: null };
      const products = await getCollectionProducts(col.id, 4);
      const img = products?.[0]?.images?.[0]?.src || col.image?.src || null;
      return { ...cd, count: products.length, img, id: col.id };
    })
  );

  // Featured products — best sellers by position, first 8 with 2+ images (for curtain effect)
  const featured = allProducts
    .filter(p => (p.images?.length || 0) >= 2)
    .slice(0, 12);

  return (
    <>
      {/* ═══════ 1. HERO ═══════ */}
      <section className="hero">
        {heroImg && <img src={heroImg} alt="" className="hero__bg fadeIn" />}
        <div className="hero__overlay" />
        <div className="hero__inner">
          <div>
            <div className="hero__meta fadeUp">
              <span className="eyebrow eyebrow--gold">SS &bull; 26 Collection</span>
            </div>
            <h1 className="hero__title fadeUp-2">
              dressed for<br />
              <em><span className="hero__title-accent">THE</span> room</em>
            </h1>
          </div>
          <div className="hero__sidebar fadeUp-3">
            <p className="hero__sub">
              An editorial house from Atlanta. Statement pieces, runway-grade construction,
              and the confidence to wear it all.
            </p>
            <div className="hero__actions">
              <a href="/shop" className="btn-primary">Enter the Empire</a>
              <a href="/lookbook" className="btn-ghost">Lookbook</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. MARQUEE STRIP ═══════ */}
      <section className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          {[0,1].map(loop => (
            <span key={loop}>
              {['Outerwear', 'Blazers', 'Denim', 'Accessories', 'Sets', 'Atelier', 'Editorial', 'Atlanta'].map(w => (
                <span className="marquee-item" key={loop + w}>{w}</span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════ 3. COLLECTION STRIP ═══════ */}
      <section className="collection-strip">
        <div className="collection-strip__head">
          <h2 className="collection-strip__title">
            The <em>Collections</em>
          </h2>
          <a href="/collections" className="eyebrow eyebrow--gold" style={{ paddingBottom: 6 }}>
            View All →
          </a>
        </div>
        <div className="collection-strip__grid">
          {stripData.map(cd => (
            <a
              key={cd.handle}
              href={`/collections/${cd.handle}`}
              className="collection-card"
            >
              {cd.img && (
                <img
                  src={cd.img}
                  alt={cd.display}
                  className="collection-card__img"
                  loading="lazy"
                />
              )}
              <div className="collection-card__veil" />
              <div className="collection-card__copy">
                <div className="collection-card__name">
                  {cd.display} <em>{cd.accent}</em>
                </div>
                <div className="collection-card__count">
                  {cd.count}+ pieces
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ 4. STORY ═══════ */}
      <section className="story">
        <div className="story__inner">
          <span className="eyebrow story__eyebrow">The Story</span>
          <h2 className="story__head">
            We don&rsquo;t make <em>clothes</em>.<br />
            We make <span className="accent">entrances</span>.
          </h2>
          <div className="story__body">
            <p>
              <strong>STUSH started with a single blazer and a city that never asked permission.</strong>{' '}
              Atlanta raised us — the music, the hustle, the rooms you have to earn your way into.
              Every piece is designed for that moment when the door opens and the conversation stops.
            </p>
            <p>
              Runway-grade construction. Street-born attitude. Limited runs because the room
              isn&rsquo;t for everyone. This isn&rsquo;t fashion — it&rsquo;s armor for people
              who already know who they are.
            </p>
          </div>
          <div className="story__signature">
            <span className="story__sig-text">Dr. Dorsey</span>
            <span className="meta story__sig-meta">— Founder &amp; Creative Director</span>
          </div>
        </div>
      </section>

      {/* ═══════ 5. PRODUCT GRID (CURTAIN CARDS) ═══════ */}
      <section className="product-section">
        <div className="product-section__head">
          <h2 className="collection-strip__title">
            Featured <em>Pieces</em>
          </h2>
          <a href="/shop" className="eyebrow eyebrow--gold" style={{ paddingBottom: 6 }}>
            Shop All →
          </a>
        </div>
        <div className="product-grid">
          {featured.map((p, i) => (
            <CurtainCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* ═══════ 6. SECOND MARQUEE ═══════ */}
      <section className="marquee-section" aria-hidden="true">
        <div className="marquee-track" style={{ animationDirection: 'reverse' }}>
          {[0,1].map(loop => (
            <span key={loop}>
              {['From Atlanta', 'For the World', 'Editorial Empire', 'Stush', 'Dressed for the Room'].map(w => (
                <span className="marquee-item" key={loop + w}>{w}</span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════ 7. SOCIETY (EMAIL SIGNUP) ═══════ */}
      <section className="society" id="society">
        <div className="society__inner">
          <span className="eyebrow society__eyebrow">The Society</span>
          <h2 className="society__head">
            First dibs.<br />
            <em>Always.</em>
          </h2>
          <p className="society__sub">
            New drops, lookbook exclusives, and invitations to rooms
            most people don&rsquo;t know exist.
          </p>
          <form
            className="society__form"
            action={`${SHOP_URL}/contact#contact_form`}
            method="POST"
          >
            <input
              type="email"
              name="contact[email]"
              className="society__input"
              placeholder="Your email address"
              required
              autoComplete="email"
            />
            <button type="submit" className="society__submit">Join →</button>
          </form>
          <span className="society__legal">
            No spam. Unsubscribe anytime. We respect the culture.
          </span>
        </div>
      </section>
    </>
  );
}
