'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const stages = [
  {
    name: 'Mission',
    title: 'Your mission.',
    detail:
      'Start with the problem you want to solve. We work with your team to define what a useful outcome looks like.',
    tags: ['Your ambition', 'Your constraints', 'A shared direction'],
  },
  {
    name: 'Engineers',
    title: 'Our engineers.',
    detail:
      'Engineers embedded with your people, connecting the data, tools, and decisions that make your business work.',
    tags: ['Embedded team', 'Connected context', 'Working prototypes'],
  },
  {
    name: 'Problem',
    title: 'Closer to the problem.',
    detail:
      'Build around real workflows. Test with the people who use the product, and refine it through honest feedback.',
    tags: ['Real workflows', 'Continuous feedback', 'Measured quality'],
  },
  {
    name: 'Solution',
    title: 'Faster to the deployed solution.',
    detail:
      'Take the system into everyday use, with evaluation, monitoring, and a clear plan for ownership.',
    tags: ['Production integration', 'Evaluation', 'Team handover'],
  },
];

// An original, low-resolution ordered-dither field. The pointer changes the
// local density; the system cursor remains native and controls stay clickable.
function PixelField({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !host || !ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0,
      visible = true;
    let dark = document.documentElement.dataset.theme === 'dark';
    let px = -1000,
      py = -1000,
      tx = -1000,
      ty = -1000,
      strength = 0,
      targetStrength = 0;
    const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

    const still = () => paused || reduced.matches;

    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!still()) time += dt;

      px += (tx - px) * (1 - Math.exp(-dt * 12));
      py += (ty - py) * (1 - Math.exp(-dt * 12));
      strength += (targetStrength - strength) * (1 - Math.exp(-dt * 6));
      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          // Advect the field continuously; pointer input is an additional ripple,
          // not the trigger for the background animation.
          const fx = x + time * 5,
            fy = y - time * 2.5;
          const wave =
            Math.sin(fx * 0.044 + Math.sin(fy * 0.035 + time * 0.3) * 2.8) +
            Math.cos(fy * 0.052 - fx * 0.017 + time * 0.22) +
            0.55 * Math.sin((fx + fy) * 0.086 - time * 0.32);
          const distance = Math.hypot(x - px, y - py);
          const influence = Math.exp(-(distance * distance) / 1300) * strength;
          const density = 0.3 + wave * 0.2 + influence * 0.38;

          if (density > (bayer[(x % 4) + (y % 4) * 4] + 0.5) / 16) {
            ctx.fillStyle = dark
              ? `rgba(148,158,179,${0.3 + influence * 0.32})`
              : `rgba(105,118,144,${0.24 + influence * 0.3})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
    };

    const loop = (now: number) => {
      if (now - last >= 1000 / 30) paint(now);

      frame = requestAnimationFrame(loop);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      paint(performance.now());

      if (!still() && visible && !document.hidden)
        frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      width = Math.ceil(host.clientWidth / 5);
      height = Math.ceil(host.clientHeight / 5);
      canvas.width = width;
      canvas.height = height;
      sync();
    };

    const move = (event: PointerEvent) => {
      if (still() || !fine.matches) return;

      const rect = host.getBoundingClientRect();
      tx = (event.clientX - rect.left) / 5;
      ty = (event.clientY - rect.top) / 5;

      if (!targetStrength) {
        px = tx;
        py = ty;
      }

      targetStrength = 1;
    };

    const leave = () => {
      targetStrength = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme === 'dark';
      sync();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(host);
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      observer.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused]);

  return (
    <canvas
      ref={ref}
      className="signal-pixels"
      aria-hidden="true"
    />
  );
}

export default function SignalHero({
  paused,
  contact,
}: {
  paused: boolean;
  contact: string;
}) {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <section
      className="signal-hero"
      aria-labelledby="signal-title"
    >
      <PixelField paused={paused} />
      <div className="signal-frame">
        <div className="signal-kicker">
          <span>
            <i /> FORWARD DEPLOYED ENGINEERING
          </span>
          <span>BUILT FOR THE FUTURE. AVAILABLE TODAY.</span>
        </div>
        <div className="signal-grid">
          <div className="signal-copy">
            <h1 id="signal-title">
              Your mission.
              <br />
              <strong>Our engineers.</strong>
            </h1>
            <p className="signal-lead">
              Closer to the problem.
              <br />
              Faster to the deployed solution.
            </p>
            <p className="signal-description">
              We embed with your team to design, build, and deploy AI products
              and systems that work in the real world.
            </p>
            <div className="signal-actions">
              <a
                className="signal-button signal-primary"
                href={contact}
              >
                LET’S BUILD TOGETHER <ArrowUpRight size={18} />
              </a>
              <a
                className="signal-button"
                href="#capabilities"
              >
                EXPLORE OUR WORK <ArrowDown size={16} />
              </a>
            </div>
          </div>
          <div className="signal-console">
            <div className="signal-console-heading">
              <span>FROM AMBITION TO EXECUTION</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div
              className="signal-tabs"
              role="tablist"
              aria-label="Our engineering approach"
            >
              {stages.map((item, index) => (
                <button
                  id={`signal-tab-${index}`}
                  key={item.name}
                  role="tab"
                  aria-selected={active === index}
                  aria-controls="signal-panel"
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => {
                    let next = index;

                    if (event.key === 'ArrowRight')
                      next = (index + 1) % stages.length;
                    else if (event.key === 'ArrowLeft')
                      next = (index + stages.length - 1) % stages.length;
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = stages.length - 1;
                    else return;

                    event.preventDefault();
                    setActive(next);
                    document.getElementById(`signal-tab-${next}`)?.focus();
                  }}
                >
                  <span>0{index + 1}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <div
              id="signal-panel"
              role="tabpanel"
              aria-labelledby={`signal-tab-${active}`}
              tabIndex={0}
              className="signal-panel"
            >
              <span
                className="signal-stage-number"
                aria-hidden="true"
              >
                0{active + 1}
                <span> / 04</span>
              </span>
              <div
                key={active}
                className="signal-stage-content"
              >
                <h2>{stage.title}</h2>
                <p>{stage.detail}</p>
                <ul>
                  {stage.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="signal-console-footer">
              <span className="signal-status" /> ENGINEERS ON YOUR TEAM. FROM
              DAY ONE.
            </div>
          </div>
        </div>
        <div className="signal-footer">
          <span>YOUR AMBITION. A SHARED DIRECTION.</span>
          <a href="#experience">
            ENTER THE 3D EXPERIENCE <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
