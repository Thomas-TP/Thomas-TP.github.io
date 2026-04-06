import { LazyMotion, domAnimation } from 'framer-motion';

// Use synchronous domAnimation: framer-motion is already in the sync bundle
// (imported statically in Hero.tsx), so there is zero cost — and it eliminates
// the async Promise round-trip that would keep elements in their `initial`
// (invisible) state for an extra render cycle, hurting LCP.
export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
    return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
