// Debug endpoint — returns raw fetch result from Vercel's side
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const url = 'https://www.bodegabodegabodega.com/collections/stush/products.json?limit=5';
  const attempts = [];

  // Attempt 1: minimal UA
  try {
    const r = await fetch(url, { cache: 'no-store' });
    const body = await r.text();
    attempts.push({ label: 'no-headers', status: r.status, bytes: body.length, preview: body.slice(0, 300) });
  } catch (e) {
    attempts.push({ label: 'no-headers', error: String(e) });
  }

  // Attempt 2: real browser UA
  try {
    const r = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
        'Accept': 'application/json,text/plain,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    const body = await r.text();
    attempts.push({ label: 'browser-ua', status: r.status, bytes: body.length, preview: body.slice(0, 300) });
  } catch (e) {
    attempts.push({ label: 'browser-ua', error: String(e) });
  }

  // Attempt 3: .myshopify.com direct
  try {
    const r = await fetch('https://bodgeaworldwide.myshopify.com/collections/stush/products.json?limit=5', {
      cache: 'no-store',
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    const body = await r.text();
    attempts.push({ label: 'myshopify-direct', status: r.status, bytes: body.length, preview: body.slice(0, 300) });
  } catch (e) {
    attempts.push({ label: 'myshopify-direct', error: String(e) });
  }

  return Response.json({ url, attempts, timestamp: new Date().toISOString() });
}
