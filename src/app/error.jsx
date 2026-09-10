'use client';

export default function ErrorPage({ reset }) {
  return (
    <section className="stush-utility-page">
      <div className="stush-utility-card">
        <span className="stush-status-code" aria-hidden="true">STUSH</span>
        <span className="stush-utility-kicker">THE ROOM MISSED A BEAT</span>
        <h1>Try the entrance again.</h1>
        <p>Something interrupted this page before it finished loading. Your next move should be immediate, not a blank screen.</p>
        <div className="stush-utility-actions"><button type="button" className="btn-primary" onClick={() => reset()}>Try again</button><a href="/shop" className="btn-ghost">Shop the wardrobe</a></div>
      </div>
    </section>
  );
}
