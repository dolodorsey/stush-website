'use client';
import { useEffect } from 'react';

export default function NavScroll() {
  useEffect(() => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const handler = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return null;
}
