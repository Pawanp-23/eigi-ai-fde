'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  paused?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({ children, className, paused = false, pauseOnHover = true }: MarqueeProps) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={host} className={cn('eigi-marquee', pauseOnHover && 'eigi-marquee-hover', className)}
    data-moving={visible && !paused}>
    <div className="eigi-marquee-track">
      <div className="eigi-marquee-group">{children}</div>
      <div className="eigi-marquee-group eigi-marquee-copy" aria-hidden="true" inert>{children}</div>
    </div>
  </div>;
}
