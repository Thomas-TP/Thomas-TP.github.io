import { useEffect, useRef, useState } from 'react';
import { sfx } from '@/lib/sound';

const STORAGE_KEY = 'boot-played';
const TOTAL_MS = 1800;

/**
 * One-shot branded boot screen — runs once per session on first load.
 * Renders nothing on subsequent navigation/page reloads within the same tab.
 *
 * Self-contained: mounts overlay, animates, then unmounts.
 */
export function BootSequence() {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEY) !== '1';
  });
  const [counter, setCounter] = useState(0);
  const [exiting, setExiting] = useState(false);
  const blipTimeRef = useRef(0);

  useEffect(() => {
    if (!shouldRender) return;

    // Lock body scroll for the duration
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / TOTAL_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(eased * 100);
      setCounter(value);

      // Tiny blip every ~25 units of progress (4 blips total)
      if (value > blipTimeRef.current && value % 25 === 0 && value > 0 && value < 100) {
        blipTimeRef.current = value;
        sfx.bootBlip();
      }

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sfx.bootDone();
        setExiting(true);
        // Match CSS transition (400ms)
        setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, '1');
          setShouldRender(false);
          document.body.style.overflow = prevOverflow;
        }, 420);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  // Stroke-dasharray trick for path tracing.
  // T glyph path (35,35 → 65,35 horizontal, then 50,35 → 50,65 vertical)
  // Pre-computed lengths: horizontal = 30, vertical = 30, circle ≈ 251.3
  const traceLength = 320;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-[400ms] ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(var(--background))_70%)] pointer-events-none" />

      {/* Logo with traced strokes */}
      <div className="relative mb-10">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          className="drop-shadow-[0_0_30px_rgba(99,102,241,0.15)]"
        >
          {/* Encircling ring — fades in */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgb(var(--foreground))"
            strokeWidth="2"
            strokeOpacity="0.15"
            strokeDasharray={traceLength}
            strokeDashoffset={traceLength - (counter / 100) * traceLength}
            style={{ transition: 'stroke-dashoffset 60ms linear' }}
          />
          {/* Inner ring — accent */}
          <circle
            cx="50"
            cy="50"
            r="28"
            stroke="rgb(var(--foreground))"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="3 4"
            style={{
              transformOrigin: 'center',
              transform: `rotate(${counter * 3.6}deg)`,
              transition: 'transform 60ms linear',
            }}
          />
          {/* T glyph — strokes draw in */}
          <path
            d="M35 35H65"
            stroke="rgb(var(--foreground))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="30"
            strokeDashoffset={Math.max(0, 30 - (counter / 50) * 30)}
            style={{ transition: 'stroke-dashoffset 60ms linear' }}
          />
          <path
            d="M50 35V65"
            stroke="rgb(var(--foreground))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="30"
            strokeDashoffset={Math.max(0, 30 - Math.max(0, counter - 30) / 50 * 30)}
            style={{ transition: 'stroke-dashoffset 60ms linear' }}
          />
        </svg>
      </div>

      {/* Counter + label */}
      <div className="flex flex-col items-center gap-3 font-mono">
        <div className="text-5xl font-bold text-foreground tracking-tight tabular-nums">
          {String(counter).padStart(3, '0')}
          <span className="text-muted-foreground">%</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          {counter < 30 ? 'INIT' : counter < 70 ? 'COMPILING' : counter < 95 ? 'MOUNTING' : 'READY'}
        </div>
      </div>

      {/* Loading bar */}
      <div className="mt-10 w-48 h-px bg-foreground/10 overflow-hidden">
        <div
          className="h-full bg-foreground"
          style={{ width: `${counter}%`, transition: 'width 60ms linear' }}
        />
      </div>

      {/* Brand mark bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-mono">
        thomastp.ch
      </div>
    </div>
  );
}
