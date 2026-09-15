import SecondaryHouseFilm from '@/components/SecondaryHouseFilm';
import { STUSH_LOOKBOOK_SEQUENCE, STUSH_HOUSE_WORLD } from '@/lib/stush-campaign-assets';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lookbook — STUSH', description: 'STUSH Fall/Winter 2026 campaign film and wardrobe study.' };

const rows = [
  { pattern: '12', items: STUSH_LOOKBOOK_SEQUENCE.slice(0, 2) },
  { pattern: 'full', items: [STUSH_HOUSE_WORLD.roses] },
  { pattern: '3', items: STUSH_LOOKBOOK_SEQUENCE.slice(2, 5) },
  { pattern: '21', items: STUSH_LOOKBOOK_SEQUENCE.slice(5, 7) },
  { pattern: 'full', items: [STUSH_HOUSE_WORLD.chrome] },
  { pattern: '12', items: [STUSH_LOOKBOOK_SEQUENCE[7], STUSH_HOUSE_WORLD.rainyBoutique] },
];

export default function LookbookPage() {
  return (
    <>
      <section className="lb-cinema" data-qa="lookbook-cinema">
        <div className="lb-cinema__film"><SecondaryHouseFilm label="STUSH Fall 26 secondary house animation" /></div>
        <aside className="lb-cinema__rail">
          <small>STUSH / FALL 26 / CAMPAIGN 001</small>
          <h1>THE<br/><em>LOOKBOOK.</em></h1>
          <div><p>A moving study of uniform, city, texture and the way STUSH reads when the clothes leave the rack.</p><a href="/shop" className="flag-link">SHOP THE WARDROBE ↗</a></div>
        </aside>
      </section>

      <section className="lb-manifesto stush-house-backdrop" style={{ '--stush-house-bg': `url(${STUSH_HOUSE_WORLD.dressingRoom.src})` }}>
        <span>CAMPAIGN NOTE / 01</span>
        <p>Clothes are not finished until they meet a <em>room.</em> Fall 26 is built to hold one.</p>
      </section>

      <section className="lb-sequence" data-qa="lookbook-sequence">
        <div className="lookbook stush-campaign-art">
          {rows.map((row, ri) => (
            <div key={ri} className={`lb-row lb-row--${row.pattern}`}>
              {row.items.map((image, pi) => {
                const aspect = row.pattern === 'full' ? 'lb-cell--wide' : row.pattern === '3' ? 'lb-cell--sq' : 'lb-cell--tall';
                return (
                  <figure key={`${ri}-${pi}`} className={`lb-cell ${aspect}`}>
                    <img src={image.src} alt={image.alt} loading={ri < 1 ? 'eager' : 'lazy'} />
                    <figcaption className="lb-cell__caption">CAMPAIGN {String(ri + 1).padStart(2,'0')}.{pi + 1} / STUSH FALL 26</figcaption>
                  </figure>
                );
              })}
            </div>
          ))}
        </div>
        <div className="lb-sequence__footer"><span className="flag-kicker">END OF STUDY / FALL 26</span><a href="/shop" className="flag-btn flag-btn--light">SHOP THE WARDROBE</a></div>
      </section>
    </>
  );
}
