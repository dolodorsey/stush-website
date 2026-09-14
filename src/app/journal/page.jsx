import Image from 'next/image';
import { STUSH_CAMPAIGN, STUSH_HOUSE_WORLD } from '@/lib/stush-campaign-assets';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Journal — STUSH', description: 'House notes on STUSH design, culture, silhouette and Fall/Winter 2026.' };

const JOURNAL_ENTRIES = [
  { title: 'Dressed for the Room', excerpt: 'The house philosophy: proportion, presence and why the entrance matters.', category: 'House Code', date: 'Issue 001', href: '/lookbook', image: STUSH_HOUSE_WORLD.roses },
  { title: 'Atlanta, Then Everywhere', excerpt: 'The city is the starting point, not the boundary. Origin is useful only when it gives the clothes a point of view.', category: 'Culture', date: 'Issue 001', href: '/collections', image: STUSH_CAMPAIGN.rooftopBlackJersey },
  { title: 'The New Uniform', excerpt: 'Jerseys, polos and track references rebuilt as a sharper everyday wardrobe.', category: 'Design', date: 'Issue 001', href: '/collections/jerseys', image: STUSH_CAMPAIGN.courtGreenJersey },
  { title: 'Fall Weight', excerpt: 'Why structure, substantial fleece and outer layers matter when the season changes.', category: 'Wardrobe', date: 'Issue 001', href: '/collections/outerwear', image: STUSH_CAMPAIGN.wardrobeRack },
  { title: 'Fewer. Better.', excerpt: 'A tighter catalog makes the individual piece matter more and the whole wardrobe easier to understand.', category: 'Merchandising', date: 'Issue 001', href: '/shop', image: STUSH_HOUSE_WORLD.chrome },
  { title: 'The Essentials Study', excerpt: 'The foundation layer for Fall: pieces designed to repeat without becoming invisible.', category: 'Foundation', date: 'Issue 001', href: '/collections/essentials', image: STUSH_CAMPAIGN.blackMonogramStillLife },
];

export default function JournalPage() {
  const [lead, ...stories] = JOURNAL_ENTRIES;
  return (
    <>
      <header className="journal-masthead" data-qa="journal-masthead">
        <div className="journal-masthead__meta"><span>STUSH HOUSE NOTES</span><span>ISSUE 001 / FALL 26</span><span>ATLANTA → WORLD</span></div>
        <h1>JOURNAL</h1>
      </header>

      <section className="journal-lead stush-campaign-art" data-qa="journal-lead">
        <div className="journal-lead__media"><Image src={lead.image.src} alt={lead.image.alt} fill sizes="(max-width: 900px) 100vw, 58vw" priority /></div>
        <div className="journal-lead__copy">
          <small>{lead.category} / {lead.date}</small>
          <h2>{lead.title}</h2>
          <p>{lead.excerpt} STUSH exists to make clothes with a point of view before adding more product to the internet.</p>
          <a className="flag-link" href={lead.href}>ENTER THE FALL STUDY ↗</a>
        </div>
      </section>

      <section className="journal-issues" data-qa="journal-issues">
        <div className="journal-issues__grid stush-campaign-art">
          {stories.map(entry => (
            <article className="journal-story" key={entry.title}>
              <div className="journal-story__media"><Image src={entry.image.src} alt={entry.image.alt} fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
              <div className="journal-story__copy"><small>{entry.category} / {entry.date}</small><h3>{entry.title}</h3><p>{entry.excerpt}</p><a href={entry.href}>READ THROUGH THE WARDROBE ↗</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="journal-departments">
        <small>JOURNAL DEPARTMENTS / PERMANENT INDEX</small>
        <div className="journal-departments__row">
          <span><small>01</small>House Code<small>PHILOSOPHY</small></span>
          <span><small>02</small>Design Notes<small>PRODUCT</small></span>
          <span><small>03</small>Wardrobe Studies<small>STYLING</small></span>
          <span><small>04</small>Culture<small>CONTEXT</small></span>
        </div>
      </section>
    </>
  );
}
