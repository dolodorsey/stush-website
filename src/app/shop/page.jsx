import { getProducts } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop All — STUSH' };

// Master category list — order shown on shop page + jump nav
const CATEGORIES = [
  { type: 'T-Shirt',    label: 'Tees',         id: 'tees' },
  { type: 'Cap',        label: 'Caps',         id: 'caps' },
  { type: 'Bottoms',    label: 'Bottoms',      id: 'bottoms' },
  { type: 'Polo Shirt', label: 'Polos',        id: 'polos' },
  { type: 'Jacket',     label: 'Jackets',      id: 'jackets' },
  { type: 'Hoodie',     label: 'Hoodies',      id: 'hoodies' },
  { type: 'Sweatshirt', label: 'Sweatshirts',  id: 'sweatshirts' },
  { type: 'Sweatpants', label: 'Sweatpants',   id: 'sweatpants' },
  { type: 'Pants',      label: 'Pants',        id: 'pants' },
  { type: 'Shorts',     label: 'Shorts',       id: 'shorts' },
  { type: 'Jersey',     label: 'Jerseys',      id: 'jerseys' },
  { type: 'Tank Top',   label: 'Tanks',        id: 'tanks' },
  { type: 'Crop Top',   label: 'Crop Tops',    id: 'crops' },
  { type: 'Sports Bra', label: 'Sports Bras',  id: 'bras' },
  { type: 'Leggings',   label: 'Leggings',     id: 'leggings' },
];

export default async function ShopPage() {
  const products = await getProducts({ limit: 250 });
  const byType = {};
  products.forEach(p => {
    const t = p.product_type || 'Other';
    if (!byType[t]) byType[t] = [];
    byType[t].push(p);
  });

  const categorizedTypes = new Set(CATEGORIES.map(cat => cat.type));
  const sections = CATEGORIES.map(cat => ({
    ...cat,
    products: byType[cat.type] || [],
  })).filter(s => s.products.length > 0).concat(
    Object.entries(byType)
      .filter(([type]) => !categorizedTypes.has(type))
      .map(([type, typeProducts]) => ({
        type,
        label: type,
        id: `other-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        products: typeProducts,
      })),
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
            <h2 className="collection-strip__title" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
              The <em>{sec.label}</em>
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
