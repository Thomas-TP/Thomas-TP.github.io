import { LazyMotion } from 'framer-motion';

// Async feature loading: framer-motion is NOT in the sync critical path (Hero uses
// pure CSS animations). Features load in the background for below-the-fold sections.
const loadFeatures = () => import('framer-motion').then(m => m.domAnimation);

export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
    return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
