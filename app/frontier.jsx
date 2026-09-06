'use client';
import { useEffect, useRef, useState } from 'react';
export default function Frontier({paused=false,motion,assembled=false,variant='landscape',discipline=0}){
 const host=useRef(null),options=useRef({paused,motion,assembled,discipline}),[failed,setFailed]=useState(false);
 useEffect(()=>{options.current={paused,motion,assembled,discipline};},[paused,motion,assembled,discipline]);
 useEffect(()=>{let done=false,started=false,cleanup;const el=host.current;
  const observer=new IntersectionObserver(async entries=>{if(!entries[0].isIntersecting||started)return;started=true;observer.disconnect();
   try{const {createFrontier}=await import('./frontier-scene');if(done)return;cleanup=await createFrontier(el,()=>options.current,variant);if(done)cleanup();}
   catch(error){console.error('Frontier scene unavailable',error);if(!done)setFailed(true);}
  },{rootMargin:'600px'});observer.observe(el);return()=>{done=true;observer.disconnect();cleanup?.();};
 },[variant]);
 return <div className={`frontier-canvas frontier-${variant}`} ref={host} aria-hidden="true">{failed&&<span className="frontier-fallback">Human ingenuity.<br/>Infinite possibility.</span>}</div>;
}
