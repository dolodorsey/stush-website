import Image from 'next/image';
import { getProducts, SHOP_URL } from '@/lib/shopify';
import ShopCard from '@/components/ShopCard';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts } from '@/lib/stush-categories';
import { STUSH_CATEGORY_CAMPAIGN, STUSH_HOUSE_WORLD } from '@/lib/stush-campaign-assets';
import { toShopCard } from '@/lib/stush-shop-cards';

export const dynamic = 'force-dynamic';

const TILE_ORDER = ['women', 'outerwear', 'jerseys', 'hoodies', 'tops', 'bottoms', 'essentials', 'accessories'];

export default async function HomePage() {
  const raw = sortStushProducts(await getProducts({ limit: 250 }));
  const grouped = groupStushProducts(raw);
  const cards = raw.map(toShopCard).filter(card => card.cover);
  const inStock = cards.filter(card => card.available);
  const newest = [...inStock].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).slice(0, 8);
  const shown = new Set(newest.map(card => card.id));

  const counts = Object.fromEntries(STUSH_CATEGORIES.map(category => [category.key, (grouped[category.key] || []).length]));
  const tiles = TILE_ORDER.filter(key => counts[key] > 0 && STUSH_CATEGORY_CAMPAIGN[key]).slice(0, 4)
    .map(key => ({ ...STUSH_CATEGORIES.find(category => category.key === key), count: counts[key], art: STUSH_CATEGORY_CAMPAIGN[key] }));

  const spotlightKey = ['outerwear', 'hoodies', 'jerseys', 'tops'].find(key => inStock.filter(card => card.categories.includes(key) && !shown.has(card.id)).length >= 4);
  const spotlight = spotlightKey ? STUSH_CATEGORIES.find(category => category.key === spotlightKey) : null;
  const spotlightCards = spotlight ? inStock.filter(card => card.categories.includes(spotlightKey) && !shown.has(card.id)).slice(0, 8) : [];

  return (
    <div className="sf-home">
      {/* LOCKED: the homepage landing film stays exactly separate, wordless and unchanged. */}
      <section className="flag-hero" data-qa="animation-hero" aria-label="STUSH campaign film">
        <video
          className="flag-hero__media"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/campaigns/stush-real-product.png"
          src="/STUSH_VID.mp4"
          aria-hidden="true"
        />
      </section>

      <nav className="sf-bar sf-bar--sticky sf-bar--home" aria-label="Shop by category">
        <div className="sf-chips">
          <a href="/shop" className="is-on">Shop all <small>{cards.length}</small></a>
          {STUSH_CATEGORIES.filter(category => counts[category.key] > 0).map(category => (
            <a key={category.key} href={`/shop#${category.key}`}>{category.label} <small>{counts[category.key]}</small></a>
          ))}
        </div>
      </nav>

      <section className="sf-section sf-section--first" data-qa="home-new-in">
        <header className="sf-head">
          <div>
            <span className="sf-kicker">Fall / Winter 26 · Atlanta</span>
            <h1>New in.</h1>
          </div>
          <a href="/shop" className="sf-link">Shop all {cards.length} pieces →</a>
        </header>
        <div className="sf-grid">
          {newest.map((card, index) => <ShopCard key={card.id} product={card} priority={index < 4} />)}
        </div>
      </section>

      {tiles.length > 0 && (
        <section className="sf-section sf-section--tight" aria-label="Shop by category">
          <header className="sf-head">
            <div><span className="sf-kicker">The wardrobe</span><h2>Shop by category.</h2></div>
          </header>
          <div className={`sf-tiles sf-tiles--${tiles.length}`}>
            {tiles.map(tile => (
              <a key={tile.key} href={`/shop#${tile.key}`} className="sf-tile">
                <Image src={tile.art.src} alt={tile.art.alt} fill sizes="(max-width: 700px) 50vw, 25vw" />
                <span className="sf-tile__veil" />
                <span className="sf-tile__label"><strong>{tile.label}</strong><small>{tile.count} pieces →</small></span>
              </a>
            ))}
          </div>
        </section>
      )}

      {spotlight && (
        <section className="sf-section" aria-label={spotlight.label}>
          <header className="sf-head">
            <div><span className="sf-kicker">{spotlight.eyebrow}</span><h2>{spotlight.label}.</h2></div>
            <a href={`/shop#${spotlight.key}`} className="sf-link">Shop {spotlight.label.toLowerCase()} →</a>
          </header>
          <div className="sf-grid">
            {spotlightCards.map(card => <ShopCard key={card.id} product={card} />)}
          </div>
        </section>
      )}

      <a href="/lookbook" className="sf-banner">
        <Image src={STUSH_HOUSE_WORLD.rainyBoutique.src} alt={STUSH_HOUSE_WORLD.rainyBoutique.alt} fill sizes="100vw" />
        <span className="sf-banner__veil" />
        <span className="sf-banner__copy">
          <span className="sf-kicker">The house world</span>
          <strong>Dressed for <em>the room.</em></strong>
          <span className="sf-link sf-link--light">View the lookbook →</span>
        </span>
      </a>

      <section className="sf-signup" id="society">
        <div>
          <span className="sf-kicker">Private access</span>
          <h2>First to the drop.</h2>
          <p>New pieces, restocks and private invitations — before anyone else.</p>
        </div>
        <form action={`${SHOP_URL}/contact#contact_form`} method="POST">
          <input type="hidden" name="form_type" value="customer" />
          <input type="hidden" name="utf8" value="✓" />
          <input type="hidden" name="contact[tags]" value="newsletter,stush,society,stush-newsletter" />
          <input type="email" name="contact[email]" placeholder="Email address" required autoComplete="email" aria-label="Email address" />
          <button type="submit">Join</button>
        </form>
      </section>
    </div>
  );
}
