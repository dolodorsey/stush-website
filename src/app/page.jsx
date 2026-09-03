import { getProducts, SHOP_URL } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { groupProductsByType } from '@/lib/productCategories';

// The storefront intentionally reads live Shopify inventory with cache: 'no-store'.
// Declare that contract at the route boundary so Next.js does not attempt static
// prerendering and then surface its internal dynamic-render sentinel as a Shopify error.
export const dynamic = 'force-dynamic';

const EDITORIAL_FRAMES = [
  { src: '/campaigns/stush-real-product.png', label: 'The Real Product Edit' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_brooklyn_stoop/045_stush___fafo_brooklyn_stoop.jpg', label: 'Elevated Essentials' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_paris_cafe/052_stush___paris_cafe.jpg', label: 'Paris Café' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_pinstripe_power/067_pinstripe_power___classic_stripes__bold_.jpg', label: 'Pinstripe Power' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_sport_luxe/064_stush___sport_luxe.jpg', label: 'Sport Luxe' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_real_streetwear/058_stush___sunset_rooftop_group.jpg', label: 'Real Streetwear' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_utility_luxe/068_stush___utility_luxe.jpg', label: 'Utility Luxe' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_new_drop/062_stush___new_drop_product_collage.jpg', label: 'The New Drop' },
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
        >
          <source src="/campaigns/stush-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero__scrim" />
        <div className="hero__content">
          <p className="hero__eyebrow">Atlanta / Worldwide</p>
          <h1 className="hero__title">STUSH</h1>
          <p className="hero__tagline">Quiet luxury. Loud presence.</p>
          <div className="hero__actions">
            <a className="btn btn--light" href="/shop">Shop the edit</a>
            <a className="btn btn--ghost" href="/lookbook">View lookbook</a>
          </div>
        </div>
        <a className="hero__scroll" href="#edit" aria-label="Scroll to collection">Scroll</a>
      </section>

      {/* ═══════ 2. EDITORIAL MARQUEE ═══════ */}
      <section className="marquee" aria-label="STUSH brand message">
        <div className="marquee__track">
          {[0, 1].map(copy => (
            <div className="marquee__line" key={copy} aria-hidden={copy === 1}>
              <span>STUSH</span><i>✦</i><em>Quiet Luxury</em><i>✦</i><span>Atlanta</span><i>✦</i><em>Worldwide</em><i>✦</i>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3. SHOP EDIT ═══════ */}
      <section className="edit" id="edit">
        <div className="section-head">
          <div>
            <span className="section-kicker">The current collection</span>
            <h2 className="section-title">Shop the <em>edit</em></h2>
          </div>
          <a href="/shop" className="text-link">View all {allProducts.length ? `(${allProducts.length})` : ''} →</a>
        </div>

        {allProducts.length ? (
          <div className="collection-grid collection-grid--home">
            {allProducts.slice(0, 8).map((product, index) => (
              <CurtainCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>The next STUSH edit is loading.</p>
            <a className="btn btn--dark" href={SHOP_URL}>Visit the shop</a>
          </div>
        )}
      </section>

      {/* ═══════ 4. CATEGORY MERCHANDISING ═══════ */}
      {productSections.slice(0, 3).map(section => (
        <section className="edit edit--category" key={section.key}>
          <div className="section-head">
            <div>
              <span className="section-kicker">{section.eyebrow}</span>
              <h2 className="section-title">{section.label}</h2>
            </div>
            <a href="/shop" className="text-link">Shop all →</a>
          </div>
          <div className="collection-grid collection-grid--home">
            {section.products.slice(0, 4).map(product => (
              <CurtainCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      {/* ═══════ 5. EDITORIAL CAMPAIGN ═══════ */}
      <section className="campaign-strip">
        {EDITORIAL_FRAMES.slice(0, 3).map((frame, index) => (
          <figure className={index === 1 ? 'campaign-strip__frame campaign-strip__frame--tall' : 'campaign-strip__frame'} key={frame.src}>
            <img src={frame.src} alt={`STUSH — ${frame.label}`} loading="lazy" />
            <figcaption>{frame.label}</figcaption>
          </figure>
        ))}
      </section>

      {/* ═══════ 6. BRAND STATEMENT ═══════ */}
      <section className="statement">
        <p className="statement__kicker">The STUSH code</p>
        <p className="statement__copy">
          For people who never needed to be <em>loud</em> to be noticed.
          Built in Atlanta. Worn everywhere.
        </p>
        <a className="text-link text-link--light" href="/lookbook">Enter the lookbook →</a>
      </section>

      {/* ═══════ 7. CAMPAIGN GRID ═══════ */}
      <section className="campaign-grid" aria-label="STUSH campaigns">
        {EDITORIAL_FRAMES.slice(3).map(frame => (
          <figure className="campaign-grid__item" key={frame.src}>
            <img src={frame.src} alt={`STUSH — ${frame.label}`} loading="lazy" />
            <figcaption>{frame.label}</figcaption>
          </figure>
        ))}
      </section>

      {/* ═══════ 8. SOCIETY ═══════ */}
      <section className="society" id="society">
        <span className="society__eyebrow">Private access</span>
        <h2>Join the <em>Society</em></h2>
        <p>First access to new drops, private edits, and STUSH experiences.</p>
        <a className="btn btn--light" href="/forms/society">Request access</a>
      </section>
    </>
  );
}
