import { getProducts } from '@/lib/shopify';
import CollectionBrowser from '@/components/CollectionBrowser';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts, stushCategoryKeys, stushCategoryKey } from '@/lib/stush-categories';
import { getCommerceCardProduct } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop — STUSH' };

export default async function ShopPage() {
  const products = sortStushProducts(await getProducts({ limit: 250 }));
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
      <header className="page-head page-head--collection page-head--shop">
        <span className="page-head__crumb"><a href="/">Stush</a> / Shop</span>
        <span className="page-head__season">FALL / WINTER 26</span>
        <h1 className="page-head__title">The <em>Wardrobe</em></h1>
        <p className="collection-intro">One clean merchandise floor. Similar pieces stay together. Women and Essentials have their own edits.</p>
      </header>
      <CollectionBrowser products={merchProducts} categories={categories} />
    </>
  );
}
