'use client';
import { useState } from 'react';

const S = 'https://bodgeaworldwide.myshopify.com';
const LINKS = [
  { label: 'Shop',        href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Lookbook',    href: '/lookbook' },
  { label: 'Journal',     href: '/journal' },
  { label: 'The Society', href: '/#society' },
  { label: 'Bag',         href: `${S}/cart` },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="nav-mobile-btn"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <>
              <line x1="2" y1="2" x2="20" y2="12" />
              <line x1="2" y1="12" x2="20" y2="2" />
            </>
          ) : (
            <>
              <line x1="0" y1="1" x2="22" y2="1" />
              <line x1="4" y1="7" x2="22" y2="7" />
              <line x1="0" y1="13" x2="22" y2="13" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(13,13,16,0.97)',
            backdropFilter: 'blur(24px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
            animation: 'fadeIn 300ms ease both',
          }}
          onClick={() => setOpen(false)}
        >
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--serif)", fontWeight: 300,
                fontSize: 'clamp(36px, 8vw, 56px)',
                fontStyle: 'italic',
                color: 'var(--cream)',
                padding: '8px 0',
                letterSpacing: '-0.02em',
                opacity: 0,
                animation: `fadeUp 600ms var(--ease-luxury) ${100 + i * 80}ms both`,
              }}
            >
              {l.label}
            </a>
          ))}
          <span
            style={{
              fontFamily: 'var(--mono)', fontSize: 10,
              letterSpacing: '0.1em', color: 'var(--cream-50)',
              marginTop: 32, opacity: 0,
              animation: `fadeUp 600ms var(--ease-luxury) ${100 + LINKS.length * 80}ms both`,
            }}
          >
            STUSH — FROM ATLANTA
          </span>
        </div>
      )}
    </>
  );
}
