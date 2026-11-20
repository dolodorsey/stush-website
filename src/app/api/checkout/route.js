import { NextResponse } from 'next/server';
import { getProductByHandle, cartAddUrl } from '@/lib/shopify';

// 2026-11-19: STUSH checkout now hands off to Shopify checkout (Shop Pay, PayPal,
// Google Pay, Venmo, cards, discount codes, abandoned-checkout capture).
// The previous Stripe rail (khg-commerce-checkout) was rejecting every session:
// "Your account cannot currently make live charges."
export async function POST(request) {
  try {
    const { productHandle, variantId, quantity = 1 } = await request.json();
    if (!productHandle || !variantId) {
      return NextResponse.json({ message: 'Choose an available product option.' }, { status: 400 });
    }

    const product = await getProductByHandle(productHandle);
    const variant = product?.variants?.find(item => String(item.id) === String(variantId).replace(/^gid:\/\/shopify\/ProductVariant\//, ''));
    if (!variant || variant.available === false) {
      return NextResponse.json({ message: 'That size or color just sold out. Choose another option.' }, { status: 409 });
    }

    const qty = Math.max(1, Math.min(10, Number(quantity) || 1));
    return NextResponse.json({ checkoutUrl: cartAddUrl(variant.id, qty), provider: 'shopify' });
  } catch (error) {
    console.error('STUSH checkout error', error);
    return NextResponse.json({ message: 'Checkout is temporarily unavailable. Please try again.' }, { status: 500 });
  }
}
