'use client';
import { useEffect } from 'react';
export function usePageMotion(motion,paused,variant){
 useEffect(()=>{
  const root=document.querySelector('main'),story=document.querySelector('.scroll-story');
  if(!root)return;
  const chapters=[...document.querySelectorAll('.story-chapter')],markers=[...document.querySelectorAll('.story-marker')];
  const letters=chapters.map(el=>[...el.querySelectorAll('.hero-char')]);
  const supporting=chapters.map(el=>[...el.querySelectorAll('.chapter-label,.hero-support')]);
  const moving=[...document.querySelectorAll('[data-scroll-shift]')],steps=[...document.querySelectorAll('.method-step')],scrub=[...document.querySelectorAll('[data-scrub-words]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let target=0,current=0,raf=0,last=performance.now(),dirty=true,openingFinished=false;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{const p=clamp(x);return p*p*(3-2*p);};
  const started=performance.now();
  const measure=()=>{
   root.classList.toggle('hero-static',paused||reduced.matches);
   if(story){const rect=story.getBoundingClientRect();target=clamp(-rect.top/Math.max(1,story.offsetHeight-innerHeight));}dirty=true;
   root.style.setProperty('--page-progress',String(clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))));
   root.classList.toggle('has-scrolled',scrollY>130);
  };
  const render=now=>{
   const dt=Math.min((now-last)/1000,.05);last=now;const still=reduced.matches;
   const staticHero=paused||still,opening=clamp((now-started)/950);
   current=still?0:current+(target-current)*(1-Math.exp(-dt*10));
   if(dirty||Math.abs(current-target)>.00005||!openingFinished){
    openingFinished=opening===1;
    motion.current.progress=current;
    story?.style.setProperty('--story-progress',String(current));
    // Non-overlapping exit/entry windows leave time to read each complete phrase.
    const range=[[0,.16,.23],[.23,.43,.50],[.50,.70,.77],[.77,1.1,1.2]];
    chapters.forEach((el,i)=>{
     const [start,exitStart,end]=range[i];
     const enter=i===0?opening:clamp((current-start)/.09),exit=clamp((current-exitStart)/(end-exitStart));
     el.style.visibility=staticHero||(enter>0&&exit<1)?'visible':'hidden';
     letters[i].forEach((char,j)=>{
      const delay=j/Math.max(1,letters[i].length-1)*.55;
      const reveal=staticHero?1:ease((enter-delay)/.45),leave=staticHero?0:ease((exit-delay)/.45);
      char.style.opacity=String(reveal*(1-leave));
      char.style.transform=`translate3d(0,${((1-reveal)*35-leave*20).toFixed(2)}%,0)`;
     });
     supporting[i].forEach(node=>{node.style.opacity=String(staticHero?1:ease(enter)*(1-ease(exit)));});
    });
    markers.forEach((el,i)=>el.classList.toggle('active',i===(current<.23?0:current<.5?1:current<.77?2:3)));
    moving.forEach(el=>{const r=el.getBoundingClientRect();const amount=Number(el.getAttribute('data-scroll-shift')||25);el.style.setProperty('--scroll-shift',`${still?0:(clamp((innerHeight-r.top)/(innerHeight+r.height))-.5)*amount}px`);});
    steps.forEach(el=>{const r=el.getBoundingClientRect();el.style.setProperty('--step-progress',String(still?1:clamp((innerHeight*.85-r.top)/(innerHeight*.65))));});
    const intro=document.querySelector('.intro');if(intro){const r=intro.getBoundingClientRect();intro.style.setProperty('--read-progress',`${still?100:clamp((innerHeight-r.top)/(innerHeight*.9))*100}%`);}
    scrub.forEach(el=>{const r=el.getBoundingClientRect(),p=still?1:clamp((innerHeight*.88-r.top)/(innerHeight*.55));[...el.children].forEach((word,i)=>word.style.opacity=String(.22+.78*clamp(p*(el.children.length+5)-i)));});
    dirty=false;
   }
   raf=requestAnimationFrame(render);
  };
  root.classList.toggle('motion-paused',paused);measure();current=target;raf=requestAnimationFrame(render);
  window.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);reduced.addEventListener('change',measure);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',measure);window.removeEventListener('resize',measure);reduced.removeEventListener('change',measure);};
 },[motion,paused,variant]);
}
