import { getProductByHandle, plainDescription } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import ProductInteractive from '@/components/ProductInteractive';

export const dynamic = 'force-dynamic';

const STORE_URL = "https://www.bodegabodegabodega.com";

export async function generateMetadata({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) return {};
  return {
    title: `${product.title} — STUSH`,
    description: plainDescription(product.body_html, 160),
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  const description = plainDescription(product.body_html, 600);

  return (
    <ProductInteractive
      product={product}
      store={STORE_URL}
      description={description}
    />
  );
}
