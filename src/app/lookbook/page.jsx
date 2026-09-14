import { getProducts } from '@/lib/shopify';
import { sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lookbook — STUSH', description: 'STUSH Fall/Winter 2026 campaign film and wardrobe study.' };

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
      <section className="lb-cinema" data-qa="lookbook-cinema">
        <div className="lb-cinema__film"><video autoPlay muted loop playsInline preload="metadata" poster="/campaigns/stush-real-product.png" src="/STUSH_VID.mp4" /></div>
        <aside className="lb-cinema__rail">
          <small>STUSH / FALL 26 / LOOK 001</small>
          <h1>THE<br/><em>LOOKBOOK.</em></h1>
          <div><p>A moving study of silhouette, weight and the way STUSH reads when the clothes leave the rack.</p><a href="/shop" className="flag-link">SHOP THE WARDROBE ↗</a></div>
        </aside>
      </section>

      <section className="lb-manifesto">
        <span>CAMPAIGN NOTE / 01</span>
        <p>Clothes are not finished until they meet a <em>room.</em> Fall 26 is built to hold one.</p>
      </section>

      <section className="lb-sequence" data-qa="lookbook-sequence">
        <div className="lookbook">
          {rows.map((row, ri) => (
            <div key={ri} className={`lb-row lb-row--${row.pattern}`}>
              {row.items.map(({ product, image }, pi) => {
                const src = image?.src || image?.url;
                const aspect = row.pattern === 'full' ? 'lb-cell--wide' : row.pattern === '3' ? 'lb-cell--sq' : 'lb-cell--tall';
                return (
                  <a key={product.id} href={`/products/${product.handle}`} className={`lb-cell ${aspect}`} data-cursor="view">
                    {src && <img src={src} alt={image?.alt || image?.altText || product.title} loading={ri < 1 ? 'eager' : 'lazy'} />}
                    <span className="lb-cell__caption">LOOK {String(ri + 1).padStart(2,'0')}.{pi + 1} / {product.title?.replace(/^Stush\s*[—-]\s*/i,'')}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
        <div className="lb-sequence__footer"><span className="flag-kicker">END OF STUDY / FALL 26</span><a href="/collections" className="flag-btn flag-btn--light">ENTER THE WARDROBE</a></div>
      </section>
    </>
  );
}
