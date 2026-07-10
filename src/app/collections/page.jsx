import { getCollections, getCollectionProducts } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Collections — STUSH' };

const DISPLAY_MAP = {
  'stush': { display: 'The',       accent: 'Empire' },
};

// Only show collections that belong to STUSH
const ALLOWED_HANDLES = ['stush'];

export default async function CollectionsPage() {
  const collections = await getCollections();

  const data = await Promise.all(
    collections
      .filter(c => ALLOWED_HANDLES.includes(c.handle))
      .map(async (col) => {
        const products = await getCollectionProducts(col.id, 12);
        const img = products?.[0]?.images?.[0]?.src || col.image?.src || null;
        const dm = DISPLAY_MAP[col.handle] || { display: col.title, accent: '' };
        return { ...col, img, productCount: products.length, ...dm };
      })
  );

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / Collections
        </span>
        <h1 className="page-head__title">
          The <em>Empire</em>
        </h1>
      </header>

      <div className="collection-strip__grid" style={{ padding: 0 }}>
        {data.map(col => (
          <a
            key={col.id}
            href={`/collections/${col.handle}`}
            className="collection-card"
          >
            {col.img && (
              <img
                src={col.img}
                alt={col.title}
                className="collection-card__img"
                loading="lazy"
              />
            )}
            <div className="collection-card__veil" />
            <div className="collection-card__copy">
              <div className="collection-card__name">
                {col.display} <em>{col.accent}</em>
              </div>
              <div className="collection-card__count">{col.productCount}+ pieces</div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
