import { getProductByHandle, plainDescription } from '@/lib/shopify';
import { redirect } from 'next/navigation';
import ProductInteractive from '@/components/ProductInteractive';

export const dynamic = 'force-dynamic';

const STORE_URL = "https://bodgeaworldwide.myshopify.com";

export async function generateMetadata({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) return {
    title: 'STUSH — The Empire',
    description: 'Shop the current STUSH collection.',
  };
  return {
    title: `${product.title} — STUSH`,
    description: plainDescription(product.body_html, 160),
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
