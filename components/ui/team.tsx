'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Pause, Play, UsersRound } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';

// Template portraits illustrate disciplines until verified team profiles are supplied.
const disciplines = [
  { image: 'https://cdn.21st.dev/assets/mirror/f4/f43137dada970ee6a29a0497d1f699d54b92e5381350eaa66dc827e3ffb11645.jpg', name: 'Product strategy', role: 'From the right question to a clear direction' },
  { image: 'https://cdn.21st.dev/assets/mirror/d5/d549c11c16ad2335895c39339d1a4307b648b24a6baae68662246cf9bd37ac13.jpg', name: 'Experience design', role: 'Interfaces shaped around real people' },
  { image: 'https://cdn.21st.dev/assets/mirror/e0/e058437411e954b747056a494f26349751828f12c2137a883e5aebbd1fcf5eef.jpg', name: 'Systems engineering', role: 'Connected tools. Thoughtful architecture.' },
  { image: 'https://cdn.21st.dev/assets/mirror/45/45ba21cbafae178989cd3652799f42123a80e0ac44065ac00cbb265ea948bc41.jpg', name: 'AI engineering', role: 'Intelligence, context, and evaluation' },
  { image: 'https://cdn.21st.dev/assets/mirror/90/904d97602d25b1b5ef0f4058abad6d8185d8cebd0750771404a934a44dd537fb.jpg', name: 'Eigi_ai research', role: 'Explore possibilities. Test assumptions.' },
  { image: 'https://cdn.21st.dev/assets/mirror/3b/3b6a929c98b85177bcc2eb4606a71b7487011128756dbf0adda24e803ca70ed7.jpg', name: 'Delivery engineering', role: 'From working prototype to daily use' },
];

function DisciplineCard({ item, index }: { item: typeof disciplines[number]; index: number }) {
  const [failed, setFailed] = useState(false);
  return <article className="eigi-team-card" tabIndex={0} aria-label={`${item.name}. ${item.role}. Illustrative portrait.`}>
    <div className="eigi-team-portrait">
      {failed ? <div className="eigi-portrait-fallback" aria-hidden="true"><UsersRound size={64}/></div> :
        <img src={item.image} alt="" width={256} height={368} loading="lazy" decoding="async" onError={() => setFailed(true)}/>}
      <span className="eigi-portrait-label">ILLUSTRATIVE PORTRAIT / 0{index + 1}</span>
      <div className="eigi-team-caption"><h3>{item.name}</h3><p>{item.role}</p></div>
    </div>
  </article>;
}

export default function EigiTeam({ paused = false }: { paused?: boolean }) {
  const reduced = useReducedMotion();
  const [localPaused, setLocalPaused] = useState(true);
  return <section id="eigi-team" className="eigi-team-section" aria-labelledby="eigi-team-heading">
    <svg className="eigi-team-scribble" aria-hidden="true" fill="none" viewBox="0 0 460 154">
      <path d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"/>
    </svg>
    <motion.div className="eigi-team-heading" initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8, ease: [.16, 1, .3, 1] }}>
      <div className="eigi-team-icon" aria-hidden="true"><UsersRound size={25} strokeWidth={1.7}/></div>
      <p className="eyebrow">HUMAN INGENUITY. SHARED AMBITION.</p>
      <h2 id="eigi-team-heading">Creative <span>Eigi_ai<svg aria-hidden="true" viewBox="0 0 240 24" fill="none"><path d="M4 16C62 4 157 2 235 10M29 22C91 12 166 13 211 17" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg></span> minds.</h2>
      <p className="eigi-team-description">Eigi_ai brings engineering, design, and research together to turn ambitious ideas into useful systems—with clear communication throughout.</p>
      <p className="eigi-team-disclosure">Meet the disciplines behind the work. Portraits are illustrative, not staff profiles.</p>
    </motion.div>
    <div className="eigi-team-gallery">
      <div className="eigi-team-gallery-top"><span>THE DISCIPLINES / 06</span><button className="eigi-team-motion" type="button" disabled={paused} aria-pressed={paused || localPaused} aria-label={paused ? 'Portrait motion paused globally' : localPaused ? 'Resume portrait motion' : 'Pause portrait motion'} onClick={() => setLocalPaused(value => !value)}>{paused || localPaused ? <Play size={13}/> : <Pause size={13}/>}<span>{paused ? 'PAUSED' : localPaused ? 'RESUME' : 'PAUSE'}</span></button></div>
      <Marquee paused={paused || localPaused || !!reduced} pauseOnHover>{disciplines.map((item, index) => <DisciplineCard key={item.name} item={item} index={index}/>)}</Marquee>
    </div>
    <motion.div className="eigi-team-statement" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }}>
      <span className="eigi-statement-mark" aria-hidden="true">✳</span>
      <p>Great work starts with listening.<br/>At Eigi_ai, we build with your team—from the first conversation to the final handover.</p>
      <span className="eigi-statement-credit">THE EIGI_AI APPROACH</span>
      <a href="mailto:pawanpatil2305@gmail.com?subject=Let%E2%80%99s%20build%20with%20Eigi_ai" className="pill dark">LET’S BUILD TOGETHER <ArrowUpRight size={17}/></a>
    </motion.div>
  </section>;
}
