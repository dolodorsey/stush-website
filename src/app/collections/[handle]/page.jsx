import { getCollectionByHandle, getCollectionProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import CollectionBrowser from '@/components/CollectionBrowser';
import { STUSH_CATEGORIES, groupStushProducts, stushCategoryKey } from '@/lib/stush-categories';

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
  const categories = STUSH_CATEGORIES
    .filter(category => grouped[category.key]?.length)
    .map(category => ({
      key: category.key,
      label: category.label,
      eyebrow: category.eyebrow,
      count: grouped[category.key].length,
    }));
  const merchProducts = products.map(product => ({
    ...product,
    stushCategory: stushCategoryKey(product),
  }));

  const words = col.title.split(' ');
  const lastWord = words.pop();
  const firstWords = words.join(' ');

  return (
    <>
      <header className="page-head page-head--collection page-head--collection-browser">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / <a href="/collections">Collections</a> / {col.title}
        </span>
        <h1 className="page-head__title">
          {firstWords} <em>{lastWord}</em>
        </h1>
        <p className="collection-intro">
          Shop one clean edit. Filter by garment type without leaving the collection.
        </p>
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
