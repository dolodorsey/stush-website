import { getProducts, SHOP_URL } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { groupProductsByType } from '@/lib/productCategories';

export const dynamic = 'force-dynamic';

const CAMPAIGNS = [
  { src: '/campaigns/stush-real-product.png', label: 'THE REAL PRODUCT EDIT', note: 'ATLANTA / 2026' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_paris_cafe/052_stush___paris_cafe.jpg', label: 'PARIS CAFÉ', note: 'ROOM STUDY / 02' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_pinstripe_power/067_pinstripe_power___classic_stripes__bold_.jpg', label: 'PINSTRIPE POWER', note: 'TAILORING / 03' },
  { src: 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/stush/stush_utility_luxe/068_stush___utility_luxe.jpg', label: 'UTILITY LUXE', note: 'UNIFORM / 04' },
];

export default async function HomePage() {
  const allProducts = await getProducts({ limit: 250 });
  const productSections = groupProductsByType(allProducts);
  const featured = [...allProducts]
    .filter(p => p.images?.length)
    .sort((a,b) => parseFloat(b.variants?.[0]?.price || 0) - parseFloat(a.variants?.[0]?.price || 0))
    .slice(0, 8);

  return (
    <div className="flagship">
      <section className="flag-hero">
        <video className="flag-hero__media" autoPlay muted loop playsInline preload="auto" src="/STUSH_VID.mp4" />
        <div className="flag-hero__veil" />
        <div className="flag-hero__side" aria-hidden="true">STUSH / ATLANTA / THE EDITORIAL HOUSE</div>
        <div className="flag-hero__content">
          <span className="flag-kicker">SPRING / SUMMER 26 · DRESSED FOR THE ROOM</span>
          <h1><span>DRESSED</span><span>FOR THE</span><em>ROOM.</em></h1>
          <div className="flag-hero__bottom">
            <p>Atlanta-born fashion for the moment the door opens and the room notices.</p>
            <div><a href="/shop" className="flag-btn flag-btn--light">ENTER THE HOUSE</a><a href="/lookbook" className="flag-link">VIEW THE FILM ↗</a></div>
          </div>
        </div>
      </section>

      <section className="flag-thesis">
        <span className="flag-kicker">STUSH / HOUSE CODE 001</span>
        <div className="flag-thesis__grid">
          <h2>NOT MADE<br/>TO BLEND IN.</h2>
          <div><p>STUSH is an editorial house built from Atlanta confidence: sharp tailoring, street intelligence, limited runs and clothes designed to hold a room.</p><a href="/journal" className="flag-link">READ THE HOUSE NOTES ↗</a></div>
        </div>
      </section>

      <section className="flag-campaigns">
        <header><span className="flag-kicker">CAMPAIGN ARCHIVE / 2026</span><h2>THE WORLD<br/><em>AROUND THE CLOTHES.</em></h2></header>
        <div className="flag-campaigns__grid">
          {CAMPAIGNS.map((frame, index) => (
            <a href="/lookbook" className={`flag-campaign flag-campaign--${index+1}`} key={frame.src}>
              <img src={frame.src} alt={`STUSH ${frame.label}`} loading={index ? 'lazy' : 'eager'} />
              <div><span>{frame.note}</span><strong>{frame.label}</strong><i>↗</i></div>
            </a>
          ))}
        </div>
      </section>

      <section className="flag-index">
        <header><span className="flag-kicker">THE WARDROBE</span><h2>SHOP BY<br/>CHAPTER.</h2></header>
        <div className="flag-index__list">
          {productSections.slice(0, 7).map((section, index) => (
            <a key={section.id} href={`/shop#${section.id}`}><span>0{index+1}</span><strong>{section.label}</strong><em>{section.products.length} PIECES</em><i>↗</i></a>
          ))}
        </div>
      </section>

      <section className="flag-product-edit">
        <div className="flag-section-head"><div><span className="flag-kicker">THE CURRENT EDIT</span><h2>EIGHT PIECES.<br/>NO FILLER.</h2></div><a href="/shop" className="flag-link">SHOP THE FULL HOUSE ↗</a></div>
        <div className="flag-product-grid">{featured.map((product,index)=><CurtainCard key={product.id} product={product} priority={index<4}/>)}</div>
      </section>

      <section className="flag-atelier">
        <img src="/brand/STUSH_ATELIER.png" alt="STUSH Atelier" loading="lazy" />
        <div className="flag-atelier__veil" />
        <div className="flag-atelier__copy"><span className="flag-kicker">THE ATELIER / LIMITED RUNS</span><h2>MADE IN<br/><em>THE ROOM.</em></h2><p>Cut, constructed and finished with a runway point of view. The pieces that define the house never need a loud backdrop.</p><div><a href="/lookbook" className="flag-btn flag-btn--light">ENTER THE ATELIER</a><a href="/shop" className="flag-link">SHOP PIECES ↗</a></div></div>
      </section>

      <section className="flag-society" id="society">
        <span className="flag-kicker">THE SOCIETY</span><h2>KNOW BEFORE<br/><em>THE ROOM DOES.</em></h2><p>Private drops, first access, campaign releases and invitations.</p>
        <form action={`${SHOP_URL}/contact#contact_form`} method="POST"><input type="email" name="contact[email]" placeholder="EMAIL ADDRESS" required autoComplete="email"/><button type="submit">JOIN ↗</button></form>
      </section>
    </div>
  );
}
