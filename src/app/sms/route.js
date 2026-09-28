import { renderPage, htmlResponse, handleOptin } from '../_a2p/a2p-pages.mjs';
const BRAND = {"key": "stush", "name": "STUSH", "domain": "stushusa.com", "home": "/", "programDescription": "Sign up for STUSH texts to hear first about new drops, restocks, and member-only offers.", "messageTypes": "STUSH clothing drops, new arrivals, restocks, promotions, and order or customer-service updates."};
export function GET() { return htmlResponse(renderPage('sms', BRAND)); }
export async function POST(request) { return handleOptin(request, BRAND); }
