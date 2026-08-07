export const metadata = { title: 'Checkout | STUSH' };

export default async function CartReturnPage({ searchParams }) {
  const params = await searchParams;
  const canceled = params?.checkout === 'canceled';
  return (
    <main style={{ minHeight: '76vh', display: 'grid', placeItems: 'center', padding: '56px 20px', background: '#090909', color: '#f7f2eb' }}>
      <section style={{ width: 'min(640px,100%)', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .55 }}>{canceled ? 'Checkout paused' : 'STUSH cart'}</p>
        <h1 style={{ fontSize: 'clamp(38px,7vw,68px)', lineHeight: 1, margin: '16px 0' }}>{canceled ? 'Nothing was charged.' : 'Ready when you are.'}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, opacity: .68 }}>{canceled ? 'Return to the shop and reopen secure Stripe checkout whenever you are ready.' : 'Choose a product from the STUSH shop to start secure checkout.'}</p>
        <a href="/shop" style={{ display: 'inline-block', marginTop: 26, padding: '13px 20px', background: '#f7f2eb', color: '#090909', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 10 }}>Back to shop</a>
      </section>
    </main>
  );
}
