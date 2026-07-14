import { getProducts } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { groupProductsByType } from '@/lib/productCategories';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop All — STUSH' };

export default async function ShopPage() {
  const products = await getProducts({ limit: 250 });
  const sections = groupProductsByType(products);

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

      {/* Sticky category jump nav */}
      <nav style={{
        display: 'flex', gap: 24, flexWrap: 'wrap',
        padding: '20px var(--gutter)',
        borderBottom: '1px solid var(--bass-line)',
      }}>
        {sections.map(sec => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className="eyebrow"
            style={{ transition: 'color var(--t-quick)' }}
          >
            {sec.label} <span style={{ color: 'var(--muted)' }}>({sec.products.length})</span>
          </a>
        ))}
      </nav>

      {sections.map(sec => (
        <section key={sec.id} id={sec.id} className="product-section">
          <div className="product-section__head">
            <h2 className="collection-strip__title">
              {sec.label}
            </h2>
            <span className="eyebrow eyebrow--gold" style={{ paddingBottom: 6 }}>
              {sec.products.length} pieces
            </span>
          </div>
          <div className="product-grid">
            {sec.products.map((p, i) => (
              <CurtainCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
