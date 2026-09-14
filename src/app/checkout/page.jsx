import { redirect } from 'next/navigation';
import { checkoutReturnPath } from '../../lib/checkout-return.mjs';

/** Compatibility route for the existing payment rail's checkout cancel URL. */
export default async function CheckoutReturnPage({ searchParams }) {
  redirect(checkoutReturnPath(await searchParams));
}
