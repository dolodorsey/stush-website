'use client';
import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Women', href: '/collections/stush#women' },
  { label: 'Essentials', href: '/collections/stush#essentials' },
  { label: 'Collections', href: '/collections' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Journal', href: '/journal' },
  { label: 'Bag', href: '/cart' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button className="nav-mobile-btn" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          {open ? <><line x1="2" y1="2" x2="20" y2="12"/><line x1="2" y1="12" x2="20" y2="2"/></> : <><line x1="0" y1="1" x2="22" y2="1"/><line x1="4" y1="7" x2="22" y2="7"/><line x1="0" y1="13" x2="22" y2="13"/></>}
        </svg>
      </button>

      {open && (
        <div className="stush-mobile-menu" onClick={() => setOpen(false)}>
          <div className="stush-mobile-menu__head"><span>STUSH</span><small>FALL / WINTER 26</small></div>
          <nav className="stush-mobile-menu__links" aria-label="Mobile navigation">
            {LINKS.map((link, index) => (
              <a key={link.label} href={link.href} style={{ '--menu-index': index }}>
                <small>{String(index + 1).padStart(2,'0')}</small><strong>{link.label}</strong><span>↗</span>
              </a>
            ))}
          </nav>
          <div className="stush-mobile-menu__foot"><span>FROM ATLANTA. FOR THE WORLD.</span><span>DRESSED FOR THE ROOM.</span></div>
        </div>
      )}
    </>
  );
}
