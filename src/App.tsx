import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactLenis from 'lenis/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/scroll-progress';
import { CustomCursor } from '@/components/custom-cursor';
import { Home } from '@/components/Home';
import { NotFound } from '@/components/NotFound';

import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function App() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const Content = (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Gradient Spotlights */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[128px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[128px] pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 brightness-100 pointer-events-none mix-blend-overlay"></div>
      </div>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );

  return (
    <Router>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:border focus:border-border focus:top-4 focus:left-4 rounded-md transition-transform"
      >
        {t('skip_content')}
      </a>
      <ScrollProgress />
      {!shouldReduceMotion && <CustomCursor />}

      {!shouldReduceMotion ? (
        <ReactLenis root>
          {Content}
        </ReactLenis>
      ) : (
        Content
      )}
    </Router>
  );
}

export default App;
