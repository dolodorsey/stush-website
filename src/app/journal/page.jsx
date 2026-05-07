import { getProducts } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Journal — STUSH' };

// Placeholder editorial entries — when real journal content is created,
// these can be sourced from a CMS or Supabase table.
const JOURNAL_ENTRIES = [
  {
    slug: 'dressed-for-the-room',
    title: 'Dressed for the Room',
    excerpt: 'The philosophy behind every STUSH piece — why we design for entrances, not exits.',
    category: 'Philosophy',
    date: 'May 2026',
  },
  {
    slug: 'atl-to-the-world',
    title: 'ATL to the World',
    excerpt: 'How Atlanta\'s culture, music, and energy flow through every stitch.',
    category: 'Culture',
    date: 'April 2026',
  },
  {
    slug: 'the-blazer-doctrine',
    title: 'The Blazer Doctrine',
    excerpt: 'A blazer isn\'t a garment. It\'s a statement of intent. Our approach to the cornerstone piece.',
    category: 'Design',
    date: 'March 2026',
  },
  {
    slug: 'outerwear-as-armor',
    title: 'Outerwear as Armor',
    excerpt: 'Every jacket tells a story. The Outerwear Vault unpacked.',
    category: 'Collection',
    date: 'March 2026',
  },
  {
    slug: 'limited-runs-only',
    title: 'Limited Runs Only',
    excerpt: 'Why scarcity is the only luxury that matters in the age of everything.',
    category: 'Philosophy',
    date: 'February 2026',
  },
  {
    slug: 'the-set-theory',
    title: 'The Set Theory',
    excerpt: 'Coordinated sets are the new power suit. Why we\'re doubling down.',
    category: 'Design',
    date: 'February 2026',
  },
];

export default async function JournalPage() {
  const products = await getProducts({ limit: 30 });
  // Use product images as hero images for journal cards
  const images = products
    .filter(p => p.images?.length)
    .map(p => p.images[0].src);

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / Journal
        </span>
        <h1 className="page-head__title">
          The <em>Journal</em>
        </h1>
      </header>

      <div className="journal-grid">
        {JOURNAL_ENTRIES.map((entry, i) => (
          <a
            key={entry.slug}
            href={`/journal#${entry.slug}`}
            className="journal-card"
            id={entry.slug}
          >
            <div className="journal-card__img-wrap">
              {images[i] && (
                <img
                  src={images[i]}
                  alt={entry.title}
                  className="journal-card__img"
                  loading="lazy"
                />
              )}
            </div>
            <div className="journal-card__meta">
              <span>{entry.category}</span>
              <span>{entry.date}</span>
            </div>
            <h3 className="journal-card__title">{entry.title}</h3>
            <p className="journal-card__excerpt">{entry.excerpt}</p>
          </a>
        ))}
      </div>
    </>
  );
}
