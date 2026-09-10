export default function NotFound() {
  return (
    <section className="stush-utility-page">
      <div className="stush-utility-card" data-stush-reveal>
        <span className="stush-status-code" aria-hidden="true">404</span>
        <span className="stush-utility-kicker">STUSH / WRONG ROOM</span>
        <h1>This piece moved on.</h1>
        <p>The page or product you followed is no longer part of the current edit. Return to the active Fall wardrobe instead of landing on a dead page.</p>
        <div className="stush-utility-actions"><a href="/shop" className="btn-primary">Shop current edit</a><a href="/collections" className="btn-ghost">Collections</a></div>
      </div>
    </section>
  );
}
