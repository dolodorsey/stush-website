import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import CollectionBrowser from '@/components/CollectionBrowser';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts, stushCategoryKeys, stushCategoryKey } from '@/lib/stush-categories';
import { getCommerceCardProduct } from '@/lib/stush-merchandising';
import { STUSH_CAMPAIGN } from '@/lib/stush-campaign-assets';

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
      <section className="shop-campaign-banner stush-campaign-art" data-qa="shop-campaign">
        <Image src={STUSH_CAMPAIGN.wardrobeRack.src} alt={STUSH_CAMPAIGN.wardrobeRack.alt} fill sizes="100vw" priority />
        <span className="shop-campaign-banner__veil" />
        <div className="shop-campaign-banner__copy"><span>THE WARDROBE / FALL 26</span><strong>PIECES FOR THE ROOM.<br/>NOT THE RACK.</strong><a href="/lookbook">VIEW THE CAMPAIGN ↗</a></div>
      </section>
      <CollectionBrowser products={merchProducts} categories={categories} />
    </>
  );
}
