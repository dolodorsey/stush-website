import { getProducts, SHOP_URL } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { groupProductsByType } from '@/lib/productCategories';

const EDITORIAL_FRAMES = [
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_brooklyn_stoop/045_stush___fafo_brooklyn_stoop.jpg', label: 'Elevated Essentials' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_paris_cafe/052_stush___paris_cafe.jpg', label: 'Paris Café' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_pinstripe_power/067_pinstripe_power___classic_stripes__bold_.jpg', label: 'Pinstripe Power' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_sport_luxe/064_stush___sport_luxe.jpg', label: 'Sport Luxe' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_real_streetwear/058_stush___sunset_rooftop_group.jpg', label: 'Real Streetwear' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_utility_luxe/068_stush___utility_luxe.jpg', label: 'Utility Luxe' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_new_drop/062_stush___new_drop_product_collage.jpg', label: 'The New Drop' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_polo_collection/054_stush___grey_polo_luxury.jpg', label: 'The Polo Collection' },
];

export default async function HomePage() {
  const allProducts = await getProducts({ limit: 250 });

  // Hero product — highest-priced with an image
  const sorted = [...allProducts]
    .filter(p => p.images?.length)
    .sort((a, b) => parseFloat(b.variants?.[0]?.price || 0) - parseFloat(a.variants?.[0]?.price || 0));
  const hero = sorted[0];
  const heroImg = hero?.images?.[0]?.src;

  const productSections = groupProductsByType(allProducts);

  return (
    <>
      {/* ═══════ 1. HERO ═══════ */}
      <section className="hero">
        {/* Video background — swap src to your STUSH brand video when ready */}
        <video
          className="hero__bg fadeIn"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroImg || ''}
          src="/STUSH_VID.mp4"
        />
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

      {/* ═══════ 3. SHOP BY TYPE ═══════ */}
      <section className="category-index">
        <div className="collection-strip__head">
          <h2 className="collection-strip__title">
            Shop by <em>Type</em>
          </h2>
          <a href="/shop" className="eyebrow eyebrow--gold" style={{ paddingBottom: 6 }}>
            Shop All →
          </a>
        </div>
        <div className="category-index__links">
          {productSections.map(section => (
            <a key={section.id} href={`/shop#${section.id}`} className="category-index__link">
              <span>{section.label}</span>
              <small>{section.products.length}</small>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ SUPABASE EDITORIAL CAMPAIGNS ═══════ */}
      <section className="editorial-archive" aria-label="STUSH visual archive">
        <header className="editorial-archive__intro">
          <span className="eyebrow eyebrow--pink">The campaign</span>
          <h2 className="editorial-archive__title">The STUSH<br /><em>edit.</em></h2>
        </header>
        <div className="editorial-archive__grid">
        {EDITORIAL_FRAMES.map((frame, index) => (
          <figure className="editorial-frame" key={frame.src}>
            <img
              src={frame.src}
              alt={`STUSH ${frame.label} campaign`}
              className="editorial-frame__image"
              loading="lazy"
            />
            <figcaption className="editorial-frame__caption">
              <span>{frame.label}</span><span>{String(index + 1).padStart(2, '0')}</span>
            </figcaption>
          </figure>
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
      {/* ═══════ ATELIER (gold boutique) ═══════ */}
      <section style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(60px,10vw,120px) var(--gutter)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%), url(/brand/STUSH_ATELIER.png) center/cover no-repeat',
        color: 'var(--cream)',
      }}>
        <div style={{maxWidth: 780, margin: '0 auto', textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'var(--gold)', letterSpacing: '0.24em'}}>THE ATELIER</span>
          <h2 className="story__head" style={{marginTop: 20, marginBottom: 24, fontSize: 'clamp(36px, 5vw, 68px)'}}>
            Made in the <em>Room</em>.
          </h2>
          <p className="story__body" style={{maxWidth: 620, margin: '0 auto', fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.75}}>
            Every piece cut, sewn, and finished by hand. Runway-grade construction.
            Limited runs. The Empire opens its doors to the ones who belong inside.
          </p>
          <div style={{marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/lookbook" className="btn btn--cream">See the Lookbook →</a>
            <a href="/shop" className="btn btn--gold-outline">Shop the Empire</a>
          </div>
        </div>
      </section>

      {productSections.slice(0, 5).map((section, sectionIndex) => (
        <section className="product-section" key={section.id}>
          <div className="product-section__head">
            <h2 className="collection-strip__title">{section.label}</h2>
            <a href={`/shop#${section.id}`} className="eyebrow eyebrow--gold" style={{ paddingBottom: 6 }}>
              View {section.products.length} →
            </a>
          </div>
          <div className="product-grid">
            {section.products.slice(0, 6).map((product, index) => (
              <CurtainCard key={product.id} product={product} priority={sectionIndex === 0 && index < 6} />
            ))}
          </div>
        </section>
      ))}

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
