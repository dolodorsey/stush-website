export const metadata = { title: 'Order confirmed | STUSH' };

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = typeof params?.session_id === 'string' ? params.session_id : '';
  return (
    <main style={{ minHeight: '78vh', display: 'grid', placeItems: 'center', padding: '56px 20px', background: '#090909', color: '#f7f2eb' }}>
      <section style={{ width: 'min(680px,100%)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .58 }}>STUSH × Secure checkout</p>
        <h1 style={{ fontSize: 'clamp(42px,8vw,78px)', lineHeight: .95, margin: '18px 0' }}>Order confirmed.</h1>
        <p style={{ maxWidth: 540, margin: '0 auto', fontSize: 16, lineHeight: 1.7, opacity: .7 }}>Your Stripe payment was accepted and the STUSH order is being reconciled into the brand order ledger for fulfillment.</p>
        {sessionId && <p style={{ marginTop: 18, fontSize: 10, opacity: .35, wordBreak: 'break-all' }}>Checkout: {sessionId}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginTop: 30 }}>
          <a href="/shop" style={{ padding: '13px 20px', background: '#f7f2eb', color: '#090909', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 10 }}>Keep shopping</a>
          <a href="/" style={{ padding: '13px 20px', border: '1px solid rgba(255,255,255,.2)', color: '#f7f2eb', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 10 }}>STUSH home</a>
        </div>
      </section>
    </main>
  );
}
