import './globals.css';
import './merchandising.css';
import './extreme-flagship.css';
import './experience.css';
import { Bodoni_Moda, DM_Mono, DM_Sans } from 'next/font/google';
import MobileMenu from '@/components/MobileMenu';
import NavScroll from '@/components/NavScroll';
import ExperienceLayer from '@/components/ExperienceLayer';

const serif = Bodoni_Moda({ subsets: ['latin'], weight: ['400','500','600','700'], style: ['normal','italic'], variable: '--font-stush-serif', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','700'], variable: '--font-stush-sans', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-stush-mono', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://stushusa.com'),
  title: 'STUSH — Dressed for the Room',
  description: 'An editorial fashion house from Atlanta. Limited pieces, sharp tailoring, street intelligence and clothes designed to hold a room.',
  openGraph: { title: 'STUSH — Dressed for the Room', description: 'An editorial fashion house from Atlanta.', type: 'website', url: 'https://stushusa.com', images: ['/campaigns/stush-real-product.png'] },
};

const NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Journal', href: '/journal' },
  { label: 'Society', href: '/#society' },
];
const ANNOUNCE_LINES = ['SS26 — Dressed for the Room','Limited Atelier releases','From Atlanta. For the World.','The Society receives first access'];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <ExperienceLayer />
        <aside className="announce" aria-label="Site announcements"><div className="announce__track">{[0,1].map(loop=><span key={loop} aria-hidden={loop===1}>{ANNOUNCE_LINES.map((line,i)=><span className="announce__item" key={`${loop}-${i}`}>{line}<span className="announce__dot"/></span>)}</span>)}</div></aside>
        <NavScroll />
        <nav className="nav" aria-label="Primary">
          <a href="/" className="nav__logo">Stush</a>
          <ul className="nav__links">{NAV.map(n=><li key={n.label}><a href={n.href} className="nav__link">{n.label}</a></li>)}<li><a href="/cart" className="nav__link nav__link--bag">Bag</a></li></ul>
          <MobileMenu />
        </nav>
        <main>{children}</main>
        <footer className="footer">
          <div className="footer__top">
            <div><div className="footer__brand">Stush</div><p className="footer__desc">An editorial house from Atlanta. Pieces for the room, the runway and the people who refuse to dress for everyone else.</p></div>
            <div><div className="footer__heading">The House</div><a href="/shop" className="footer__link">Shop</a><a href="/collections" className="footer__link">Collections</a><a href="/lookbook" className="footer__link">Lookbook</a><a href="/journal" className="footer__link">Journal</a></div>
            <div><div className="footer__heading">Private Access</div><a href="/#society" className="footer__link">The Society</a><a href="/forms/inquiry" className="footer__link">Client Services</a><a href="/forms/influencer" className="footer__link">Creative Partnerships</a><a href="/forms/sponsor" className="footer__link">Brand Partnerships</a></div>
            <div><div className="footer__heading">Atlanta</div><span className="footer__link">Editorial House</span><span className="footer__link">Limited Runs</span><span className="footer__link">Global Delivery</span></div>
          </div>
          <div className="footer__bottom"><span className="footer__copy">© {new Date().getFullYear()} STUSH — DRESSED FOR THE ROOM</span><span className="footer__copy">A KOLLECTIVE COMPANY · ATLANTA</span></div>
        </footer>
      </body>
    </html>
  );
}
