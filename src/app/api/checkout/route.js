import { NextResponse } from 'next/server';

const PAYMENT_RAIL = 'https://dzlmtvodpyhetvektfuo.supabase.co/functions/v1/khg-commerce-checkout';

export async function POST(request) {
  try {
    const { productHandle, variantId, variantTitle, quantity = 1 } = await request.json();
    if (!productHandle || !variantId) {
      return NextResponse.json({ message: 'Choose an available product option.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const response = await fetch(PAYMENT_RAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      cache: 'no-store',
      body: JSON.stringify({
        brand_key: 'stush',
        return_origin: origin,
        lines: [{
          productHandle,
          variantId,
          variantTitle: variantTitle || '',
          quantity: Math.max(1, Math.min(10, Number(quantity) || 1)),
        }],
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.checkoutUrl) {
      return NextResponse.json(
        { message: data.error || 'Secure checkout is temporarily unavailable.' },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({
      checkoutUrl: data.checkoutUrl,
      checkoutSessionId: data.session_id,
      paymentId: data.payment_id,
      provider: 'stripe',
    });
  } catch (error) {
    console.error('STUSH Stripe checkout error', error);
    return NextResponse.json({ message: 'Secure checkout is temporarily unavailable.' }, { status: 500 });
  }
}
