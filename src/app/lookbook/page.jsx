import { getProducts } from '@/lib/shopify';
import { sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lookbook — STUSH' };

export default async function LookbookPage() {
  const products = sortStushProducts(await getProducts({ limit: 250 }))
    .map(product => ({ product, image: getCommerceLeadImage(product) }))
    .filter(item => item.image)
    .slice(0, 15);

  const rows = [];
  const patterns = ['12', '3', '21', 'full', '3'];
  let idx = 0;
  for (const pattern of patterns) {
    const count = pattern === '12' || pattern === '21' ? 2 : pattern === '3' ? 3 : 1;
    const items = products.slice(idx, idx + count);
    if (!items.length) break;
    rows.push({ pattern, items });
    idx += count;
  }

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb"><a href="/">Stush</a> / Lookbook</span>
        <span className="page-head__season">FALL / WINTER 26</span>
        <h1 className="page-head__title">The <em>Lookbook</em></h1>
      </header>

      <section className="lb-feature lb-feature--film" data-stush-reveal>
        <div className="lb-film-frame"><video autoPlay muted loop playsInline preload="metadata" src="/STUSH_VID.mp4" /></div>
        <div className="lb-film-copy"><span className="eyebrow eyebrow--gold">Campaign film / Atlanta</span><h2 className="lb-feature__head">Pieces for the room.<br/><em>Not the rack.</em></h2><p>Fall 26 is built around silhouette, texture and how each piece reads when it is actually worn.</p><a href="/shop" className="btn-primary">Shop the wardrobe</a></div>
      </section>

      <div className="lookbook">
        {rows.map((row, ri) => (
          <div key={ri} className={`lb-row lb-row--${row.pattern}`}>
            {row.items.map(({ product, image }) => {
              const src = image?.src || image?.url;
              const aspect = row.pattern === 'full' ? 'lb-cell--wide' : row.pattern === '3' ? 'lb-cell--sq' : 'lb-cell--tall';
              return <a key={product.id} href={`/products/${product.handle}`} className={`lb-cell ${aspect}`} data-cursor="view">{src && <img src={src} alt={product.title} loading="lazy" />}<span className="lb-cell__caption">{product.title?.replace(/^Stush\s*[—-]\s*/i,'')}</span></a>;
            })}
          </div>
        ))}
      </div>

      <div className="lb-feature" style={{ paddingBottom: 'clamp(80px, 12vw, 160px)' }}><a href="/collections" className="btn-primary">Explore collections</a></div>
    </>
  );
}
