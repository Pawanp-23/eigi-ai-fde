 'use client';
import { useEffect, useRef, useState } from 'react';
export default function HeroVideo({paused}:{paused:boolean}){
 const stage=useRef<HTMLDivElement>(null),film=useRef<HTMLVideoElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const video=film.current,host=stage.current;if(!video||!host)return;
  let visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{video.muted=true;if(visible&&!paused&&!reduced.matches&&!document.hidden)video.play().catch(()=>{});else video.pause();};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);video.addEventListener('canplay',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);video.removeEventListener('canplay',sync);video.pause();};
 },[paused]);
 return <div ref={stage} className="hero-films" aria-hidden="true"><video ref={film} className="hero-film" src="/media/bcg-hero-4k60.mp4" poster="/media/bcg-hero-poster.jpg" muted loop playsInline preload="auto" onError={()=>setFailed(true)}/>{failed&&<div className="hero-film-fallback"/>}</div>;
}
