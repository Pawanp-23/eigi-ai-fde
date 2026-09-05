'use client';
import { useEffect } from 'react';
export function usePageMotion(motion,paused){
 useEffect(()=>{
  const root=document.querySelector('main'),story=document.querySelector('.scroll-story');
  if(!root||!story)return;
  const chapters=[...document.querySelectorAll('.story-chapter')],markers=[...document.querySelectorAll('.story-marker')];
  const moving=[...document.querySelectorAll('[data-scroll-shift]')],steps=[...document.querySelectorAll('.method-step')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let target=0,current=0,raf=0,last=performance.now(),dirty=true;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const measure=()=>{
   const rect=story.getBoundingClientRect();target=clamp(-rect.top/Math.max(1,story.offsetHeight-innerHeight));dirty=true;
   root.style.setProperty('--page-progress',String(clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))));
   root.classList.toggle('has-scrolled',scrollY>130);
  };
  const render=now=>{
   const dt=Math.min((now-last)/1000,.05);last=now;const still=paused||reduced.matches;
   current=still?0:current+(target-current)*(1-Math.exp(-dt*10));
   if(dirty||Math.abs(current-target)>.00005){
    motion.current.progress=current;
    story.style.setProperty('--story-progress',String(current));
    const range=[[0,.16,.31],[.27,.44,.64],[.6,.83,1.2]];
    chapters.forEach((el,i)=>{
     const [start,peak,end]=range[i];const enter=i===0?1:clamp((current-start)/.12),exit=clamp((end-current)/.12);const opacity=still?(i===0?1:0):Math.min(enter,exit);
     el.style.opacity=String(opacity);el.style.transform=`translate3d(0,${still?0:(1-enter)*55-(1-exit)*45}px,0)`;
     el.style.visibility=opacity>.001?'visible':'hidden';
    });
    markers.forEach((el,i)=>el.classList.toggle('active',i===(current<.3?0:current<.65?1:2)));
    moving.forEach(el=>{const r=el.getBoundingClientRect();const amount=Number(el.getAttribute('data-scroll-shift')||25);el.style.setProperty('--scroll-shift',`${still?0:(clamp((innerHeight-r.top)/(innerHeight+r.height))-.5)*amount}px`);});
    steps.forEach(el=>{const r=el.getBoundingClientRect();el.style.setProperty('--step-progress',String(still?1:clamp((innerHeight*.85-r.top)/(innerHeight*.65))));});
    const intro=document.querySelector('.intro');if(intro){const r=intro.getBoundingClientRect();intro.style.setProperty('--read-progress',`${still?100:clamp((innerHeight-r.top)/(innerHeight*.9))*100}%`);}
    dirty=false;
   }
   raf=requestAnimationFrame(render);
  };
  root.classList.toggle('motion-paused',paused);measure();current=target;raf=requestAnimationFrame(render);
  window.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);reduced.addEventListener('change',measure);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',measure);window.removeEventListener('resize',measure);reduced.removeEventListener('change',measure);};
 },[motion,paused]);
}
