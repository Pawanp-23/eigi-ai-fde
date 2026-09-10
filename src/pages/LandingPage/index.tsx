'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  X,
  MoveUpRight,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Sculpture from './sections/SculptureSection';
import ScrollMorphHero from './sections/HeroSection/scroll-morph-hero';
import Frontier from './sections/FrontierSection';
import EigiTeam from './sections/TeamSection';
import {
  KineticText,
  Collective,
  CapabilityMarquee,
  Expertise,
} from './sections/StudioSections';
import { usePageMotion } from '@/hooks/usePageMotion';
import HeroPunchline from './sections/HeroSection/hero-punchline';
import HeroVideo from './sections/HeroSection/hero-video';
import EngineeringHero from './sections/HeroSection/engineering-hero';
import SignalHero from './sections/HeroSection/signal-hero';
import { ParallaxComponent } from './sections/ParallaxSection';

const contact =
  'mailto:buddy@eigi.ai?subject=Let%E2%80%99s%20build%20with%20eigi_ai';

const capabilities = [
  {
    id: '01',
    title: 'Enterprise knowledge copilot.',
    category: 'ENTERPRISE AI / KNOWLEDGE SYSTEMS',
    variant: 'network',
    label: 'Enterprise knowledge copilot project concept',
    description:
      'Turn scattered information into answers your team can trace and trust.',
    detail:
      'A connected knowledge layer across your documents and business tools. Retrieve relevant context, respect access permissions, and give your team answers with sources.',
    steps: [
      'Connect approved sources',
      'Retrieve permission-aware context',
      'Generate a grounded answer',
      'Evaluate quality with your team',
    ],
  },
  {
    id: '02',
    title: 'Intelligent document processing.',
    category: 'INTELLIGENT WORKFLOWS / AUTOMATION',
    variant: 'stack',
    label: 'Intelligent document processing project concept',
    description:
      'Extract, validate, and route documents with human approval built in.',
    detail:
      'A workflow that connects incoming information to the next useful action. Combine structured extraction, business rules, and human approval before updating your systems.',
    steps: [
      'Understand incoming information',
      'Apply your business rules',
      'Route exceptions for review',
      'Take action in your tools',
    ],
  },
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [assembled, setAssembled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [videoHero, setVideoHero] = useState(true);
  const [newHero, setNewHero] = useState(false);
  const [preview, setPreview] = useState(false);
  const [signalHero, setSignalHero] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');

    const sync = () => {
      let saved = null;

      try {
        saved = localStorage.getItem('eigi-theme');
      } catch {}

      const value = saved ? saved === 'dark' : media.matches;
      setDark(value);
      document.documentElement.dataset.theme = value ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', value);
    };

    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, []);

  const toggleTheme = () => {
    const value = !dark;
    setDark(value);
    document.documentElement.dataset.theme = value ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', value);

    try {
      localStorage.setItem('eigi-theme', value ? 'dark' : 'light');
    } catch {}
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setSignalHero(!query.has('hero') && query.get('preview') !== 'hero');
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setPreview(query.get('preview') === 'hero');
    setVideoHero(query.get('hero') !== 'original');
    setNewHero(
      query.get('preview') === 'hero' && query.get('hero') !== 'original',
    );
  }, []);

  const motion = useRef({ progress: 0 });
  const pendingSection = useRef<string | null>(null);

  const finishMenuNavigation = (open: boolean) => {
    if (open || !pendingSection.current) return;

    const href = pendingSection.current;
    pendingSection.current = null;
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);

      if (!target) return;

      history.replaceState(null, '', href);
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: paused ? 'instant' : 'smooth',
        block: 'start',
      });
    });
  };

  usePageMotion(motion, paused, `${newHero}-${signalHero}`);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => setPaused(motion.matches);

    sync();
    motion.addEventListener('change', sync);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll('[data-reveal]')
      .forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      motion.removeEventListener('change', sync);
    };
  }, []);

  return (
    <main
      id="top"
      className={
        signalHero
          ? 'signal-page'
          : newHero
            ? 'engineering-preview'
            : videoHero
              ? 'fullscreen-film-page'
              : ''
      }
    >
      <div
        className="page-progress"
        aria-hidden="true"
      />
      <ParallaxComponent paused={paused} />
      <a
        href="#approach"
        className="skip-link"
      >
        Skip to content
      </a>
      {newHero ? (
        <EngineeringHero
          contact={contact}
          paused={paused}

          onMenu={() => setMenu(true)}
        />
      ) : (
        <>
          <header className="site-header frosted-header">
            <a
              href="#top"
              className="wordmark brand-lockup"
              aria-label="eigi ai home"
            >
              <img
                src="/eigi-logo.ico"
                alt=""
                width="32"
                height="32"
              />
              eigi.ai
            </a>
            <p className="header-manifesto">
              We turn complex problems into
              <br className="desktop-break" /> intelligent systems that work
              <br className="desktop-break" /> in the real world.
            </p>
            <nav
              className="header-actions"
              aria-label="Main navigation"
            >
              <div className="header-section-links">
                <a href="#method">Our FDE</a>
                <a href="#approach">FDE Goals</a>
                <a href="#contact">Contact Us</a>
              </div>
              <button
                className="theme-control"
                onClick={toggleTheme}
                aria-label={
                  dark ? 'Switch to light mode' : 'Switch to dark mode'
                }
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <a
                className="pill dark"
                href={contact}
              >
                LET’S TALK <ArrowUpRight size={16} />
              </a>
              <button
                className="pill menu-button"
                onClick={() => setMenu(true)}
              >
                MENU <span className="menu-dots">••</span>
              </button>
            </nav>
          </header>
          {signalHero ? (
            <SignalHero
              paused={paused}
              contact={contact}
            />
          ) : (
            <section
              className={`scroll-story ${videoHero ? 'video-story' : ''}`}
              aria-label="From complexity to production"
            >
              <div
                className={`hero-scene story-sticky ${assembled ? 'assembled' : ''}`}
              >
                {videoHero ? (
                  <HeroVideo paused={paused} />
                ) : (
                  <Frontier
                    assembled={assembled}
                    paused={paused}
                    motion={motion}
                  />
                )}
                <div className="hero-shade" />
                <p className="scene-eyebrow">
                  <span className="status-dot" /> FORWARD DEPLOYED ENGINEERING
                </p>
                <HeroPunchline />
                <div className="hero-bottom">
                  <a
                    href="#experience"
                    className="story-skip"
                  >
                    ENTER THE 3D EXPERIENCE <ArrowUpRight size={16} />
                  </a>
                  {videoHero ? (
                    <span className="film-label">
                      HUMAN INGENUITY. REAL-WORLD IMPACT.
                    </span>
                  ) : (
                    <button
                      className="assemble-button"
                      onClick={() => setAssembled(!assembled)}
                      aria-pressed={assembled}
                    >
                      {assembled ? 'RELEASE THE SIGNAL' : 'FOCUS THE SIGNAL'}
                      <Plus
                        size={18}
                        className={assembled ? 'rotated' : ''}
                      />
                    </button>
                  )}
                </div>
                <div
                  className="story-progress"
                  aria-hidden="true"
                >
                  <span className="story-marker active">MISSION</span>
                  <span className="story-marker">ENGINEERS</span>
                  <span className="story-marker">PROBLEM</span>
                  <span className="story-marker">SOLUTION</span>
                  <span className="story-progress-line" />
                </div>
                <div
                  className="scroll-cue"
                  aria-hidden="true"
                >
                  <span>SCROLL TO TRANSFORM</span>
                  <ArrowDown size={16} />
                </div>
              </div>
            </section>
          )}
        </>
      )}
      {preview && (
        <nav
          className="hero-comparison"
          aria-label="Hero comparison"
        >
          <span>LOCAL PREVIEW</span>
          <a
            href="/?preview=hero"
            aria-current={newHero ? 'page' : undefined}
          >
            New hero
          </a>
          <a
            href="/?preview=hero&hero=original"
            aria-current={!newHero ? 'page' : undefined}
          >
            Previous hero
          </a>
        </nav>
      )}
      <a
        href="#approach"
        className="section-rule"
        aria-label="Scroll to our approach"
      >
        <Plus size={19} />
        <span>
          SCROLL TO EXPLORE <ArrowDown size={12} />
        </span>
        <Plus size={19} />
        <span className="rule-end">ENGINEERING × INTELLIGENCE</span>
        <Plus size={19} />
      </a>
      <section
        id="approach"
        className="intro section-pad"
      >
        <div
          className="intro-top"
          data-reveal
        >
          <p className="eyebrow">01 / THE EIGI APPROACH</p>
          <span className="little-mark">eigi.ai</span>
        </div>
        <h2
          data-reveal
          data-scroll-shift="-30"
        >
          {newHero ? (
            <>
              <KineticText text="The space between" />
              <br />
              <KineticText text="ambition and execution." />
            </>
          ) : (
            <>
              <KineticText text="Great AI belongs" />
              <br />
              in the{' '}
              <span className="blue-text">
                <KineticText text="real world." />
              </span>
              <span className="heading-dot">✳</span>
            </>
          )}
        </h2>
        <div
          className="intro-bottom"
          data-reveal
        >
          <p className="intro-aside">
            CLOSE TO THE PROBLEM.
            <br />
            COMMITTED TO THE OUTCOME.
          </p>
          <div>
            <p
              className="intro-copy"
              data-scrub-words
            >
              {'We go where the work happens. Embedded with your team, we connect your data, tools, and ideas to build AI that moves your business forward.'
                .split(' ')
                .map((word, i) => (
                  <span key={i}>{word} </span>
                ))}
            </p>
            <a
              className="text-link"
              href="#method"
            >
              Meet your engineering partners <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </section>
      <Collective paused={paused} />
      <CapabilityMarquee />
      <section
        id="capabilities"
        className="capabilities section-pad"
      >
        <div
          className="section-heading"
          data-reveal
        >
          <h2>
            <KineticText text="Possibilities." />
            <sup>02</sup>
          </h2>
          <p>
            A LOOK AT WHAT WE CAN BUILD TOGETHER.
            <br />
            <span>Illustrative systems. Real possibilities.</span>
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((item, i) => (
            <button
              key={item.id}
              className={`capability-card card-${i}`}
              onClick={() => setSelected(i)}
              aria-label={`Explore ${item.label}`}
              data-reveal
            >
              <div
                className="capability-visual"
                data-scroll-shift={i === 0 ? '-65' : '65'}
              >
                <Sculpture
                  variant={item.variant}
                  paused={paused}
                />
                <span className="card-index">
                  <span className="brand-type">eigi_ai</span> / {item.id}
                </span>
                <span className="card-tag">AI PROJECT CONCEPT</span>
                <span className="card-open">
                  <ArrowUpRight size={23} />
                </span>
                <span className="project-preview-title">
                  {i === 0 ? 'Knowledge copilot' : 'Document intelligence'}
                </span>
                <span className="diagram-label">
                  {i === 0 ? 'CONTEXT → CLARITY' : 'INPUT → OUTCOME'}
                </span>
              </div>
              <div className="card-caption">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <Expertise paused={paused} />
      <section
        id="method"
        className="method section-pad"
      >
        <div
          className="method-heading"
          data-reveal
        >
          <p className="eyebrow">02 / FORWARD, TOGETHER</p>
          <h2>
            {newHero ? (
              <>
                <KineticText text="Turn your vision into" />
                <br />
                <KineticText text="reality that runs" />
                <br />
                <KineticText text="your business." />
              </>
            ) : (
              <>
                <KineticText text="Your team." />
                <br />
                <KineticText text="Extended." />
              </>
            )}
          </h2>
          <p>
            From the first hard question to the system your team uses every day.
            We work alongside you through the whole journey.
          </p>
          <a
            className="pill light"
            href={contact}
          >
            BUILD WITH US <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="method-steps">
          {[
            [
              '01',
              'Embed.',
              'Get close to the work.',
              'We join your team to understand your workflows, constraints, and what a useful result looks like.',
            ],
            [
              '02',
              'Engineer.',
              'Build around your reality.',
              'We connect the right models, data, and tools. Prototype with your people, then test against real tasks.',
            ],
            [
              '03',
              'Deploy.',
              'Make it work, every day.',
              'We take the system into production with evaluation, monitoring, and a clear plan for ownership.',
            ],
          ].map(([n, title, sub, copy]) => (
            <article
              className="method-step"
              key={n}
              data-reveal
            >
              <span className="step-number">{n}</span>
              <div>
                <h3>{title}</h3>
                <h4>{sub}</h4>
                <p>{copy}</p>
              </div>
              <MoveUpRight size={25} />
            </article>
          ))}
        </div>
      </section>
      <ScrollMorphHero
        paused={paused}
        contact={contact}
      />
      <EigiTeam paused={paused} />
      <footer
        id="contact"
        className="footer"
      >
        <div className="footer-top">
          <a
            href="#top"
            className="wordmark footer-brand"
            aria-label="Eigi AI home"
          >
            <img
              src="/eigi-logo.ico"
              alt=""
              width="64"
              height="64"
            />
            eigi.ai
          </a>
          <div>
            <p>HAVE A CHALLENGE IN MIND?</p>
            <a
              className="email-link"
              href={contact}
            >
              buddy@eigi.ai <ArrowUpRight size={20} />
            </a>
          </div>
          <a
            className="back-top"
            href="#top"
            aria-label="Back to top"
          >
            <ArrowDown size={22} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{' '}
            <span className="brand-type">eigi_ai</span>
          </span>
          <span>FORWARD DEPLOYED ENGINEERING</span>
          <span>
            <a href="/credits.txt">3D ASSET CREDITS ↗</a>
          </span>
        </div>
      </footer>
      <Sheet
        open={menu}
        onOpenChange={setMenu}
        onOpenChangeComplete={finishMenuNavigation}
      >
        <SheetContent
          finalFocus={() => (pendingSection.current ? false : undefined)}
          className="navigation-sheet navigation-refined"
          showCloseButton={false}
        >
          <div className="sheet-top">
            <SheetTitle className="wordmark menu-brand">
              <img
                src="/eigi-logo.ico"
                alt=""
                width={36}
                height={36}
              />
              eigi.ai
            </SheetTitle>
            <button
              className="pill"
              onClick={() => setMenu(false)}
            >
              CLOSE <X size={18} />
            </button>
          </div>
          <SheetDescription className="sr-only">
            Explore eigi_ai forward deployed engineering.
          </SheetDescription>
          <div className="menu-intro">
            <span>EXPLORE EIGI</span>
            <p>
              Ambition meets
              <br />
              execution.
            </p>
          </div>
          <nav aria-label="Expanded navigation">
            {[
              ['01', 'Home', '#top'],
              ['02', 'Our approach', '#approach'],
              ['03', 'Disciplines', '#collective'],
              ['04', 'Possibilities', '#capabilities'],
              ['05', 'Expertise', '#expertise'],
              ['06', 'The experience', '#experience'],
            ].map(([n, label, href]) => (
              <a
                href={href}
                key={n}
                onClick={(event) => {
                  event.preventDefault();
                  pendingSection.current = href;
                  setMenu(false);
                }}
              >
                <span>{n}</span>
                <strong>{label}</strong>
                <ArrowUpRight />
              </a>
            ))}
          </nav>
          <a
            className="sheet-email"
            href={contact}
          >
            Let’s build something useful.
            <ArrowUpRight />
          </a>
        </SheetContent>
      </Sheet>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="concept-dialog">
          {selected !== null && (
            <>
              <p className="eyebrow">
                EIGI / {capabilities[selected].id} — AI PROJECT CONCEPT
              </p>
              <DialogTitle className="concept-title">
                {capabilities[selected].title}
              </DialogTitle>
              <DialogDescription className="concept-description">
                {capabilities[selected].detail}
              </DialogDescription>
              <ol className="concept-flow">
                {capabilities[selected].steps.map((step, i) => (
                  <li key={step}>
                    <span>0{i + 1}</span>
                    {step}
                    <ArrowDown size={16} />
                  </li>
                ))}
              </ol>
              <p className="concept-note">
                An illustrative architecture, tailored to your workflow during
                discovery.
              </p>
              <a
                className="pill dark"
                href={contact}
              >
                DISCUSS YOUR USE CASE <ArrowUpRight size={17} />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
