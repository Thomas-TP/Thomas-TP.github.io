import { useEffect, useRef, useCallback } from 'react';
import { loadGsap } from '@/lib/gsap-init';

/**
 * Magnetic hover effect using gsap.quickTo for 60fps performance.
 * Used on buttons/links for an Awwwards-grade feel.
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let loaded = false;
    let cleanup: (() => void) | undefined;

    const init = () => {
      if (loaded) return;
      loaded = true;

      loadGsap().then(({ gsap }) => {
        if (!el.isConnected) return; // unmounted before gsap loaded

        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanup = () => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        };
      });
    };

    el.addEventListener('pointerenter', init, { once: true });

    return () => {
      el.removeEventListener('pointerenter', init);
      cleanup?.();
    };
  }, [strength]);

  return ref;
}

/**
 * ScrollTrigger reveal: elements fade/slide in when entering viewport.
 * Supports stagger for child elements.
 */
export function useScrollReveal(
  options: {
    y?: number;
    x?: number;
    opacity?: number;
    scale?: number;
    duration?: number;
    delay?: number;
    stagger?: number | Record<string, unknown>;
    scrub?: boolean | number;
    start?: string;
    end?: string;
    once?: boolean;
    children?: string;
    clipPath?: string;
  } = {}
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;

    loadGsap().then(({ gsap }) => {
      if (!el.isConnected) return;

      const {
        y = 40,
        x = 0,
        opacity = 0,
        scale,
        duration = 0.8,
        delay = 0,
        stagger,
        scrub = false,
        start = 'top 85%',
        end = 'top 20%',
        once = true,
        children,
        clipPath,
      } = options;

      const targets = children ? el.querySelectorAll(children) : el;
      const from: Record<string, unknown> = { opacity, y, x };
      if (scale !== undefined) from.scale = scale;
      if (clipPath) from.clipPath = clipPath;

      const to: Record<string, unknown> = {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: 'power3.out',
        stagger: stagger || 0,
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub,
          once: once && !scrub,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      };
      if (scale !== undefined) to.scale = 1;
      if (clipPath) to.clipPath = 'inset(0% 0% 0% 0%)';

      ctx = gsap.context(() => {
        gsap.fromTo(targets, from, to);
      }, el);
    });

    return () => ctx?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * Split text reveal — characters animate in one by one.
 * For section headings, Awwwards-style.
 */
export function useSplitReveal(
  options: {
    duration?: number;
    stagger?: number;
    y?: number;
    rotateX?: number;
    start?: string;
    scrub?: boolean | number;
  } = {}
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = el.textContent || '';
    el.innerHTML = text
      .split('')
      .map(char =>
        char === ' '
          ? '<span class="inline-block">&nbsp;</span>'
          : `<span class="inline-block">${char}</span>`
      )
      .join('');

    const chars = el.querySelectorAll('span');

    const {
      duration = 0.6,
      stagger = 0.02,
      y = 60,
      rotateX = 40,
      start = 'top 85%',
      scrub = false,
    } = options;

    let ctx: { revert: () => void } | undefined;

    loadGsap().then(({ gsap }) => {
      if (!el.isConnected) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          chars,
          { y, rotateX, opacity: 0, transformOrigin: '50% 50% -30px' },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start,
              scrub,
              once: !scrub,
              toggleActions: 'play none none none',
            },
          }
        );
      }, el);
    });

    return () => ctx?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * Hover scale effect — replaces whileHover/whileTap from Framer Motion.
 */
export function useHoverScale(scaleHover = 1.05, scaleTap = 0.95) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    loadGsap().then(({ gsap }) => {
      if (!el.isConnected) return;

      const enter = () => gsap.to(el, { scale: scaleHover, duration: 0.25, ease: 'power2.out' });
      const leave = () => gsap.to(el, { scale: 1, duration: 0.25, ease: 'power2.out' });
      const down = () => gsap.to(el, { scale: scaleTap, duration: 0.1, ease: 'power2.out' });
      const up = () => gsap.to(el, { scale: scaleHover, duration: 0.15, ease: 'power2.out' });

      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      el.addEventListener('mousedown', down);
      el.addEventListener('mouseup', up);
      cleanup = () => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
        el.removeEventListener('mousedown', down);
        el.removeEventListener('mouseup', up);
      };
    });

    return () => cleanup?.();
  }, [scaleHover, scaleTap]);

  return ref;
}

/**
 * Animate a value reactively with GSAP.
 */
export function useGsapTo(target: unknown, vars: Record<string, unknown>, deps: unknown[] = []) {
  useEffect(() => {
    let tween: { kill: () => void } | undefined;

    loadGsap().then(({ gsap }) => {
      tween = gsap.to(target as gsap.TweenTarget, vars as gsap.TweenVars);
    });

    return () => tween?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Combined ref helper for components needing both magnetic + hover scale.
 */
export function useMergedRefs<T extends HTMLElement>(...refs: React.Ref<T>[]) {
  return useCallback(
    (node: T | null) => {
      refs.forEach(ref => {
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
