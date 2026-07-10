import { getProducts, getCollections, getCollectionProducts } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop All — STUSH' };

const SECTIONS = [
  { handle: 'stush', label: 'The Full Empire' },
];

export default async function ShopPage() {
  const collections = await getCollections();

  const sections = await Promise.all(
    SECTIONS.map(async (sec) => {
      const col = collections.find(c => c.handle === sec.handle);
      if (!col) return { ...sec, products: [] };
      const products = await getCollectionProducts(col.id, 12);
      return { ...sec, products };
    })
  );

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / Shop
        </span>
        <h1 className="page-head__title">
          Shop <em>All</em>
        </h1>
      </header>

      {/* Quick-jump nav */}
      <nav style={{
        display: 'flex', gap: 24, flexWrap: 'wrap',
        padding: '20px var(--gutter)',
        borderBottom: '1px solid var(--bass-line)',
      }}>
        {SECTIONS.map(sec => (
          <a
            key={sec.handle}
            href={`#${sec.handle}`}
            className="eyebrow"
            style={{ transition: 'color var(--t-quick)' }}
          >
            {sec.label}
          </a>
        ))}
      </nav>

      {sections.map(sec => (
        sec.products.length > 0 && (
          <section key={sec.handle} id={sec.handle} className="product-section">
            <div className="product-section__head">
              <h2 className="collection-strip__title" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
                {sec.label.split(' ').slice(0, -1).join(' ')}{' '}
                <em>{sec.label.split(' ').pop()}</em>
              </h2>
              <a href={`/collections/${sec.handle}`} className="eyebrow eyebrow--gold" style={{ paddingBottom: 6 }}>
                View All →
              </a>
            </div>
            <div className="product-grid">
              {sec.products.map((p, i) => (
                <CurtainCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          </section>
        )
      ))}
    </>
  );
}
