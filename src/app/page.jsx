import Image from 'next/image';
import { getProducts, SHOP_URL } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts } from '@/lib/stush-categories';
import { getCommerceCardProduct, getCommerceLeadImage } from '@/lib/stush-merchandising';
import { STUSH_CATEGORY_CAMPAIGN, STUSH_HOUSE_WORLD } from '@/lib/stush-campaign-assets';

export const dynamic = 'force-dynamic';

function imageSrc(product) {
  const image = getCommerceLeadImage(product);
  return image?.src || image?.url || null;
}

function pieceCount(count) {
  return `${count} ${count === 1 ? 'PIECE' : 'PIECES'}`;
}

export default async function HomePage() {
  const allProducts = sortStushProducts(await getProducts({ limit: 250 }));
  const grouped = groupStushProducts(allProducts);
  const featured = allProducts.filter(product => imageSrc(product)).slice(0, 8).map(getCommerceCardProduct);
  const shopChapters = STUSH_CATEGORIES
    .map(category => ({ ...category, products: grouped[category.key] || [] }))
    .filter(category => category.products.length || ['essentials', 'women'].includes(category.key));
  const visualChapters = ['women', 'jerseys', 'tops', 'outerwear']
    .map(key => shopChapters.find(chapter => chapter.key === key))
    .filter(Boolean);

  return (
    <div className="flagship">
      <section className="flag-hero" data-qa="animation-hero" aria-label="STUSH campaign film">
        <video
          className="flag-hero__media"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/campaigns/stush-real-product.png"
          src="/STUSH_VID.mp4"
          aria-hidden="true"
        />
      </section>

      <section className="flag-intro" data-qa="post-hero-copy">
        <div className="flag-intro__headline">
          <span className="flag-kicker">FALL / WINTER 26 · ATLANTA</span>
          <h1><span>DRESSED FOR</span><em>THE ROOM.</em></h1>
        </div>
        <div className="flag-intro__aside">
          <p>STUSH is built around presence: strong silhouettes, limited edits and clothes that hold a room.</p>
          <div className="flag-intro__actions">
            <a href="/shop" className="flag-btn flag-btn--dark">SHOP THE FALL EDIT</a>
            <a href="/lookbook" className="flag-link">VIEW LOOKBOOK ↗</a>
          </div>
        </div>
      </section>

      <section className="flag-product-edit flag-product-edit--first">
        <div className="flag-section-head">
          <div><span className="flag-kicker">SHOP NOW</span><h2>THE CURRENT<br/>EDIT.</h2></div>
          <a href="/shop" className="flag-link">VIEW ALL PIECES ↗</a>
        </div>
        <div className="flag-product-grid">{featured.map((product, index) => <CurtainCard key={product.id} product={product} priority={index < 4} />)}</div>
      </section>

      <section className="flag-campaigns stush-campaign-art" data-qa="campaign-chapters">
        <header><span className="flag-kicker">THE WARDROBE / FALL 26</span><h2>THE CLOTHES<br/><em>COME ALIVE.</em></h2></header>
        <div className="flag-campaigns__grid">
          {visualChapters.map((chapter, index) => {
            const campaign = STUSH_CATEGORY_CAMPAIGN[chapter.key];
            return (
              <a href={`/collections/${chapter.key}`} className={`flag-campaign flag-campaign--${index + 1}`} key={chapter.key}>
                {campaign && <Image src={campaign.src} alt={campaign.alt} fill sizes="(max-width: 760px) 100vw, 50vw" priority={index === 0} />}
                <span className="campaign-veil" />
                <div><span>{chapter.eyebrow}</span><strong>{chapter.label}</strong><i>↗</i></div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="flag-index">
        <header><span className="flag-kicker">THE WARDROBE</span><h2>SHOP BY<br/>CATEGORY.</h2></header>
        <div className="flag-index__list">
          {shopChapters.map((section, index) => (
            <a key={section.key} href={`/collections/${section.key}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{section.label}</strong>
              <em>{section.products.length ? pieceCount(section.products.length) : 'FALL EDIT INCOMING'}</em>
              <i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <section className="home-house-world stush-campaign-art" data-qa="house-world">
        <a className="home-house-world__lead" href="/lookbook">
          <Image src={STUSH_HOUSE_WORLD.crystal.src} alt={STUSH_HOUSE_WORLD.crystal.alt} fill sizes="(max-width: 860px) 100vw, 68vw" />
          <span className="campaign-veil" />
          <div><span className="flag-kicker">STUSH / HOUSE WORLD 001</span><h2>THE WORLD<br/><em>AROUND THE CLOTHES.</em></h2><p>A visual language of black satin, chrome, stone and after-dark rooms.</p><strong>ENTER THE LOOKBOOK ↗</strong></div>
        </a>
        <a className="home-house-world__side" href="/journal">
          <Image src={STUSH_HOUSE_WORLD.chrome.src} alt={STUSH_HOUSE_WORLD.chrome.alt} fill sizes="(max-width: 860px) 100vw, 32vw" />
          <span className="campaign-veil" />
          <div><span>HOUSE OBJECTS / 01</span><strong>READ THE HOUSE NOTES ↗</strong></div>
        </a>
      </section>

      <section className="flag-thesis">
        <span className="flag-kicker">STUSH / HOUSE CODE 001</span>
        <div className="flag-thesis__grid">
          <h2>NOT MADE<br/>TO BLEND IN.</h2>
          <div><p>Atlanta confidence translated into a focused wardrobe: better proportion, stronger silhouettes and fewer pieces with more purpose.</p><a href="/journal" className="flag-link">READ THE HOUSE NOTES ↗</a></div>
        </div>
      </section>

      <section className="flag-atelier stush-campaign-art">
        <Image src={STUSH_HOUSE_WORLD.rainyBoutique.src} alt={STUSH_HOUSE_WORLD.rainyBoutique.alt} fill sizes="100vw" />
        <div className="flag-atelier__veil" />
        <div className="flag-atelier__copy"><span className="flag-kicker">THE HOUSE / AFTER DARK</span><h2>BUILT FOR<br/><em>THE NEXT ROOM.</em></h2><p>The wardrobe is only part of STUSH. The world around it should feel just as considered.</p><div><a href="/collections" className="flag-btn flag-btn--light">ENTER COLLECTIONS</a><a href="/lookbook" className="flag-link">VIEW THE EDIT ↗</a></div></div>
      </section>

      <section className="flag-society" id="society">
        <span className="flag-kicker">PRIVATE ACCESS</span><h2>KNOW BEFORE<br/><em>THE ROOM DOES.</em></h2><p>Fall drops, first access, campaign releases and private invitations.</p>
        <form action={`${SHOP_URL}/contact#contact_form`} method="POST">
          <input type="hidden" name="form_type" value="customer" />
          <input type="hidden" name="utf8" value="✓" />
          <input type="hidden" name="contact[tags]" value="newsletter,stush,society" />
          <input type="email" name="contact[email]" placeholder="EMAIL ADDRESS" required autoComplete="email" aria-label="Email address" />
          <button type="submit">JOIN ↗</button>
        </form>
      </section>
    </div>
  );
}
