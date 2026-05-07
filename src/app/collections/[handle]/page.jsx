import { getCollectionByHandle, getCollectionProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import CurtainCard from '@/components/CurtainCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const col = await getCollectionByHandle(params.handle);
  if (!col) return {};
  return { title: `${col.title} — STUSH` };
}

export default async function CollectionPage({ params }) {
  const col = await getCollectionByHandle(params.handle);
  if (!col) notFound();

  const products = await getCollectionProducts(col.id, 60);

  // Split title for italic accent on last word
  const words = col.title.split(' ');
  const lastWord = words.pop();
  const firstWords = words.join(' ');

  return (
    <>
      <header className="page-head">
        <span className="page-head__crumb">
          <a href="/">Stush</a> / <a href="/collections">Collections</a> / {col.title}
        </span>
        <h1 className="page-head__title">
          {firstWords} <em>{lastWord}</em>
        </h1>
      </header>

      <section style={{ padding: 0 }}>
        {products.length > 0 ? (
          <div className="collection-grid">
            {products.map((p, i) => (
              <CurtainCard key={p.id} product={p} priority={i < 6} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: 'clamp(80px, 12vw, 160px) var(--gutter)',
            textAlign: 'center',
          }}>
            <p className="meta">This collection is being curated. Check back soon.</p>
          </div>
        )}
      </section>
    </>
  );
}
