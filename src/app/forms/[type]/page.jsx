import { redirect, notFound } from 'next/navigation';

// Canonical, receipt-backed STUSH forms live on the centralized KHG form engine.
// Do not restore the retired browser-to-n8n submission webhook.
const ACTIVE_ROLES = new Set([
  'inquiry', 'sponsor', 'model', 'ambassador', 'host', 'nda', 'podcast', 'promoter',
]);

export default async function StushFormRoute({ params }) {
  const { type } = await params;
  if (type === 'influencer' || type === 'creative') redirect('/forms#creative');
  if (!ACTIVE_ROLES.has(type)) notFound();
  redirect(`https://apply.stushusa.com/f/stush/${type}`);
}
