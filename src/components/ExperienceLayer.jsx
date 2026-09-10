'use client';
import { useEffect, useState } from 'react';

export default function ExperienceLayer(){
 const[chapter,setChapter]=useState('01');
 useEffect(()=>{
  const root=document.documentElement;
  const cursor=document.querySelector('.stush-cursor');
  root.classList.add('stush-motion-ready');

  // Reveal individual content elements only. Never hide full commerce sections.
  const targets=[...document.querySelectorAll('.stush-product-card,.campaign-card,.lookbook-card,.journal-card,figure,[data-stush-reveal]')];
  targets.forEach((el,i)=>{el.classList.add('stush-reveal');el.style.setProperty('--stush-delay',`${(i%5)*45}ms`)});
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -4% 0px'});
  targets.forEach(el=>io.observe(el));

  const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const p=Math.min(1,scrollY/max);root.style.setProperty('--stush-scroll',String(p));setChapter(String(Math.max(1,Math.min(9,Math.ceil(p*9)))).padStart(2,'0'))};
  const onPointer=e=>{
   root.style.setProperty('--stush-x',`${e.clientX}px`);
   root.style.setProperty('--stush-y',`${e.clientY}px`);
   if(!cursor)return;
   const action=e.target.closest?.('a,button,[role="button"],[data-cursor]');
   const viewTarget=e.target.closest?.('[data-cursor="view"],.stush-product-card,.campaign-card,.lookbook-card,.journal-card');
   cursor.classList.toggle('is-interactive',Boolean(action));
   cursor.classList.toggle('is-view',Boolean(viewTarget));
   cursor.textContent=viewTarget?'VIEW':'';
  };
  const onPointerLeave=()=>{cursor?.classList.remove('is-interactive','is-view')};
  const onClick=e=>{const a=e.target.closest?.('a');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.hash||u.pathname===location.pathname)return;e.preventDefault();root.classList.add('stush-leaving');setTimeout(()=>location.href=u.href,220)};

  onScroll();
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('pointermove',onPointer,{passive:true});
  addEventListener('pointerleave',onPointerLeave);
  document.addEventListener('click',onClick);
  return()=>{io.disconnect();removeEventListener('scroll',onScroll);removeEventListener('pointermove',onPointer);removeEventListener('pointerleave',onPointerLeave);document.removeEventListener('click',onClick);root.classList.remove('stush-motion-ready','stush-leaving')}
 },[]);
 return <><div className="stush-veil" aria-hidden="true"><span>STUSH</span><em>DRESSED FOR THE NEXT ROOM</em></div><div className="stush-seam" aria-hidden="true"><b>{chapter}</b><i/></div><div className="stush-cursor" aria-hidden="true"/></>
}
