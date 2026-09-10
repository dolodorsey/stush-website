'use client';
import { useEffect } from 'react';

export default function ExperienceLayer() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('stush-motion-ready');

    // Reveal individual content elements only. Never hide full commerce sections.
    const targets = [...document.querySelectorAll('.stush-product-card,.campaign-card,.lookbook-card,.journal-card,figure,[data-stush-reveal]')];
    targets.forEach((el, index) => {
      el.classList.add('stush-reveal');
      el.style.setProperty('--stush-delay', `${(index % 5) * 45}ms`);
    });
    const io = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0, rootMargin: '0px 0px -4% 0px' }
    );
    targets.forEach(el => io.observe(el));

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      root.style.setProperty('--stush-scroll', String(Math.min(1, scrollY / max)));
    };
    const onClick = event => {
      const anchor = event.target.closest?.('a');
      if (!anchor || anchor.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(anchor.href, location.href);
      if (target.origin !== location.origin || target.hash || target.pathname === location.pathname) return;
      event.preventDefault();
      root.classList.add('stush-leaving');
      setTimeout(() => { location.href = target.href; }, 220);
    };

    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick);

    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
      root.classList.remove('stush-motion-ready', 'stush-leaving');
    };
  }, []);

  return (
    <div className="stush-veil" aria-hidden="true">
      <span>STUSH</span>
      <em>DRESSED FOR THE NEXT ROOM</em>
    </div>
  );
}
