import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { GsapProvider } from '@/components/ui/motion-provider';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Home } from '@/components/Home';
import { BootSequence } from '@/components/ui/boot-sequence';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const NotFound = lazy(() => import('@/components/NotFound').then(m => ({ default: m.NotFound })));
const BOOT_STORAGE_KEY = 'boot-played';

// Treat any path other than the root or index.html as a 404. We don't have a
// real router because the site is a single page — anything else is unknown.
function isUnknownPath(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.replace(/\/+$/, '');
  return p !== '' && p !== '/index.html';
}

export function App() {
  const [unknown] = useState(isUnknownPath);
  const [siteReady, setSiteReady] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem(BOOT_STORAGE_KEY) === '1';
    } catch {
      return true;
    }
  });
  useDocumentMeta();
  const revealSite = useCallback(() => setSiteReady(true), []);

  useEffect(() => {
    document.getElementById('lcp-prerender')?.remove();
  }, []);

  if (unknown) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <NotFound />
        </Suspense>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <GsapProvider>
        <BootSequence onExitStart={revealSite} onComplete={revealSite} />
        <div
          className={`min-h-screen transition-[opacity,transform,filter] duration-700 ease-out ${
            siteReady ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-4 scale-[0.99] blur-sm'
          }`}
        >
          <ClientLayout>
            <Home />
          </ClientLayout>
        </div>
      </GsapProvider>
    </ThemeProvider>
  );
}
