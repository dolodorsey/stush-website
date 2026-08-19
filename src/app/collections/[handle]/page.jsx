import { getCollectionByHandle, getCollectionProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import CurtainCard from '@/components/CurtainCard';
import { STUSH_CATEGORIES, groupStushProducts } from '@/lib/stush-categories';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const col = await getCollectionByHandle(params.handle);
  if (!col) return {};
  return { title: `${col.title} — STUSH` };
}

export default async function CollectionPage({ params }) {
  const col = await getCollectionByHandle(params.handle);
  if (!col) notFound();

  const products = await getCollectionProducts(col.id, 120);
  const grouped = groupStushProducts(products);
  const activeCategories = STUSH_CATEGORIES.filter(category => grouped[category.key]?.length);

  const words = col.title.split(' ');
  const lastWord = words.pop();
  const firstWords = words.join(' ');

  return (
    <>
      <header className="page-head page-head--collection">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / <a href="/collections">Collections</a> / {col.title}
        </span>
        <h1 className="page-head__title">
          {firstWords} <em>{lastWord}</em>
        </h1>
        <p className="collection-intro">
          Shop the collection by garment type. Every category stays inside the STUSH universe — one label, cleaner merchandising.
        </p>
      </header>

      {products.length > 0 ? (
        <>
          <nav className="collection-category-nav" aria-label="Shop Stush by category">
            <a href="#all">All <span>{products.length}</span></a>
            {activeCategories.map(category => (
              <a key={category.key} href={`#${category.key}`}>
                {category.label} <span>{grouped[category.key].length}</span>
              </a>
            ))}
          </nav>

          <section id="all" className="merch-section merch-section--all">
            <div className="merch-section__head">
              <div>
                <span className="merch-section__eyebrow">The full edit</span>
                <h2>Shop <em>All</em></h2>
              </div>
              <span className="merch-section__count">{products.length} pieces</span>
            </div>
            <div className="collection-grid collection-grid--polished">
              {products.map((product, index) => (
                <CurtainCard key={product.id} product={product} priority={index < 8} />
              ))}
            </div>
          </section>

          {activeCategories.map(category => (
            <section id={category.key} className="merch-section" key={category.key}>
              <div className="merch-section__head">
                <div>
                  <span className="merch-section__eyebrow">{category.eyebrow}</span>
                  <h2>{category.label}</h2>
                </div>
                <span className="merch-section__count">{grouped[category.key].length} pieces</span>
              </div>
              <div className="collection-grid collection-grid--polished">
                {grouped[category.key].map(product => (
                  <CurtainCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        <div style={{ padding: 'clamp(80px, 12vw, 160px) var(--gutter)', textAlign: 'center' }}>
          <p className="meta">This collection is being curated. Check back soon.</p>
        </div>
      )}
    </>
  );
}
