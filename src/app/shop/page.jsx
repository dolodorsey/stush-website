import { getProducts } from '@/lib/shopify';
import ColorCycleCard from '@/components/ColorCycleCard';

export const dynamic = 'force-dynamic';
const S = 'https://stushusa.myshopify.com';

const CATEGORIES = [
  { key: 'Outerwear', label: 'Outerwear', id: 'outerwear' },
  { key: 'Blazers & Suits', label: 'Blazers & Suits', id: 'blazers' },
  { key: 'Tops', label: 'Tops', id: 'tops' },
  { key: 'Accessories', label: 'Accessories', id: 'accessories' },
  { key: 'Denim & Trousers', label: 'Denim & Trousers', id: 'denim' },
  { key: 'Sets', label: 'Sets', id: 'sets' },
];

const COLLECTION_HANDLES = {
  outerwear: 'outerwear',
  blazers: 'blazers-suits',
  tops: 'tops',
  accessories: 'accessories',
  denim: 'denim-trousers',
  sets: 'sets-1',
};

export default async function ShopPage() {
  const products = await getProducts();
  const byType = {};
  (products || []).forEach(p => {
    const t = p.product_type || 'Other';
    if (!byType[t]) byType[t] = [];
    byType[t].push(p);
  });

  return (
    <>
      <section className="shop-nav">
        <div className="shop-nav__inner">
          {CATEGORIES.map(cat => {
            const count = (byType[cat.key] || []).length;
            return count > 0 ? (
              <a key={cat.id} href={`#${cat.id}`} className="shop-nav__link">
                {cat.label} <span className="shop-nav__count">({count})</span>
              </a>
            ) : null;
          })}
          <a href={`${S}/collections/all-products`} className="shop-nav__link shop-nav__link--shopify">
            Shopify Store &rarr;
          </a>
        </div>
      </section>

      {CATEGORIES.map(cat => {
        const items = byType[cat.key] || [];
        if (items.length === 0) return null;
        const handle = COLLECTION_HANDLES[cat.id] || cat.id;
        return (
          <section key={cat.id} id={cat.id} className="shop">
            <div className="shop__header">
              <h2 className="shop__title">{cat.label} &mdash; {items.length}</h2>
              <a href={`${S}/collections/${handle}`} className="shop__link">
                View on Shopify &rarr;
              </a>
            </div>
            <div className="dgrid">
              {items.map(p => (
                <ColorCycleCard key={p.id} product={p} storeUrl={S} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
