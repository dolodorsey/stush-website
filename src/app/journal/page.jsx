import { getProducts } from '@/lib/shopify';
import { sortStushProducts } from '@/lib/stush-categories';
import { getCommerceLeadImage } from '@/lib/stush-merchandising';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Journal — STUSH' };

const JOURNAL_ENTRIES = [
  { title: 'Dressed for the Room', excerpt: 'The house philosophy: proportion, presence and why the entrance matters.', category: 'House Code', date: 'FW26' },
  { title: 'Atlanta, Then Everywhere', excerpt: 'The city is the starting point, not the boundary.', category: 'Culture', date: 'FW26' },
  { title: 'The New Uniform', excerpt: 'Jerseys, polos and track references rebuilt as a sharper everyday wardrobe.', category: 'Design', date: 'FW26' },
  { title: 'Fall Weight', excerpt: 'Why the next edit needs knitwear, structured outerwear and substantial basics.', category: 'Wardrobe', date: 'FW26' },
  { title: 'Fewer. Better.', excerpt: 'A tighter catalog makes the individual piece matter more.', category: 'Merchandising', date: 'FW26' },
  { title: 'The Essentials Study', excerpt: 'The foundation layer for Fall: tees, sweats, fleece, socks, headwear and repeat-wear pieces.', category: 'Coming Next', date: 'FW26' },
];

export default async function JournalPage() {
  const products = sortStushProducts(await getProducts({ limit: 250 }));
  const images = products.map(product => getCommerceLeadImage(product)).filter(Boolean);

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb"><a href="/">Stush</a> / Journal</span>
        <span className="page-head__season">HOUSE NOTES / FALL 26</span>
        <h1 className="page-head__title">The <em>Journal</em></h1>
      </header>

      <section className="journal-intro" data-stush-reveal><p>STUSH is not a blog feed. The Journal is the thinking behind the clothes: silhouette, culture, product and the rooms the wardrobe is built for.</p></section>

      <div className="journal-grid">
        {JOURNAL_ENTRIES.map((entry, i) => {
          const image = images[i];
          const src = image?.src || image?.url;
          return <article key={entry.title} className="journal-card" data-stush-reveal><div className="journal-card__img-wrap">{src && <img src={src} alt="" className="journal-card__img" loading="lazy" />}</div><div className="journal-card__meta"><span>{entry.category}</span><span>{entry.date}</span></div><h3 className="journal-card__title">{entry.title}</h3><p className="journal-card__excerpt">{entry.excerpt}</p></article>;
        })}
      </div>
    </>
  );
}
