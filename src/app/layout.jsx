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
  { label: 'Shop All',      href: '/shop' },
  { label: 'New Arrivals',  href: `${SHOPIFY}/collections/the-arrivals` },
  { label: 'Outerwear',     href: `${SHOPIFY}/collections/the-outerwear-vault` },
  { label: 'Blazers',       href: `${SHOPIFY}/collections/the-blazer-room` },
  { label: 'Tops',          href: `${SHOPIFY}/collections/the-tops-gallery` },
  { label: 'Accessories',   href: `${SHOPIFY}/collections/the-accessories-lab` },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
              <a href={`${SHOPIFY}/collections/the-arrivals`}        className="footer__link">New Arrivals</a>
              <a href={`${SHOPIFY}/collections/the-outerwear-vault`} className="footer__link">Outerwear</a>
              <a href={`${SHOPIFY}/collections/the-blazer-room`}     className="footer__link">Blazers & Suits</a>
              <a href={`${SHOPIFY}/collections/the-tops-gallery`}    className="footer__link">Tops</a>
              <a href={`${SHOPIFY}/collections/the-denim-archive`}   className="footer__link">Denim & Trousers</a>
              <a href={`${SHOPIFY}/collections/the-accessories-lab`} className="footer__link">Accessories</a>
              <a href={`${SHOPIFY}/collections/the-sets-edit`}       className="footer__link">Sets</a>
              <a href={`${SHOPIFY}/collections/all-products`}        className="footer__link">Shop All</a>
            </div>
            <div>
              <div className="footer__heading">Info</div>
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
