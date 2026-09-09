'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useTransform,
} from 'motion/react';
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Frontier from '../FrontierSection';
import { ScrollWords, ScrollRibbons } from '@/components/common/ScrollDetail';

export function KineticText({ text, className = '' }) {
  const reduced = useReducedMotion(),
    ref = useRef(null),
    visible = useInView(ref, { once: true, amount: 0.05 });

  return (
    <span
      ref={ref}
      className={`kinetic-text ${className}`}
    >
      {text.split(' ').map((word, i) => (
        <span
          className="word-window"
          key={i}
        >
          <motion.span
            initial={reduced ? false : { y: '35%', rotate: 0 }}
            animate={
              visible || reduced
                ? { y: '0%', rotate: 0 }
                : { y: '35%', rotate: 0 }
            }
            transition={{
              duration: 0.85,
              delay: i * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>{' '}
        </span>
      ))}
    </span>
  );
}

const disciplines = [
  {
    label: 'AI engineering',
    number: '01',
    title: 'Intelligence with intent.',
    copy: 'Models are one part of the system. Connect them to the right context, evaluate their behavior, and shape an experience people can trust.',
    tags: ['Retrieval & reasoning', 'Agentic workflows', 'Evaluation'],
  },
  {
    label: 'Systems architecture',
    number: '02',
    title: 'Complexity, connected.',
    copy: 'Bring data, tools, and infrastructure together. Design clear interfaces and reliable workflows that fit the way your organization operates.',
    tags: ['Data foundations', 'Integrations', 'Reliability'],
  },
  {
    label: 'Product engineering',
    number: '03',
    title: 'Built around people.',
    copy: 'Translate a hard problem into a useful product. Prototype with your team, learn from real use, and carry that understanding into production.',
    tags: ['Prototyping', 'User experience', 'Production delivery'],
  },
];

export function Collective({ paused }) {
  const [index, setIndex] = useState(0),
    reduced = useReducedMotion(),
    current = disciplines[index];
  const section = useRef(null),
    world = useRef({ progress: 0 });
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.6,
  });
  const drift = useTransform(progress, [0, 1], [12, -12]);
  useMotionValueEvent(progress, 'change', (p) => {
    world.current.progress = p;
  });

  return (
    <section
      ref={section}
      id="collective"
      className="collective"
      aria-label="Engineering disciplines"
    >
      <Frontier
        variant="hologram"
        paused={paused}
        discipline={index}
        motion={world}
      />
      <div className="collective-vignette" />
      <motion.div
        className="collective-top"
        style={paused || reduced ? { y: 0 } : { y: drift }}
      >
        <p className="eyebrow">THE MINDS BEHIND THE SYSTEM</p>
        <h2>
          <ScrollWords
            text="Human ingenuity."
            paused={paused}
          />
        </h2>
        <p className="collective-sub">
          MANY DISCIPLINES.
          <br />
          ONE SHARED DIRECTION.
        </p>
      </motion.div>
      <div
        className="crosshair-row"
        aria-hidden="true"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Plus
            key={i}
            size={17}
            strokeWidth={1}
          />
        ))}
      </div>
      <span className="hologram-label">
        DIGITAL EXPLORER / GENERATIVE STUDY
      </span>
      <div className="collective-bottom">
        <div className="discipline-picker">
          <span className="eyebrow">
            ENGINEERING DISCIPLINES / {current.number}
          </span>
          <h3>{current.label}</h3>
          <div className="discipline-controls">
            <button
              onClick={() => setIndex((index + 2) % 3)}
              aria-label="Previous discipline"
            >
              <ChevronLeft size={21} />
            </button>
            <button
              onClick={() => setIndex((index + 1) % 3)}
              aria-label="Next discipline"
            >
              <ArrowRight size={28} />
            </button>
          </div>
        </div>
        <div
          className="discipline-detail"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduced || paused ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced || paused ? 0 : -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3>{current.title}</h3>
              <p>
                <ScrollWords
                  text={current.copy}
                  paused={paused}
                />
              </p>
              <ul>
                {current.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const rows = [
  ['REASONING', 'RETRIEVAL', 'ORCHESTRATION', 'EVALUATION'],
  ['DATA SYSTEMS', 'HUMAN INSIGHT', 'RELIABLE DELIVERY', 'REAL IMPACT'],
];

export function CapabilityMarquee() {
  return (
    <section
      className="capability-marquee"
      aria-label="Our engineering focus"
    >
      <div className="marquee-heading">
        <h2>
          <KineticText text="Different skills. Shared ambition." />
        </h2>
        <p>WHAT WE BRING TO YOUR TEAM.</p>
      </div>
      {rows.map((row, i) => (
        <div
          className={`marquee-window marquee-${i}`}
          key={i}
        >
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div
                className="marquee-group"
                key={copy}
                aria-hidden={copy === 1}
              >
                {row.map((word) => (
                  <span key={word}>
                    {word}
                    <Plus
                      size={24}
                      strokeWidth={1}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

const expertise = [
  {
    title: 'Discover',
    mark: 'D',
    description: 'Find the problem worth solving.',
    items: [
      'Workflow discovery',
      'Opportunity mapping',
      'Success criteria',
      'Technical feasibility',
      'Delivery roadmap',
    ],
  },
  {
    title: 'Connect',
    mark: 'C',
    description: 'Give intelligence the right context.',
    items: [
      'Data integration',
      'Knowledge retrieval',
      'Access controls',
      'API orchestration',
      'Context design',
    ],
  },
  {
    title: 'Engineer',
    mark: 'E',
    description: 'Build the system around reality.',
    items: [
      'AI applications',
      'Agent workflows',
      'Product interfaces',
      'Evaluation pipelines',
      'Human oversight',
    ],
  },
  {
    title: 'Deploy',
    mark: '↗',
    description: 'Make it work beyond the prototype.',
    items: [
      'Production integration',
      'Observability',
      'Reliability testing',
      'Team enablement',
      'Continuous improvement',
    ],
  },
];

export function Expertise({ paused }) {
  const section = useRef(null),
    reduced = useReducedMotion(),
    [selected, setSelected] = useState(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  });
  const ribbonProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 24,
    mass: 0.8,
  });

  useEffect(() => {
    const el = section.current;

    if (!el) return;

    const cards = [...el.querySelectorAll('.expertise-position')];
    let frame = 0,
      progress = 0,
      target = 0,
      dirty = true,
      last = performance.now();

    const measure = () => {
      const r = el.getBoundingClientRect();
      target = Math.max(
        0,
        Math.min(1, -r.top / Math.max(1, el.offsetHeight - innerHeight)),
      );
      dirty = true;
    };

    const render = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      frame = requestAnimationFrame(render);

      if ((paused || reduced) && !dirty && Math.abs(target - progress) < 0.0001)
        return;

      progress += (target - progress) * (1 - Math.exp(-dt * 6));
      const p = reduced || paused ? 1 : progress,
        spread = Math.max(0, Math.min(1, (p - 0.12) / 0.55)),
        mobile = innerWidth < 700;
      cards.forEach((card, i) => {
        const offset = i - 1.5;
        const x = offset * (mobile ? 86 : innerWidth * 0.235) * spread,
          y =
            (mobile ? (i % 2) * 28 : Math.abs(offset) * 8) * spread +
            (paused || reduced
              ? 0
              : Math.sin(now * 0.0008 + i * 1.5) * 22 * spread);
        const rotate =
          offset * (1 - spread) * 4 +
          offset * 2 * spread +
          (paused || reduced ? 0 : Math.sin(now * 0.00065 + i) * 2.8 * spread);
        card.style.transform = `translate3d(${x}px,${y}px,${i * 0.5}px) rotate(${rotate}deg)`;
        card.style.setProperty(
          '--card-turn',
          `${180 * (1 - Math.max(0, Math.min(1, (p - 0.12 - i * 0.045) / 0.42)))}deg`,
        );
      });
      el.style.setProperty('--expertise-drift', `${(1 - spread) * 8}vw`);
      el.dataset.spread = spread.toFixed(2);
      dirty = false;
    };

    measure();
    frame = requestAnimationFrame(render);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [reduced, paused]);

  return (
    <section
      ref={section}
      id="expertise"
      className={`expertise ${reduced || paused ? 'expertise-still' : ''}`}
      aria-label="Areas of expertise"
    >
      <div className="expertise-sticky">
        <ScrollRibbons
          progress={ribbonProgress}
          paused={paused}
          extended
        />
        <div className="expertise-heading">
          <p className="eyebrow">FROM QUESTION TO PRODUCTION</p>
          <h2>
            <span>
              <KineticText text="Areas of" />
            </span>
            <span>
              <KineticText text="expertise." />
            </span>
          </h2>
          <p className="expertise-description">
            A complete engineering practice.
            <br />
            Built around the work you need to do.
          </p>
        </div>
        <div className="expertise-deck">
          {expertise.map((item, i) => (
            <div
              className={`expertise-position ${selected === i ? 'is-selected' : ''}`}
              key={item.title}
            >
              <button
                className="expertise-card"
                onClick={() => setSelected(selected === i ? null : i)}
                aria-pressed={selected === i}
                aria-label={`${item.title}: ${item.description}`}
              >
                <span className="card-face card-front">
                  <span className="expertise-card-top">
                    {item.title}
                    <b>{item.mark}</b>
                  </span>
                  <span className="expertise-card-description">
                    {item.description}
                  </span>
                  <span className="expertise-list">
                    {item.items.map((text) => (
                      <span key={text}>{text}</span>
                    ))}
                  </span>
                  <span className="expertise-card-bottom">
                    <b>{item.mark}</b>
                    {item.title}
                  </span>
                </span>
                <span
                  className="card-face card-back"
                  aria-hidden="true"
                >
                  <span className="card-back-border" />
                  <span className="card-back-corner">e / ai</span>
                  <span className="card-back-symbol">{item.mark}</span>
                  <span className="card-back-caption">
                    FORWARD DEPLOYED
                    <br />
                    ENGINEERING
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
        <p className="expertise-instruction">
          SCROLL TO REVEAL THE PRACTICE <span>↓</span>
        </p>
      </div>
    </section>
  );
}
