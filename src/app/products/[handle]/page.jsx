import { getProductByHandle, plainDescription } from '@/lib/shopify';
import { redirect } from 'next/navigation';
import ProductInteractive from '@/components/ProductInteractive';

export const dynamic = 'force-dynamic';

const STORE_URL = "https://bodgeaworldwide.myshopify.com";
const SITE_URL = 'https://stushusa.com';

function productMetadataTitle(title = '') {
  const cleaned = title.replace(/^stush\s*[—–-]\s*/i, '').trim();
  return cleaned ? `${cleaned} — STUSH` : 'STUSH — Dressed for the Room';
}

export async function generateMetadata({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) return {
    title: 'STUSH — Dressed for the Room',
    description: 'Shop the current STUSH collection.',
  };

  const title = productMetadataTitle(product.title);
  const description = plainDescription(product.body_html, 160);
  const url = `${SITE_URL}/products/${product.handle}`;
  const image = product.image?.src || product.images?.[0]?.src;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'STUSH',
      type: 'website',
      ...(image ? { images: [{ url: image, alt: product.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductByHandle(params.handle);

  // Campaign links can outlive Shopify handles. Keep the customer inside the
  // brand instead of dropping them on a dead PDP.
  if (!product) redirect('/collections/stush#all');

  return (
    <ProductInteractive
      product={product}
      store={STORE_URL}
      descriptionHtml={product.body_html || ''}
    />
  );
}
