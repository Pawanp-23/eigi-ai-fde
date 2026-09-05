'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, Plus, Pause, Play, X, MoveUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Sculpture from './sculpture';
const contact='mailto:pawanpatil2305@gmail.com?subject=Let%E2%80%99s%20build%20with%20eigi_ai';
const capabilities=[
 {id:'01',title:'Knowledge, connected.',category:'ENTERPRISE AI / KNOWLEDGE SYSTEMS',variant:'network',label:'Connected knowledge system',description:'Turn scattered information into answers your team can trace and trust.',detail:'A connected knowledge layer across your documents and business tools. Retrieve relevant context, respect access permissions, and give your team answers with sources.',steps:['Connect approved sources','Retrieve permission-aware context','Generate a grounded answer','Evaluate quality with your team']},
 {id:'02',title:'Operations, reimagined.',category:'INTELLIGENT WORKFLOWS / AUTOMATION',variant:'stack',label:'Workflow orchestration system',description:'Move from manual handoffs to thoughtful, integrated automation.',detail:'A workflow that connects incoming information to the next useful action. Combine structured extraction, business rules, and human approval before updating your systems.',steps:['Understand incoming information','Apply your business rules','Route exceptions for review','Take action in your tools']}
];
export default function Home(){
 const [menu,setMenu]=useState(false),[assembled,setAssembled]=useState(false),[paused,setPaused]=useState(false),[selected,setSelected]=useState<number|null>(null);
 useEffect(()=>{
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setPaused(motion.matches);sync();motion.addEventListener('change',sync);
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.1});
  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
  return()=>{observer.disconnect();motion.removeEventListener('change',sync);};
 },[]);
 return <main id="top">
  <a href="#approach" className="skip-link">Skip to content</a>
  <header className="site-header">
   <a href="#top" className="wordmark" aria-label="eigi ai home">eigi_ai<span>✳</span></a>
   <p className="header-manifesto">We turn complex problems into<br className="desktop-break"/> intelligent systems that work<br className="desktop-break"/> in the real world.</p>
   <nav className="header-actions" aria-label="Main navigation">
    <button className="motion-control" onClick={()=>setPaused(!paused)} aria-label={paused?'Play animations':'Pause animations'} aria-pressed={paused}>{paused?<Play size={15}/>:<Pause size={15}/>}</button>
    <a className="pill dark" href={contact}>LET’S TALK <ArrowUpRight size={16}/></a>
    <button className="pill menu-button" onClick={()=>setMenu(true)}>MENU <span className="menu-dots">••</span></button>
   </nav>
  </header>
  <section className={`hero-scene ${assembled?'assembled':''}`} aria-label="Interactive 3D introduction">
   <Sculpture assembled={assembled} paused={paused}/>
   <div className="hero-shade"/>
   <p className="scene-eyebrow"><span className="status-dot"/> FORWARD DEPLOYED ENGINEERING</p>
   <h1>Intelligence,<br/><em>deployed.</em></h1>
   <div className="hero-bottom"><p>Your ambition.<br/>Our engineers. One team.</p><button className="assemble-button" onClick={()=>setAssembled(!assembled)} aria-pressed={assembled}>{assembled?'EXPLODE THE SYSTEM':'ASSEMBLE THE SYSTEM'}<Plus size={18} className={assembled?'rotated':''}/></button></div>
   <span className="scene-index" aria-live="polite">{assembled?'02 — CONNECTED':'01 — POSSIBILITIES'}</span>
  </section>
  <a href="#approach" className="section-rule" aria-label="Scroll to our approach"><Plus size={19}/><span>SCROLL TO EXPLORE <ArrowDown size={12}/></span><Plus size={19}/><span className="rule-end">ENGINEERING × INTELLIGENCE</span><Plus size={19}/></a>
  <section id="approach" className="intro section-pad">
   <div className="intro-top" data-reveal><p className="eyebrow">01 / THE EIGI APPROACH</p><span className="little-mark">[ e / ai ]</span></div>
   <h2 data-reveal>Great AI belongs<br/>in the <span className="blue-text">real world.</span><span className="heading-dot">✳</span></h2>
   <div className="intro-bottom" data-reveal><p className="intro-aside">CLOSE TO THE PROBLEM.<br/>COMMITTED TO THE OUTCOME.</p><div><p className="intro-copy">We go where the work happens. Embedded with your team, we connect your data, tools, and ideas to build AI that moves your business forward.</p><a className="text-link" href="#method">Meet your engineering partners <ArrowUpRight size={20}/></a></div></div>
  </section>
  <section id="capabilities" className="capabilities section-pad">
   <div className="section-heading" data-reveal><h2>Built for<br/>what’s next.</h2><p>A LOOK AT WHAT WE CAN BUILD TOGETHER.<br/><span>Illustrative systems. Real possibilities.</span></p></div>
   <div className="capability-grid">
    {capabilities.map((item,i)=><button key={item.id} className={`capability-card card-${i}`} onClick={()=>setSelected(i)} aria-label={`Explore ${item.label}`} data-reveal>
     <div className="capability-visual"><Sculpture variant={item.variant} paused={paused}/><span className="card-index">EIGI / {item.id}</span><span className="card-tag">CAPABILITY CONCEPT</span><span className="card-open"><ArrowUpRight size={23}/></span><span className="diagram-label">{i===0?'CONTEXT → CLARITY':'INPUT → OUTCOME'}</span></div>
     <div className="card-caption"><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div>
    </button>)}
   </div>
  </section>
  <section id="method" className="method section-pad">
   <div className="method-heading" data-reveal><p className="eyebrow">02 / FORWARD, TOGETHER</p><h2>Your team.<br/>Extended.</h2><p>From the first hard question to the system your team uses every day. We work alongside you through the whole journey.</p><a className="pill light" href={contact}>BUILD WITH US <ArrowUpRight size={17}/></a></div>
   <div className="method-steps">
    {[['01','Embed.','Get close to the work.','We join your team to understand your workflows, constraints, and what a useful result looks like.'],['02','Engineer.','Build around your reality.','We connect the right models, data, and tools. Prototype with your people, then test against real tasks.'],['03','Deploy.','Make it work, every day.','We take the system into production with evaluation, monitoring, and a clear plan for ownership.']].map(([n,title,sub,copy])=><article className="method-step" key={n} data-reveal><span className="step-number">{n}</span><div><h3>{title}</h3><h4>{sub}</h4><p>{copy}</p></div><MoveUpRight size={25}/></article>)}
   </div>
  </section>
  <section className="statement" aria-label="Engineering philosophy"><div className="statement-inner" data-reveal><p className="eyebrow">THE DISTANCE BETWEEN AN IDEA AND IMPACT</p><h2>Let’s make<br/>it <span>happen.</span><ArrowUpRight className="statement-arrow" strokeWidth={1}/></h2><a className="pill light" href={contact}>START A CONVERSATION <ArrowUpRight size={17}/></a></div><div className="statement-coordinates"><span>THINK DEEPLY.</span><span>BUILD PURPOSEFULLY.</span><span>DEPLOY CONFIDENTLY.</span></div></section>
  <footer id="contact" className="footer"><div className="footer-top"><a href="#top" className="wordmark">eigi_ai<span>✳</span></a><div><p>HAVE A CHALLENGE IN MIND?</p><a className="email-link" href={contact}>pawanpatil2305@gmail.com <ArrowUpRight size={20}/></a></div><a className="back-top" href="#top" aria-label="Back to top"><ArrowDown size={22}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} eigi_ai</span><span>FORWARD DEPLOYED ENGINEERING</span><span>HUMAN INGENUITY. INTELLIGENT SYSTEMS.</span></div></footer>
  <Sheet open={menu} onOpenChange={setMenu}><SheetContent className="navigation-sheet" showCloseButton={false}><div className="sheet-top"><SheetTitle className="wordmark">eigi_ai</SheetTitle><button className="pill" onClick={()=>setMenu(false)}>CLOSE <X size={18}/></button></div><SheetDescription className="sr-only">Explore eigi_ai forward deployed engineering.</SheetDescription><nav aria-label="Expanded navigation">{[['01','Home','#top'],['02','Our approach','#approach'],['03','Capabilities','#capabilities'],['04','How we work','#method']].map(([n,label,href])=><a href={href} key={n} onClick={()=>setMenu(false)}><span>{n}</span>{label}<ArrowUpRight/></a>)}</nav><a className="sheet-email" href={contact}>Let’s build something useful.<ArrowUpRight/></a></SheetContent></Sheet>
  <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="concept-dialog">{selected!==null&&<><p className="eyebrow">EIGI / {capabilities[selected].id} — CAPABILITY CONCEPT</p><DialogTitle className="concept-title">{capabilities[selected].title}</DialogTitle><DialogDescription className="concept-description">{capabilities[selected].detail}</DialogDescription><ol className="concept-flow">{capabilities[selected].steps.map((step,i)=><li key={step}><span>0{i+1}</span>{step}<ArrowDown size={16}/></li>)}</ol><p className="concept-note">An illustrative architecture, tailored to your workflow during discovery.</p><a className="pill dark" href={contact}>DISCUSS YOUR USE CASE <ArrowUpRight size={17}/></a></>}</DialogContent></Dialog>
 </main>;
}

