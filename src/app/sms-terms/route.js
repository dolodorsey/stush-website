import { renderPage, htmlResponse } from '../_a2p/a2p-pages.mjs';
const BRAND = {"key": "stush", "name": "STUSH", "domain": "stushusa.com", "home": "/", "programDescription": "Sign up for STUSH texts to hear first about new drops, restocks, and member-only offers.", "messageTypes": "STUSH clothing drops, new arrivals, restocks, promotions, and order or customer-service updates."};
export const dynamic = 'force-static';
export function GET() { return htmlResponse(renderPage('sms-terms', BRAND)); }
