import { LazyMotion } from 'framer-motion';

const loadFeatures = () => import('framer-motion').then(m => m.domAnimation);

export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
    return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
