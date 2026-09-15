import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import CurtainCard from '@/components/CurtainCard';
import { groupStushProducts, sortStushProducts, STUSH_CATEGORIES } from '@/lib/stush-categories';
import { getCommerceCardProduct, getCommerceLeadImage } from '@/lib/stush-merchandising';
import { STUSH_CATEGORY_CAMPAIGN, STUSH_HOUSE_WORLD } from '@/lib/stush-campaign-assets';

const EDITS = {
  essentials: {
    kicker: 'FOUNDATION / FALL 26', titleA: 'THE DAILY', titleB: 'CODE.',
    intro: 'The pieces that make the rest of the wardrobe work: weight, proportion and repeat wear without disappearing into basics.',
    code: ['WEIGHT', 'LAYER', 'REPEAT'], layout: 'foundation', campaignLine: 'THE PIECES THAT MAKE THE REST OF THE ROOM WORK.',
  },
  women: {
    kicker: 'WOMEN / FALL 26', titleA: 'CUT FOR', titleB: 'PRESENCE.',
    intro: 'Cropped proportion, strong lines and pieces built to change the room before the conversation starts.',
    code: ['PROPORTION', 'MOVEMENT', 'CONTRAST'], layout: 'portrait', campaignLine: 'PRESENCE BEFORE INTRODUCTION.',
  },
  outerwear: {
    kicker: 'OUTERWEAR / FALL 26', titleA: 'THE OUTER', titleB: 'LINE.',
    intro: 'Structure first. Jackets and layers judged by silhouette, hardware, weight and what they do to everything underneath.',
    code: ['STRUCTURE', 'HARDWARE', 'WEATHER'], layout: 'monolith', campaignLine: 'THE FIRST THING THE ROOM SEES.',
  },
  hoodies: {
    kicker: 'FLEECE STUDY / FALL 26', titleA: 'WEIGHT IN', titleB: 'MOTION.',
    intro: 'Wash, hand feel and volume turn familiar fleece into the part of the look that carries the most attitude.',
    code: ['WASH', 'WEIGHT', 'LAYER'], layout: 'washed', campaignLine: 'FAMILIAR SHAPE. HEAVIER PRESENCE.',
  },
  jerseys: {
    kicker: 'SPORT CODE / FALL 26', titleA: 'UNIFORM', titleB: 'REWRITTEN.',
    intro: 'Sport language without costume: collar, number, contrast and the confidence of a uniform moved into nightlife.',
    code: ['NUMBER', 'COLLAR', 'SIGNAL'], layout: 'scoreboard', campaignLine: 'SPORT LANGUAGE MOVED INTO THE CITY.',
  },
  tops: {
    kicker: 'CORE LAYERS / FALL 26', titleA: 'THE FIRST', titleB: 'LAYER.',
    intro: 'The graphic, crop and boxy shapes that set the proportion before the rest of the fit gets involved.',
    code: ['GRAPHIC', 'PROPORTION', 'GROUND'], layout: 'paper', campaignLine: 'GRAPHICS THAT DO MORE THAN FILL A CHEST.',
  },
  bottoms: {
    kicker: 'BOTTOMS / FALL 26', titleA: 'LINE FROM', titleB: 'THE WAIST.',
    intro: 'Width, drape and movement. The lower half is treated as architecture instead of an afterthought.',
    code: ['DRAPE', 'WIDTH', 'MOVEMENT'], layout: 'runway', campaignLine: 'PROPORTION STARTS AT THE FLOOR.',
  },
  accessories: {
    kicker: 'FINISHING PIECES / FALL 26', titleA: 'THE LAST', titleB: 'DETAIL.',
    intro: 'Small objects with enough identity to finish the whole silhouette. Scale matters more when the object is smaller.',
    code: ['DETAIL', 'SCALE', 'FINISH'], layout: 'macro', campaignLine: 'THE SMALLEST OBJECT CAN HOLD THE WHOLE LOOK.',
  },
};

const HOUSE_BACKDROPS = {
  essentials: STUSH_HOUSE_WORLD.chrome,
  women: STUSH_HOUSE_WORLD.dressingRoom,
  outerwear: STUSH_HOUSE_WORLD.rainyBoutique,
  hoodies: STUSH_HOUSE_WORLD.crystal,
  jerseys: STUSH_HOUSE_WORLD.rainyBoutique,
  tops: STUSH_HOUSE_WORLD.chrome,
  bottoms: STUSH_HOUSE_WORLD.roses,
  accessories: STUSH_HOUSE_WORLD.dressingRoom,
};

function media(product) {
  const image = getCommerceLeadImage(product);
  const src = image?.src || image?.url || null;
  return src ? { src, alt: image?.alt || image?.altText || product?.title || 'STUSH product' } : null;
}

function cleanTitle(title = '') { return title.replace(/^Stush\s*[—-]\s*/i, ''); }

export function isEditorialCategory(key) { return Boolean(EDITS[key]); }

