'use client';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

function RevealWord({word,index,count,progress,still}){
 const start=index/(count+3),end=(index+4)/(count+3);
 const opacity=useTransform(progress,[start,end],[.18,1]);
 const y=useTransform(progress,[start,end],['22%','0%']);
 return <span className="scroll-word-window" aria-hidden="true"><motion.span style={still?{opacity:1,y:0}:{opacity,y}}>{word}</motion.span>{' '}</span>;
}
export function ScrollWords({text,paused=false}){
 const ref=useRef(null),reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 95%','start 52%']});
 const progress=useSpring(scrollYProgress,{stiffness:110,damping:30,mass:.6});
 const words=text.split(' ');
 return <span ref={ref} className="scroll-words" aria-label={text}>{words.map((word,index)=><RevealWord key={index} word={word} index={index} count={words.length} progress={progress} still={paused||reduced}/>)}</span>;
}

function FollowingLine({d,progress,index,still,extended}){
 const path=useRef(null),length=useRef(0),cx=useMotionValue(0),cy=useMotionValue(0);
 const drawn=useTransform(progress,extended?[.04,.8]:[.005+index*.015,.15+index*.015],[0,1]);
 const sync=p=>{if(!path.current)return;const point=path.current.getPointAtLength(p*length.current);cx.set(point.x);cy.set(point.y);};
 useEffect(()=>{if(path.current){length.current=path.current.getTotalLength();sync(drawn.get());}},[]);
 useMotionValueEvent(drawn,'change',sync);
 return <g className={`scroll-ribbon scroll-ribbon-${index}`}>
  <path d={d} className="ribbon-guide"/>
  <motion.path ref={path} d={d} style={still?{pathLength:1}:{pathLength:drawn}}/>
  {!still&&<motion.circle r="6" style={{cx,cy,opacity:drawn}}/>}
 </g>;
}
export function ScrollRibbons({progress,paused=false,extended=false}){
 const reduced=useReducedMotion();
 return <svg className="scroll-ribbons" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
  <FollowingLine d="M -60 130 C 300 210 440 240 735 125 S 1230 -70 1300 260 S 1310 620 1500 635" progress={progress} index={0} extended={extended} still={paused||reduced}/>
  <FollowingLine d="M -60 335 C 260 440 520 470 825 325 S 1230 120 1275 420 S 1330 690 1500 620" progress={progress} index={1} extended={extended} still={paused||reduced}/>
 </svg>;
}
