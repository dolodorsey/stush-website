import { getCollectionByHandle, getCollectionProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import CollectionBrowser from '@/components/CollectionBrowser';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts, stushCategoryKey, stushCategoryKeys } from '@/lib/stush-categories';
import { getCommerceCardProduct } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const col = await getCollectionByHandle(params.handle);
  if (!col) return {};
  return { title: `${col.title} — STUSH` };
}

export default async function CollectionPage({ params }) {
  const col = await getCollectionByHandle(params.handle);
  if (!col) notFound();

  const products = sortStushProducts(await getCollectionProducts(col.id, 250));
  const grouped = groupStushProducts(products);
  const categories = STUSH_CATEGORIES.map(category => ({
    key: category.key,
    label: category.label,
    eyebrow: category.eyebrow,
    count: grouped[category.key]?.length || 0,
  }));
  const merchProducts = products.map(product => ({
    ...getCommerceCardProduct(product),
    stushCategory: stushCategoryKey(product),
    stushCategories: stushCategoryKeys(product),
  }));

  return (
    <>
      <header className="page-head page-head--collection page-head--collection-browser">
        <span className="page-head__crumb"><a href="/">Stush</a> / <a href="/collections">Collections</a> / {col.title}</span>
        <span className="page-head__season">FALL / WINTER 26</span>
        <h1 className="page-head__title">Shop <em>STUSH</em></h1>
        <p className="collection-intro">Browse one focused edit. Product-only merchandising, clean categories and no duplicate inventory walls.</p>
      </header>

      {products.length > 0 ? (
        <CollectionBrowser products={merchProducts} categories={categories} />
      ) : (
        <div className="collection-browser__empty collection-browser__empty--page">
          <span>THE CURRENT EDIT IS BEING CURATED.</span>
          <a href="/collections">Return to collections</a>
        </div>
      )}
    </>
  );
}
