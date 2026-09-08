'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import { BrainCircuit, Database, Network, Workflow, Search, ShieldCheck, AudioLines, ScanText, ArrowUpRight, ArrowDown } from 'lucide-react';

const features = [
 { name: 'Reasoning', icon: BrainCircuit, detail: 'Connect models to the context behind your decisions.' },
 { name: 'Knowledge', icon: Database, detail: 'Bring approved data and documents into one useful system.' },
 { name: 'Agents', icon: Network, detail: 'Coordinate tools and actions with clear human oversight.' },
 { name: 'Automation', icon: Workflow, detail: 'Turn repetitive handoffs into dependable workflows.' },
 { name: 'Retrieval', icon: Search, detail: 'Find relevant answers with sources your team can trace.' },
 { name: 'Evaluation', icon: ShieldCheck, detail: 'Measure quality and reliability against real tasks.' },
 { name: 'Voice AI', icon: AudioLines, detail: 'Build responsive conversational interfaces for your users.' },
 { name: 'Documents', icon: ScanText, detail: 'Extract useful information from complex documents.' },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const ease = (p: number) => { const t = clamp(p); return t * t * (3 - 2 * t); };

function FeatureCard({ index, progress, width, height, onSelect, selected, still }: { index: number; progress: MotionValue<number>; width: number; height: number; onSelect: () => void; selected: boolean; still: boolean }) {
 const feature = features[index], Icon = feature.icon;
 const pose = useTransform(progress, p => {
  const mobile = width < 700, radius = Math.min(width * .32, height * (mobile ? .23 : .38), 255);
  const angle = index / features.length * Math.PI * 2 - Math.PI / 2;
  const circle = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, r: 0 };
  const line = { x: (index - 3.5) * Math.min(width / 9, 125), y: 0, r: 0 };
  const scatter = { x: (index % 4 - 1.5) * Math.min(width / 4.8, 220), y: (Math.floor(index / 4) - .5) * (mobile ? 120 : 190), r: (index % 3 - 1) * 16 };
  const a = (-158 + index * 136 / 7) * Math.PI / 180;
  const arc = { x: Math.cos(a) * Math.min(width * .40, 490), y: Math.sin(a) * (mobile ? 140 : 190) + height * .29, r: (index - 3.5) * 5 };
  const first = ease(p / .2), orbit = ease((p - .2) / .3), open = ease((p - .58) / .3);
  return { x: mix(mix(mix(scatter.x, line.x, first), circle.x, orbit), arc.x, open), y: mix(mix(mix(scatter.y, line.y, first), circle.y, orbit), arc.y, open), r: mix(mix(scatter.r, 0, first), arc.r, open) };
 });
 const x = useTransform(pose, v => v.x), y = useTransform(pose, v => v.y), rotate = useTransform(pose, v => v.r);
 return <motion.div className="ai-morph-position" style={{ ...(still ? {} : { x, y, rotate }), zIndex: selected ? 6 : 2 }}>
  <button type="button" className="ai-morph-card" aria-pressed={selected} onClick={onSelect} aria-label={`Explore ${feature.name}`}>
   <span className="ai-card-number">E / 0{index + 1}</span><Icon strokeWidth={1.2} aria-hidden="true"/><span className="ai-card-name">{feature.name}</span><span className="ai-card-plus" aria-hidden="true">+</span>
  </button>
 </motion.div>;
}

export default function ScrollMorphHero({ paused = false, contact }: { paused?: boolean; contact: string }) {
 const ref = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
 const [size, setSize] = useState({ width: 1000, height: 800 });
 const [selected, setSelected] = useState(0), [visible, setVisible] = useState(false);
 const reduced = useReducedMotion(), still = paused || !!reduced;
 const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
 const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 24, mass: .7 });
 const centerOpacity = useTransform(progress, [.25, .45, .58, .72], [0, 1, 1, 0]);
 useEffect(() => { const el = stage.current; if (!el) return; const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height })); observer.observe(el); return () => observer.disconnect(); }, []);
 useEffect(() => { const el = ref.current; if (!el) return; const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting)); observer.observe(el); return () => observer.disconnect(); }, []);
 return <section id="experience" ref={ref} className={`ai-morph-section ${still ? 'ai-morph-still' : ''}`} aria-labelledby="ai-morph-title">
  <div ref={stage} className={`ai-morph-stage ${visible && !still ? 'ai-morph-live' : ''}`}>
   <div className="ai-morph-heading"><p className="eyebrow">EIGI / CONNECTED INTELLIGENCE</p><h2 id="ai-morph-title">Ideas deserve<br/>another dimension.</h2><p>From individual capabilities to a system built around your business.</p></div>
   <div className="ai-morph-field" aria-label="Explore our AI capabilities">{features.map((feature, index) => <FeatureCard key={feature.name} index={index} progress={progress} width={size.width < 800 ? size.width : size.width * .65} height={size.height * (size.width < 800 ? .34 : .59)} selected={index === selected} onSelect={() => setSelected(index)} still={still}/>)}</div>
   {!still && <motion.div className="ai-morph-center" style={{ opacity: centerOpacity }} aria-hidden="true"><span>eigi.ai</span><small>INTELLIGENCE, CONNECTED.</small></motion.div>}
   <div className="ai-morph-detail" aria-live="polite"><span className="eyebrow">0{selected + 1} / AI CAPABILITY</span><h3>{features[selected].name}</h3><p>{features[selected].detail}</p><a href={contact}>LET’S BUILD WHAT’S NEXT <ArrowUpRight size={17}/></a></div>
   <div className="ai-morph-bottom"><span>{still ? 'SELECT A CAPABILITY TO EXPLORE' : 'SCROLL TO CONNECT THE POSSIBILITIES'}</span><ArrowDown size={17}/></div>
  </div>
 </section>;
}
