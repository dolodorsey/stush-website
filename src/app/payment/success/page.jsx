export const metadata = { title: 'Order Confirmed — STUSH' };

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = typeof params?.session_id === 'string' ? params.session_id : '';

  return (
    <section className="stush-utility-page stush-success-page">
      <div className="stush-utility-card stush-success-card" data-stush-reveal>
        <span className="stush-utility-kicker">STUSH / ORDER CONFIRMED</span>
        <span className="stush-success-mark" aria-hidden="true">✓</span>
        <h1>The room is yours.</h1>
        <p>Your payment was accepted. Your STUSH order is now moving into fulfillment. Order and shipping updates will follow through the contact information used at checkout.</p>
        {sessionId && <p className="stush-success-reference">REFERENCE / {sessionId}</p>}
        <div className="stush-utility-actions">
          <a href="/shop" className="btn-primary">Continue shopping</a>
          <a href="/lookbook" className="btn-ghost">View lookbook</a>
        </div>
      </div>
    </section>
  );
}
