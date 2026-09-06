'use client';
import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { ScrollWords, ScrollRibbons } from './scroll-detail';

const chapters=[['Overview',0],['Orbit',.3],['Tunnel',.63],['Together',.94]];
export default function Expedition({paused,contact}){
 const section=useRef(null),host=useRef(null),state=useRef({progress:0,paused:false,reduced:false});
 const reduced=useReducedMotion(),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[chapter,setChapter]=useState(0);
 const {scrollYProgress}=useScroll({target:section,offset:['start start','end end']});
 const smoothProgress=useSpring(scrollYProgress,{stiffness:100,damping:30,mass:.6});
 const {scrollYProgress:arrival}=useScroll({target:section,offset:['start end','end start']});
 const smoothArrival=useSpring(arrival,{stiffness:100,damping:30,mass:.6});
 const ribbonOpacity=useTransform(smoothProgress,[.08,.20],[1,0]);
 const introOpacity=useMotionValue(1),introY=useMotionValue(0),orbitOpacity=useMotionValue(0),orbitY=useMotionValue(50),tunnelOpacity=useMotionValue(0),finaleOpacity=useMotionValue(0),finaleY=useMotionValue(60);
 const clamp=x=>Math.max(0,Math.min(1,x));
 useMotionValueEvent(smoothProgress,'change',p=>{
  state.current.progress=p;setChapter(p<.24?0:p<.42?1:p<.83?2:3);
  introOpacity.set(1-clamp((p-.08)/.1));introY.set(-80*clamp(p/.18));
  orbitOpacity.set(Math.min(clamp((p-.22)/.04),1-clamp((p-.34)/.08)));orbitY.set(50-100*clamp((p-.22)/.2));
  tunnelOpacity.set(Math.min(clamp((p-.45)/.04),1-clamp((p-.58)/.06)));
  finaleOpacity.set(clamp((p-.83)/.07));finaleY.set(60*(1-clamp((p-.83)/.17)));
 });
 useEffect(()=>{state.current.paused=paused;state.current.reduced=!!reduced;},[paused,reduced]);
 useEffect(()=>{
  let dispose,cancelled=false,started=false;
  const observer=new IntersectionObserver(async entries=>{
   if(!entries[0].isIntersecting||started)return;started=true;observer.disconnect();
   try{const {createExpedition}=await import('./expedition-scene');if(cancelled)return;dispose=await createExpedition(host.current,()=>state.current,()=>{if(!cancelled)setReady(true);});if(cancelled)dispose();}
   catch(error){console.error('Expedition could not initialize',error);if(!cancelled)setFailed(true);}
  },{rootMargin:'900px'});
  observer.observe(section.current);return()=>{cancelled=true;observer.disconnect();dispose?.();};
 },[]);
 function go(progress){const el=section.current;if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY+progress*(el.offsetHeight-window.innerHeight),behavior:paused||reduced?'instant':'smooth'});}
 return <MotionConfig reducedMotion="user"><section ref={section} id="experience" className={`expedition ${reduced?'expedition-reduced':''} ${failed?'expedition-failed':''}`} aria-label="A journey from possibility to production">
  <div className={`expedition-stage ${chapter>0&&!reduced?'expedition-dark':''}`}>
   <div ref={host} className="expedition-canvas" aria-hidden="true"/>
   <motion.div className="expedition-ribbon-wrap" style={reduced||failed?{}:{opacity:ribbonOpacity}}><ScrollRibbons progress={smoothArrival} paused={paused}/></motion.div>
   {!ready&&!failed&&<div className="expedition-loading" role="status">Preparing your next dimension<span>Loading the 3D experience</span></div>}
   <div className="expedition-top"><span>EIGI / BEYOND THE EXPECTED</span><a href="#contact">SKIP TO CONTACT <ArrowUpRight size={14}/></a></div>
   <motion.div className="expedition-editorial" style={reduced||failed?{}:{opacity:introOpacity,y:introY}} aria-hidden={chapter!==0&&!reduced}>
    <h2><ScrollWords text="Ideas deserve" paused={paused}/><br/><ScrollWords text="another dimension." paused={paused}/></h2>
    <div className="expedition-editorial-copy"><p><ScrollWords text="Big ideas need engineers who can take them somewhere real." paused={paused}/></p><p><ScrollWords text="We step into your world, connect the pieces, and build systems that take you further. From the first question to the next breakthrough." paused={paused}/></p><span>SCROLL TO STEP INSIDE <ArrowDown size={16}/></span></div>
   </motion.div>
   {!reduced&&!failed&&<>
    <motion.div className="expedition-orbit expedition-overlay" style={{opacity:orbitOpacity,y:orbitY}} aria-hidden={chapter!==1}><p>A DIFFERENT PERSPECTIVE</p><h2>GO WHERE<br/>YOUR AMBITION<br/>TAKES YOU.</h2></motion.div>
    <motion.div className="expedition-tunnel expedition-overlay" style={{opacity:tunnelOpacity}} aria-hidden={chapter!==2}><p>FORWARD IS THE ONLY DIRECTION.</p><h2>Through complexity.<br/>Into possibility.</h2></motion.div>
    <motion.div className="expedition-finale expedition-overlay" style={{opacity:finaleOpacity,y:finaleY,pointerEvents:chapter===3?'auto':'none'}} aria-hidden={chapter!==3}><p>YOUR NEXT CHAPTER STARTS HERE.</p><h2>Let’s build<br/>what’s next.</h2><a href={contact} className="expedition-cta" tabIndex={chapter===3?0:-1}>LET’S TALK <ArrowUpRight size={20}/></a></motion.div>
    <nav className="expedition-chapters" aria-label="3D experience chapters">{chapters.map(([label,p],i)=><button key={label} aria-current={chapter===i?'step':undefined} onClick={()=>go(p)}><span>0{i+1}</span>{label}</button>)}</nav>
    <div className="expedition-progress" aria-hidden="true"><motion.span style={{scaleX:smoothProgress}}/></div>
   </>}
   {(reduced||failed)&&<a href={contact} className="expedition-static-cta expedition-cta">LET’S BUILD TOGETHER <ArrowUpRight size={18}/></a>}
   {failed&&<p className="expedition-fallback">The 3D experience is unavailable on this device. Your next chapter still starts with a conversation.</p>}
  </div>
 </section></MotionConfig>;
}
