import { getProducts } from '@/lib/shopify';
import ShopFloor from '@/components/ShopFloor';
import { STUSH_CATEGORIES, groupStushProducts, sortStushProducts } from '@/lib/stush-categories';
import { toShopCard } from '@/lib/stush-shop-cards';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop — STUSH' };

export default async function ShopPage() {
  const raw = sortStushProducts(await getProducts({ limit: 250 }));
  const grouped = groupStushProducts(raw);
  const cards = raw.map(toShopCard).filter(card => card.cover);
  const categories = STUSH_CATEGORIES.map(category => ({
    key: category.key,
    label: category.label,
    count: (grouped[category.key] || []).length,
  }));

  return (
    <div className="sf-home sf-shop">
      <header className="sf-shop__head">
        <span className="sf-kicker"><a href="/">Stush</a> / Shop</span>
        <h1>The wardrobe.</h1>
      </header>
      <ShopFloor products={cards} categories={categories} />
    </div>
  );
}
