import './globals.css';
import MobileMenu from '@/components/MobileMenu';
import NavScroll from '@/components/NavScroll';

export const metadata = {
  title: 'STUSH — Editorial Empire from Atlanta',
  description: 'Streetwear for the room. From Atlanta. For the world. Designed pieces, runway-grade construction, hand-crafted statements.',
  openGraph: {
    title: 'STUSH',
    description: 'Editorial Empire from Atlanta.',
    type: 'website',
    url: 'https://stushusa.com',
  },
};

const SHOPIFY = 'https://www.bodegabodegabodega.com';

const NAV = [
  { label: 'Shop',         href: '/shop' },
  { label: 'Collections',  href: '/collections' },
  { label: 'Lookbook',     href: '/lookbook' },
  { label: 'Journal',      href: '/journal' },
  { label: 'Society',      href: '/#society' },
];

const ANNOUNCE_LINES = [
  'New season — The Editorial Empire',
  'Complimentary US shipping over $250',
  'Atelier pieces — limited runs only',
  'Stush. From Atlanta. For the room.',
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Top marquee — wakes the page up */}
        <aside className="announce" aria-label="Site announcements">
          <div className="announce__track">
            {[0,1].map(loop => (
              <span key={loop} aria-hidden={loop === 1}>
                {ANNOUNCE_LINES.map((line, i) => (
                  <span className="announce__item" key={loop + '-' + i}>
                    {line}
                    <span className="announce__dot" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </aside>

        <NavScroll />
        <nav className="nav" aria-label="Primary">
          <a href="/" className="nav__logo">Stush</a>
          <ul className="nav__links">
            {NAV.map(n => (
              <li key={n.label}>
                <a href={n.href} className="nav__link">{n.label}</a>
              </li>
            ))}
            <li>
              <a href={`${SHOPIFY}/cart`} className="nav__link nav__link--bag">Bag</a>
            </li>
          </ul>
          <MobileMenu />
        </nav>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer__top">
            <div>
              <div className="footer__brand">Stush</div>
              <p className="footer__desc">
                An editorial house from Atlanta. Designed pieces for the room, the runway, and the
                people who refuse to dress for everyone else.
              </p>
            </div>
            <div>
              <div className="footer__heading">The Empire</div>
              <a href="/shop"        className="footer__link">Shop All</a>
              <a href="/collections" className="footer__link">Collections</a>
              <a href="/lookbook"    className="footer__link">Lookbook</a>
              <a href="/journal"     className="footer__link">Journal</a>
              <a href="/#society"    className="footer__link">The Society</a>
            </div>
            <div>
              <div className="footer__heading">Collections</div>
              <a href="/collections/stush"      className="footer__link">The Full Empire</a>
              <a href="/shop"                    className="footer__link">Shop All</a>
              <a href="/lookbook"                className="footer__link">Lookbook</a>
              <a href="/journal"                 className="footer__link">Journal</a>
            </div>
            <div>
              <div className="footer__heading">Studio</div>
              <a href={`${SHOPIFY}/pages/contact`}            className="footer__link">Contact</a>
              <a href={`${SHOPIFY}/policies/shipping-policy`} className="footer__link">Shipping</a>
              <a href={`${SHOPIFY}/policies/refund-policy`}   className="footer__link">Returns</a>
              <a href="mailto:THEDOCTORDORSEY@gmail.com"      className="footer__link">Press</a>
              <a href="tel:4048199609"                        className="footer__link">(404) 819-9609</a>
            </div>
          </div>
          <div className="footer__bottom">
            <span className="footer__copy">© {new Date().getFullYear()} Stush — From Atlanta. For the World.</span>
            <span className="footer__copy">SS / FW / Forever — Atlanta, GA</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
