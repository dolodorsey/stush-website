import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import { sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Journal — STUSH', description: 'House notes on STUSH design, culture, silhouette and Fall/Winter 2026.' };

const JOURNAL_ENTRIES = [
  { title: 'Dressed for the Room', excerpt: 'The house philosophy: proportion, presence and why the entrance matters.', category: 'House Code', date: 'Issue 001', href: '/lookbook' },
  { title: 'Atlanta, Then Everywhere', excerpt: 'The city is the starting point, not the boundary. Origin is useful only when it gives the clothes a point of view.', category: 'Culture', date: 'Issue 001', href: '/collections' },
  { title: 'The New Uniform', excerpt: 'Jerseys, polos and track references rebuilt as a sharper everyday wardrobe.', category: 'Design', date: 'Issue 001', href: '/collections/jerseys' },
  { title: 'Fall Weight', excerpt: 'Why structure, substantial fleece and outer layers matter when the season changes.', category: 'Wardrobe', date: 'Issue 001', href: '/collections/outerwear' },
  { title: 'Fewer. Better.', excerpt: 'A tighter catalog makes the individual piece matter more and the whole wardrobe easier to understand.', category: 'Merchandising', date: 'Issue 001', href: '/shop' },
  { title: 'The Essentials Study', excerpt: 'The foundation layer for Fall: pieces designed to repeat without becoming invisible.', category: 'Foundation', date: 'Issue 001', href: '/collections/essentials' },
];

function mediaFor(product) {
  const image = getCommerceLeadImage(product);
  const src = image?.src || image?.url || null;
  return src ? { src, alt: image?.alt || image?.altText || product?.title || 'STUSH product study' } : null;
}

export default async function JournalPage() {
  const products = sortStushProducts(await getProducts({ limit: 250 }));
  const studies = products.map(product => ({ product, media: mediaFor(product) })).filter(item => item.media);
  const lead = studies[0];
  const stories = JOURNAL_ENTRIES.slice(1).map((entry, index) => ({ ...entry, study: studies[index + 1] || studies[index % Math.max(1, studies.length)] }));

  return (
    <>
      <header className="journal-masthead" data-qa="journal-masthead">
        <div className="journal-masthead__meta"><span>STUSH HOUSE NOTES</span><span>ISSUE 001 / FALL 26</span><span>ATLANTA → WORLD</span></div>
        <h1>JOURNAL</h1>
      </header>

      <section className="journal-lead" data-qa="journal-lead">
        <div className="journal-lead__media">
          {lead?.media && <Image src={lead.media.src} alt={lead.media.alt} fill sizes="(max-width: 900px) 100vw, 58vw" priority />}
        </div>
        <div className="journal-lead__copy">
          <small>{JOURNAL_ENTRIES[0].category} / {JOURNAL_ENTRIES[0].date}</small>
          <h2>{JOURNAL_ENTRIES[0].title}</h2>
          <p>{JOURNAL_ENTRIES[0].excerpt} STUSH exists to make clothes with a point of view before adding more product to the internet.</p>
          <a className="flag-link" href={JOURNAL_ENTRIES[0].href}>ENTER THE FALL STUDY ↗</a>
        </div>
      </section>

      <section className="journal-issues" data-qa="journal-issues">
        <div className="journal-issues__grid">
          {stories.map(({ study, ...entry }) => (
            <article className="journal-story" key={entry.title}>
              <div className="journal-story__media">
                {study?.media && <Image src={study.media.src} alt={study.media.alt} fill sizes="(max-width: 760px) 100vw, 45vw" />}
              </div>
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
