import { getProducts, SHOP_URL } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';

function imageSrc(product){
  const image = getCommerceLeadImage(product);
  return image?.src || image?.url || null;
}

export default async function HomePage() {
  const allProducts = sortStushProducts(await getProducts({ limit: 250 }));
  const grouped = groupStushProducts(allProducts);
  const featured = allProducts.filter(p => imageSrc(p)).slice(0, 8);
  const shopChapters = STUSH_CATEGORIES
    .map(category => ({ ...category, products: grouped[category.key] || [] }))
    .filter(category => category.products.length || ['essentials','women'].includes(category.key));
  const visualChapters = shopChapters.filter(category => category.products.length).slice(0, 4);

  return (
    <div className="flagship">
      <section className="flag-hero">
        <video className="flag-hero__media" autoPlay muted loop playsInline preload="metadata" src="/STUSH_VID.mp4" />
        <div className="flag-hero__veil" />
        <div className="flag-hero__content">
          <span className="flag-kicker">FALL / WINTER 26 · ATLANTA</span>
          <h1><span>DRESSED</span><span>FOR THE</span><em>ROOM.</em></h1>
          <div className="flag-hero__bottom">
            <p>STUSH is built around presence: strong silhouettes, limited edits and clothes that hold a room.</p>
            <div><a href="/shop" className="flag-btn flag-btn--light">SHOP THE FALL EDIT</a><a href="/lookbook" className="flag-link">VIEW LOOKBOOK ↗</a></div>
          </div>
        </div>
      </section>

      <section className="flag-product-edit flag-product-edit--first">
        <div className="flag-section-head"><div><span className="flag-kicker">SHOP NOW</span><h2>THE CURRENT<br/>EDIT.</h2></div><a href="/shop" className="flag-link">VIEW ALL PIECES ↗</a></div>
        <div className="flag-product-grid">{featured.map((product,index)=><CurtainCard key={product.id} product={product} priority={index<4}/>)}</div>
      </section>

      <section className="flag-index">
        <header><span className="flag-kicker">THE WARDROBE</span><h2>SHOP BY<br/>CATEGORY.</h2></header>
        <div className="flag-index__list">
          {shopChapters.map((section, index) => (
            <a key={section.key} href={`/collections/stush#${section.key}`}><span>{String(index+1).padStart(2,'0')}</span><strong>{section.label}</strong><em>{section.products.length ? `${section.products.length} PIECES` : 'FALL EDIT INCOMING'}</em><i>↗</i></a>
          ))}
        </div>
      </section>

      <section className="flag-campaigns">
        <header><span className="flag-kicker">FALL 26 / WARDROBE STUDIES</span><h2>THE CLOTHES<br/><em>COME FIRST.</em></h2></header>
        <div className="flag-campaigns__grid">
          {visualChapters.map((chapter, index) => {
            const product = chapter.products[0];
            const src = imageSrc(product);
            return <a href={`/collections/stush#${chapter.key}`} className={`flag-campaign flag-campaign--${index+1}`} key={chapter.key}>{src && <img src={src} alt={chapter.label} loading={index ? 'lazy' : 'eager'} />}<div><span>{chapter.eyebrow}</span><strong>{chapter.label}</strong><i>↗</i></div></a>;
          })}
        </div>
      </section>

      <section className="flag-thesis">
        <span className="flag-kicker">STUSH / HOUSE CODE 001</span>
        <div className="flag-thesis__grid"><h2>NOT MADE<br/>TO BLEND IN.</h2><div><p>Atlanta confidence translated into a focused wardrobe: better proportion, stronger silhouettes and fewer pieces with more purpose.</p><a href="/journal" className="flag-link">READ THE HOUSE NOTES ↗</a></div></div>
      </section>

      <section className="flag-atelier">
        <img src="/brand/STUSH_ATELIER.png" alt="STUSH Atelier" loading="lazy" />
        <div className="flag-atelier__veil" />
        <div className="flag-atelier__copy"><span className="flag-kicker">THE ATELIER / LIMITED RUNS</span><h2>BUILT FOR<br/><em>THE NEXT ROOM.</em></h2><p>The fall wardrobe is being tightened around statement layers, essentials and complete looks.</p><div><a href="/collections" className="flag-btn flag-btn--light">ENTER COLLECTIONS</a><a href="/lookbook" className="flag-link">VIEW THE EDIT ↗</a></div></div>
      </section>

      <section className="flag-society" id="society">
        <span className="flag-kicker">PRIVATE ACCESS</span><h2>KNOW BEFORE<br/><em>THE ROOM DOES.</em></h2><p>Fall drops, first access, campaign releases and private invitations.</p>
        <form action={`${SHOP_URL}/contact#contact_form`} method="POST"><input type="email" name="contact[email]" placeholder="EMAIL ADDRESS" required autoComplete="email"/><button type="submit">JOIN ↗</button></form>
      </section>
    </div>
  );
}
