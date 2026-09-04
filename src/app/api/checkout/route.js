import { NextResponse } from 'next/server';

const PAYMENT_RAIL = 'https://dzlmtvodpyhetvektfuo.supabase.co/functions/v1/khg-commerce-checkout';
const PAYMENT_RAIL_TIMEOUT_MS = 5_000;
const MAX_REQUEST_BYTES = 8_192;

function checkoutResponse(body, status, requestId, extraHeaders = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-STUSH-Checkout': status < 400 ? 'ready' : 'unavailable',
      'X-STUSH-Request-Id': requestId,
      ...extraHeaders,
    },
  });
}

function validIdentifier(value, maxLength = 180) {
  return (typeof value === 'string' || typeof value === 'number')
    && String(value).length > 0
    && String(value).length <= maxLength;
}

export async function POST(request) {
  const requestId = crypto.randomUUID();

  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return checkoutResponse({ message: 'Checkout request is too large.' }, 413, requestId);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return checkoutResponse({ message: 'Checkout request is invalid.' }, 400, requestId);
    }

    const { productHandle, variantId, variantTitle, quantity = 1 } = payload || {};
    if (!validIdentifier(productHandle, 120) || !validIdentifier(variantId)) {
      return checkoutResponse({ message: 'Choose an available product option.' }, 400, requestId);
    }

    const origin = new URL(request.url).origin;
    const response = await fetch(PAYMENT_RAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        'X-KHG-Brand-Key': 'stush',
        'X-KHG-Request-Id': requestId,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(PAYMENT_RAIL_TIMEOUT_MS),
      body: JSON.stringify({
        brand_key: 'stush',
        return_origin: origin,
        lines: [{
          productHandle: String(productHandle),
          variantId: String(variantId),
          variantTitle: typeof variantTitle === 'string' ? variantTitle.slice(0, 180) : '',
          quantity: Math.max(1, Math.min(10, Number(quantity) || 1)),
        }],
      }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok || !data.checkoutUrl) {
      console.error('STUSH checkout upstream unavailable', {
        requestId,
        status: response.status,
        brand: 'stush',
      });

      return checkoutResponse(
        { message: 'Private checkout is temporarily unavailable. Please try again shortly.' },
        response.status >= 500 ? 503 : 502,
        requestId,
        { 'Retry-After': '60' }
      );
    }

    return checkoutResponse({
      checkoutUrl: data.checkoutUrl,
      provider: 'stripe',
    }, 200, requestId);
  } catch (error) {
    console.error('STUSH checkout transport failure', {
      requestId,
      brand: 'stush',
      error: error instanceof Error ? error.name : 'unknown',
    });

    return checkoutResponse(
      { message: 'Private checkout is temporarily unavailable. Please try again shortly.' },
      503,
      requestId,
      { 'Retry-After': '60' }
    );
  }
}
