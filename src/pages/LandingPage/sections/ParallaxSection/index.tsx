'use client';

import { useEffect } from 'react';

// Applies the supplied layered-parallax concept to the existing content.
// Native scrolling and the page's existing Motion timelines retain ownership.
export function ParallaxComponent({ paused = false }: { paused?: boolean }) {
  useEffect(() => {
    const root = document.querySelector('main');

    if (!root) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 800px)');
    const definitions: [string, number][] = [
      [
        '.intro-top, .section-heading, .marquee-heading, .collective-top, .expertise-heading',
        18,
      ],
      [
        '.intro-bottom, .card-caption, .discipline-detail, .method-heading h2, .opportunities h2',
        12,
      ],
      ['.ai-morph-heading, .eigi-team-heading, .footer-top', 14],
      [
        '.method-heading>p, .opportunities>div:last-child, .eigi-team-statement',
        8,
      ],
      ['.collective-vignette, .eigi-team-scribble', 26],
    ];
    const layers = definitions
      .flatMap(([selector, distance]) =>
        [...root.querySelectorAll<HTMLElement>(selector)].map((element) => ({
          element,
          section: element.closest('section,footer') as HTMLElement,
          distance,
          old: element.style.translate,
          current: 0,
          target: 0,
        })),
      )
      .filter((layer) => layer.section);
    let frame = 0,
      last = 0,
      dirty = true;

    const disabled = () => paused || reduced.matches;

    const measure = () => {
      const bounds = new Map<HTMLElement, DOMRect>();
      layers.forEach((layer) => {
        if (!bounds.has(layer.section))
          bounds.set(layer.section, layer.section.getBoundingClientRect());

        const rect = bounds.get(layer.section)!;
        const progress = Math.max(
          0,
          Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
        );
        layer.target = disabled()
          ? 0
          : (0.5 - progress) * 2 * layer.distance * (compact.matches ? 0.4 : 1);
      });
    };

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (dirty) {
        measure();
        dirty = false;
      }

      let moving = false;
      layers.forEach((layer) => {
        layer.current = disabled()
          ? 0
          : layer.current +
            (layer.target - layer.current) * (1 - Math.exp(-dt * 14));

        if (Math.abs(layer.target - layer.current) > 0.025) moving = true;

        layer.element.style.translate = `0 ${layer.current.toFixed(2)}px`;
      });
      frame = moving ? requestAnimationFrame(render) : 0;
    };

    const update = () => {
      dirty = true;

      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(render);
      }
    };

    root.classList.add('subtle-parallax');
    const resize = new ResizeObserver(update);
    resize.observe(root);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    reduced.addEventListener('change', update);
    compact.addEventListener('change', update);
    update();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reduced.removeEventListener('change', update);
      compact.removeEventListener('change', update);
      root.classList.remove('subtle-parallax');
      layers.forEach((layer) => {
        layer.element.style.translate = layer.old;
      });
    };
  }, [paused]);

  return null;
}