export function categoryMetadata(key) {
  const config = EDITS[key];
  const category = STUSH_CATEGORIES.find(item => item.key === key);
  if (!config || !category) return null;
  return { title: `${category.label} — STUSH`, description: `${category.label}, Fall/Winter 2026. ${config.intro}` };
}

export default async function CategoryEditorialPage({ categoryKey }) {
  const config = EDITS[categoryKey];
  const category = STUSH_CATEGORIES.find(item => item.key === categoryKey);
  if (!config || !category) return null;

  const allProducts = sortStushProducts(await getProducts({ limit: 250 }));
  const grouped = groupStushProducts(allProducts);
  const rawProducts = grouped[categoryKey] || [];
  const products = rawProducts.map(getCommerceCardProduct).filter(product => product.coverImage);
  const heroProducts = rawProducts.map(product => ({ product, media: media(product) })).filter(item => item.media).slice(0, 3);
  const adjacent = STUSH_CATEGORIES.filter(item => item.key !== categoryKey && (grouped[item.key] || []).length > 0).slice(0, 3);
  const campaign = STUSH_CATEGORY_CAMPAIGN[categoryKey];
  const houseBackdrop = HOUSE_BACKDROPS[categoryKey] || STUSH_HOUSE_WORLD.chrome;

  return (
    <div
      className={`edit-page edit-page--${categoryKey} edit-page--layout-${config.layout}`}
      data-qa="category-edit"
      data-category={categoryKey}
      style={{ '--stush-house-bg': `url(${houseBackdrop.src})` }}
    >
      <section className="edit-hero stush-house-backdrop stush-house-backdrop--edit-hero">
        <div className="edit-hero__copy">
          <a className="edit-crumb" href="/collections">STUSH / WARDROBE / {category.label.toUpperCase()}</a>
          <span className="edit-kicker">{config.kicker}</span>
          <h1><span>{config.titleA}</span><em>{config.titleB}</em></h1>
          <p>{config.intro}</p>
          <div className="edit-hero__actions">
            <a className="edit-btn" href="#pieces">SHOP {category.label.toUpperCase()}</a>
            <a className="edit-text-link" href="/lookbook">VIEW FALL LOOKBOOK ↗</a>
          </div>
        </div>

        <div className="edit-stage" aria-label={`${category.label} product study`}>
          {heroProducts.length > 0 ? heroProducts.map(({ product, media: image }, index) => (
            <a className={`edit-stage__piece edit-stage__piece--${index + 1}`} href={`/products/${product.handle}`} key={product.id}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 82vw, 45vw" priority={index === 0} />
              <span>{String(index + 1).padStart(2, '0')} / {cleanTitle(product.title)}</span>
            </a>
          )) : (
            <div className="edit-stage__empty"><span>THE {category.label.toUpperCase()} EDIT IS BEING CURATED.</span></div>
          )}
          <span className="edit-stage__mark" aria-hidden="true">{category.label}</span>
        </div>
      </section>

      <section className="edit-code" aria-label={`${category.label} design code`}>
        {config.code.map((item, index) => <div key={item}><small>0{index + 1}</small><strong>{item}</strong></div>)}
        <div className="edit-code__count"><small>LIVE EDIT</small><strong>{products.length} {products.length === 1 ? 'PIECE' : 'PIECES'}</strong></div>
      </section>

      {campaign && (
        <section className="edit-campaign-interlude stush-campaign-art" data-qa="category-campaign">
          <Image src={campaign.src} alt={campaign.alt} fill sizes="100vw" />
          <span className="edit-campaign-interlude__veil" />
          <div className="edit-campaign-interlude__copy">
            <span>{config.kicker}</span>
            <strong>{config.campaignLine}</strong>
            <a href="#pieces">SHOP THE EDIT ↘</a>
          </div>
        </section>
      )}

      <section className="edit-product-floor" id="pieces" data-product-count={products.length}>
        <header className="edit-product-floor__head">
          <div><span className="edit-kicker">THE LIVE EDIT</span><h2>{category.label}</h2></div>
          <p>Real STUSH product photography. Live names and pricing. No concept garments.</p>
        </header>
        {products.length ? (
          <div className="edit-product-grid">{products.map((product, index) => <CurtainCard key={product.id} product={product} priority={index < 4} />)}</div>
        ) : (
          <div className="edit-empty">This edit is being loaded. <a href="/shop">Shop the full wardrobe ↗</a></div>
        )}
      </section>

      <section className="edit-next stush-house-backdrop stush-house-backdrop--edit-next">
        <span className="edit-kicker">MOVE THROUGH THE WARDROBE</span>
        <div className="edit-next__grid">
          {adjacent.map((item, index) => (
            <a key={item.key} href={`/collections/${item.key}`}><small>0{index + 1}</small><strong>{item.label}</strong><span>{item.eyebrow}</span><i>↗</i></a>
          ))}
        </div>
      </section>
    </div>
  );
}
