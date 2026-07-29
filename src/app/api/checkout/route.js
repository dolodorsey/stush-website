import { NextResponse } from 'next/server';

const STORE = 'https://bodgeaworldwide.myshopify.com';

export async function POST(request) {
  const { productHandle, variantId, variantTitle, quantity = 1 } = await request.json();
  if (!productHandle || !variantId) {
    return NextResponse.json({ message: 'Choose an available product option.' }, { status: 400 });
  }

  const response = await fetch(`${STORE}/products/${encodeURIComponent(productHandle)}.js`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    return NextResponse.json({ message: 'This product could not be verified.' }, { status: 502 });
  }

  const product = await response.json();
  const variants = product.variants || [];
  const normalizedId = String(variantId).replace(/^gid:\/\/shopify\/ProductVariant\//, '');
  const exact = variants.find(item => String(item.id) === normalizedId && item.available);
  const replacement = variants.find(item => item.title === variantTitle && item.available);
  const selected = exact || replacement;

  if (!selected) {
    return NextResponse.json(
      { message: 'That selection is no longer available. Choose another option.' },
      { status: 409 }
    );
  }

  const params = new URLSearchParams({
    utm_source: 'stush',
    utm_medium: 'storefront',
    utm_campaign: 'brand_store',
    brand_source: 'stush',
    landing_brand: 'stush',
    'attributes[brand_source]': 'stush',
    'attributes[landing_brand]': 'stush',
  });

  return NextResponse.json({
    checkoutUrl: `${STORE}/cart/${selected.id}:${Math.max(1, Number(quantity) || 1)}?${params}`,
  });
}
