export const metadata = { title: 'Bag — STUSH' };

export default async function CartReturnPage({ searchParams }) {
  const params = await searchParams;
  const canceled = params?.checkout === 'canceled';
  return (
    <section className="stush-utility-page">
      <div className="stush-utility-card" data-stush-reveal>
        <span className="stush-utility-kicker">{canceled ? 'Checkout paused' : 'STUSH / BAG'}</span>
        <h1>{canceled ? 'Return to your selection.' : 'Your next piece starts here.'}</h1>
        <p>{canceled ? 'Return to the wardrobe when you are ready. This page does not verify payment status; review any payment confirmation before trying again.' : 'Pick a piece, choose your size and hit Buy now. Checkout takes Shop Pay, PayPal, Venmo and cards, and US shipping is free on orders of $70 or more.'}</p>
        <div className="stush-utility-actions">
          <a href="/shop" className="btn-primary">Shop the wardrobe</a>
          <a href="/collections" className="btn-ghost">Browse collections</a>
        </div>
      </div>
    </section>
  );
}
