'use client';
import { useEffect, useState } from 'react';

export default function ExperienceLayer(){
 const[chapter,setChapter]=useState('01');
 useEffect(()=>{
  const root=document.documentElement;root.classList.add('stush-motion-ready');
  const targets=[...document.querySelectorAll('main section,.product-card,.campaign-card,.lookbook-card,figure')];
  targets.forEach((el,i)=>{el.classList.add('stush-reveal');el.style.setProperty('--stush-delay',`${(i%5)*55}ms`)});
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.1,rootMargin:'0px 0px -7% 0px'});targets.forEach(el=>io.observe(el));
  const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const p=Math.min(1,scrollY/max);root.style.setProperty('--stush-scroll',String(p));setChapter(String(Math.max(1,Math.min(9,Math.ceil(p*9)))).padStart(2,'0'))};
  const onPointer=e=>{root.style.setProperty('--stush-x',`${e.clientX}px`);root.style.setProperty('--stush-y',`${e.clientY}px`)};
  const onClick=e=>{const a=e.target.closest?.('a');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.hash||u.pathname===location.pathname)return;e.preventDefault();root.classList.add('stush-leaving');setTimeout(()=>location.href=u.href,320)};
  onScroll();addEventListener('scroll',onScroll,{passive:true});addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('click',onClick);
  return()=>{io.disconnect();removeEventListener('scroll',onScroll);removeEventListener('pointermove',onPointer);document.removeEventListener('click',onClick);root.classList.remove('stush-motion-ready','stush-leaving')}
 },[]);
 return <><div className="stush-veil" aria-hidden="true"><span>STUSH</span><em>DRESSED FOR THE NEXT ROOM</em></div><div className="stush-seam" aria-hidden="true"><b>{chapter}</b><i/></div><div className="stush-cursor" aria-hidden="true">VIEW</div></>
}
