import { getCollections, getCollectionProducts } from '@/lib/shopify';
import { STUSH_CATEGORIES, groupStushProducts } from '@/lib/stush-categories';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Collections — STUSH' };

const ALLOWED_HANDLES = ['stush'];

export default async function CollectionsPage() {
  const collections = await getCollections();
  const stush = collections.find(collection => ALLOWED_HANDLES.includes(collection.handle));
  const products = stush ? await getCollectionProducts(stush.id, 120) : [];
  const grouped = groupStushProducts(products);
  const categories = STUSH_CATEGORIES
    .map(category => ({
      ...category,
      products: grouped[category.key] || [],
      image: grouped[category.key]?.[0]?.images?.[0]?.src || null,
    }))
    .filter(category => category.products.length);

  return (
    <>
      <header className="page-head page-head--collection">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / Collections
        </span>
        <h1 className="page-head__title">
          The <em>Empire</em>
        </h1>
        <p className="collection-intro">
          One fashion house, organized like one. Enter by category, then shop the complete STUSH edit.
        </p>
      </header>

      <section className="category-landing">
        <a className="category-landing__hero" href="/collections/stush#all">
          {products?.[0]?.images?.[0]?.src && (
            <img src={products[0].images[0].src} alt="The STUSH collection" />
          )}
          <span className="category-landing__veil" />
          <span className="category-landing__copy">
            <small>Complete collection</small>
            <strong>Shop <em>All</em></strong>
            <span>{products.length} pieces</span>
          </span>
        </a>

        <div className="category-landing__grid">
          {categories.map(category => (
            <a key={category.key} href={`/collections/stush#${category.key}`} className="category-tile">
              {category.image && <img src={category.image} alt={category.label} loading="lazy" />}
              <span className="category-landing__veil" />
              <span className="category-tile__copy">
                <small>{category.eyebrow}</small>
                <strong>{category.label}</strong>
                <span>{category.products.length} pieces</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
