import { getCollections, getCollectionProducts } from '@/lib/shopify';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';

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
    image: leadSrc(grouped[category.key]?.[0]),
  }));
  const heroImage = leadSrc(products?.[0]);

  return (
    <>
      <header className="page-head page-head--collection page-head--collections-index">
        <span className="page-head__crumb"><a href="/">Stush</a> / Collections</span>
        <span className="page-head__season">FALL / WINTER 26</span>
        <h1 className="page-head__title">Shop by <em>Wardrobe</em></h1>
        <p className="collection-intro">A clear collection architecture: essentials, women, outerwear, sweats, jerseys, tees, bottoms and finishing pieces.</p>
      </header>

      <section className="category-landing category-landing--v2">
        <a className="category-landing__hero" href="/collections/stush#all" data-cursor="view">
          {heroImage && <img src={heroImage} alt="The STUSH collection" />}
          <span className="category-landing__veil" />
          <span className="category-landing__copy">
            <small>Complete fall collection</small>
            <strong>The <em>Current Edit</em></strong>
            <span>{products.length} active pieces</span>
          </span>
        </a>

        <div className="category-landing__grid category-landing__grid--v2">
          {categories.map(category => (
            <a key={category.key} href={`/collections/stush#${category.key}`} className={`category-tile ${category.products.length ? '' : 'category-tile--empty'}`} data-cursor="view">
              {category.image && <img src={category.image} alt={category.label} loading="lazy" />}
              <span className="category-landing__veil" />
              <span className="category-tile__copy">
                <small>{category.eyebrow}</small>
                <strong>{category.label}</strong>
                <span>{category.products.length ? `${category.products.length} pieces` : 'Fall edit incoming'}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
