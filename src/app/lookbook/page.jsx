import { getProducts } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lookbook — STUSH' };

export default async function LookbookPage() {
  const products = await getProducts({ limit: 250 });
  // Pick products with the most images for the lookbook
  const withImages = products
    .filter(p => (p.images?.length || 0) >= 2)
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0))
    .slice(0, 18);

  // Build a varied grid layout: rows of 2, 3, 1, alternating patterns
  const rows = [];
  const patterns = ['12', '3', '21', '3', 'full', '3'];
  let idx = 0;
  for (const pattern of patterns) {
    const count = pattern === '12' || pattern === '21' ? 2 : pattern === '3' ? 3 : 1;
    const items = withImages.slice(idx, idx + count);
    if (items.length === 0) break;
    rows.push({ pattern, items });
    idx += count;
  }

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / Lookbook
        </span>
        <h1 className="page-head__title">
          SS &bull; 26 <em>Lookbook</em>
        </h1>
      </header>

      <div className="lb-feature">
        <h2 className="lb-feature__head">
          Pieces worn, not <em>displayed</em>.<br />
          Designed for rooms that <em>remember</em>.
        </h2>
      </div>

      <div className="lookbook">
        {rows.map((row, ri) => (
          <div key={ri} className={`lb-row lb-row--${row.pattern}`}>
            {row.items.map((product, pi) => {
              const img = product.images?.[pi % product.images.length] || product.images?.[0];
              const aspect = row.pattern === 'full' ? 'lb-cell--wide'
                : row.pattern === '3' ? 'lb-cell--sq' : 'lb-cell--tall';
              return (
                <a
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className={`lb-cell ${aspect}`}
                >
                  {img && <img src={img.src} alt={product.title} loading="lazy" />}
                  <span className="lb-cell__caption">{product.title}</span>
                </a>
              );
            })}
          </div>
        ))}
      </div>

      <div className="lb-feature" style={{ paddingBottom: 'clamp(80px, 12vw, 160px)' }}>
        <a href="/shop" className="btn-primary">Shop the Collection</a>
      </div>
    </>
  );
}
