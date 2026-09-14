import { getCollections, getCollectionProducts } from '@/lib/shopify';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';
import { STUSH_CATEGORY_CAMPAIGN, STUSH_HOUSE_WORLD } from '@/lib/stush-campaign-assets';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Collections — STUSH' };

const ALLOWED_HANDLES = ['stush'];

function leadSrc(product) {
  const image = getCommerceLeadImage(product);
  return image?.src || image?.url || null;
}

export default async function CollectionsPage() {
  const collections = await getCollections();
  const stush = collections.find(collection => ALLOWED_HANDLES.includes(collection.handle));
  const products = sortStushProducts(stush ? await getCollectionProducts(stush.id, 250) : []);
  const grouped = groupStushProducts(products);
  const categories = STUSH_CATEGORIES.map(category => ({
    ...category,
    products: grouped[category.key] || [],
    campaign: STUSH_CATEGORY_CAMPAIGN[category.key],
    fallbackImage: leadSrc(grouped[category.key]?.[0]),
  }));

  return (
    <>
      <header className="page-head page-head--collection page-head--collections-index">
        <span className="page-head__crumb"><a href="/">Stush</a> / Collections</span>
        <span className="page-head__season">FALL / WINTER 26</span>
        <h1 className="page-head__title">Shop by <em>Wardrobe</em></h1>
        <p className="collection-intro">Eight distinct rooms inside one house: foundation, women, outerwear, fleece, sport, first layers, bottoms and finishing pieces.</p>
      </header>

      <section className="category-landing category-landing--v2 stush-campaign-art">
        <a className="category-landing__hero category-landing__hero--campaign" href="/shop" data-cursor="view">
          <img src={STUSH_HOUSE_WORLD.crystal.src} alt={STUSH_HOUSE_WORLD.crystal.alt} />
          <span className="category-landing__veil" />
          <span className="category-landing__copy">
            <small>THE HOUSE / FALL 26</small>
            <strong>The <em>Current Edit</em></strong>
            <span>{products.length} active pieces · enter the wardrobe</span>
          </span>
        </a>

        <div className="category-landing__grid category-landing__grid--v2">
          {categories.map(category => {
            const src = category.campaign?.src || category.fallbackImage;
            const alt = category.campaign?.alt || category.label;
            return (
              <a key={category.key} href={`/collections/${category.key}`} className={`category-tile ${category.products.length ? '' : 'category-tile--empty'}`} data-cursor="view">
                {src && <img src={src} alt={alt} loading="lazy" />}
                <span className="category-landing__veil" />
                <span className="category-tile__copy">
                  <small>{category.eyebrow}</small>
                  <strong>{category.label}</strong>
                  <span>{category.products.length ? `${category.products.length} pieces` : 'Fall edit incoming'}</span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
