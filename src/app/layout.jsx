import './globals.css';
import MobileMenu from '@/components/MobileMenu';

export const metadata = {
  title: 'STUSH — Luxury Streetwear & Designer Fashion',
  description: 'Elevated streetwear and designer fashion for the culture. Blazers, outerwear, accessories, and statement pieces.',
  openGraph: {
    title: 'STUSH',
    description: 'Elevated streetwear and designer fashion for the culture.',
    siteName: 'STUSH',
    type: 'website',
  },
};

const SHOPIFY = 'https://stushusa.myshopify.com';

const NAV = [
  { label: 'Shop All', href: '/shop' },
  { label: 'New Arrivals', href: `${SHOPIFY}/collections/new-arrivals` },
  { label: 'Outerwear', href: `${SHOPIFY}/collections/outerwear` },
  { label: 'Blazers', href: `${SHOPIFY}/collections/blazers-suits` },
  { label: 'Tops', href: `${SHOPIFY}/collections/tops` },
  { label: 'Accessories', href: `${SHOPIFY}/collections/accessories` },
  { label: 'Under $300', href: `${SHOPIFY}/collections/under-300` },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ANNOUNCEMENT BAR */}
        <div className="announce">
          <div className="announce__track">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="announce__item">LUXURY IS A LIFESTYLE &bull; FREE SHIPPING ON ORDERS $250+ &bull;</span>
            ))}
          </div>
        </div>

        <nav className="nav">
          <a href="/" className="nav__logo">Stush</a>
          <ul className="nav__links">
            {NAV.map(n => (
              <li key={n.label}><a href={n.href} className="nav__link">{n.label}</a></li>
            ))}
            <li><a href={`${SHOPIFY}/cart`} className="nav__link" style={{ color: '#C8A97E' }}>Cart</a></li>
          </ul>
          <MobileMenu />
        </nav>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer__grid">
            <div>
              <div className="footer__brand">Stush</div>
              <p className="footer__desc">
                Elevated streetwear and designer fashion for the culture. Where luxury meets the streets. Every piece is a statement.
              </p>
            </div>
            <div>
              <div className="footer__heading">Shop</div>
              <a href={`${SHOPIFY}/collections/new-arrivals`} className="footer__link">New Arrivals</a>
              <a href={`${SHOPIFY}/collections/outerwear`} className="footer__link">Outerwear</a>
              <a href={`${SHOPIFY}/collections/blazers-suits`} className="footer__link">Blazers & Suits</a>
              <a href={`${SHOPIFY}/collections/tops`} className="footer__link">Tops</a>
              <a href={`${SHOPIFY}/collections/hoodies-sweatshirts`} className="footer__link">Hoodies & Sweatshirts</a>
              <a href={`${SHOPIFY}/collections/jackets-bombers`} className="footer__link">Jackets & Bombers</a>
              <a href={`${SHOPIFY}/collections/denim-trousers`} className="footer__link">Denim & Trousers</a>
              <a href={`${SHOPIFY}/collections/accessories`} className="footer__link">Accessories</a>
              <a href={`${SHOPIFY}/collections/premium`} className="footer__link">Premium Collection</a>
              <a href={`${SHOPIFY}/collections/under-300`} className="footer__link">Under $300</a>
            </div>
            <div>
              <div className="footer__heading">Info</div>
              <a href={`${SHOPIFY}/pages/about`} className="footer__link">About</a>
              <a href={`${SHOPIFY}/pages/contact`} className="footer__link">Contact</a>
              <a href={`${SHOPIFY}/policies/shipping-policy`} className="footer__link">Shipping</a>
              <a href={`${SHOPIFY}/policies/refund-policy`} className="footer__link">Returns</a>
            </div>
            <div>
              <div className="footer__heading">Connect</div>
              <a href="mailto:THEDOCTORDORSEY@gmail.com" className="footer__link">Email</a>
              <a href="tel:4048199609" className="footer__link">(404) 819-9609</a>
              <p className="footer__link" style={{ cursor: 'default' }}>Atlanta, Georgia</p>
            </div>
          </div>
          <div className="footer__bottom">
            <span>&copy; 2026 STUSH &mdash; ELEVATED STREETWEAR</span>
            <span>A Kollective Hospitality Group brand</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
