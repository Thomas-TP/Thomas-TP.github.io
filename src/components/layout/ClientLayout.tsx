'use client';

import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Lazy-load Lenis so it doesn't end up in the initial JS bundle — avoids
// forced layout reflow on page load and reduces initial evaluation time.
const ReactLenis = dynamic(() => import('lenis/react'), { ssr: false });

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const Content = (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Gradient Spotlights — will-change:transform promotes to GPU layer,
           avoiding repaint on every scroll tick */}
      <div className="fixed inset-0 z-[-1]" style={{ willChange: 'transform' }}>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20 brightness-100 pointer-events-none mix-blend-overlay" />
      </div>

      <Navbar />
      {children}
      <Footer />
    </div>
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:border focus:border-border focus:top-4 focus:left-4 rounded-md transition-transform"
      >
        {t('skip_content')}
      </a>
      <ScrollProgress />

      {!shouldReduceMotion ? (
        <ReactLenis root>{Content}</ReactLenis>
      ) : (
        Content
      )}
    </>
  );
}
