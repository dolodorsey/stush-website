/** A same-brand, fixed return destination. Never trust a supplied redirect URL. */
export function checkoutReturnPath(params) {
  const canceled = params?.canceled === '1' || params?.checkout === 'canceled';
  return canceled ? '/cart?checkout=canceled' : '/cart';
}
