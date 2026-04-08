import { useEffect } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { GsapProvider } from '@/components/ui/motion-provider';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Home } from '@/components/Home';

export function App() {
  useEffect(() => {
    document.getElementById('lcp-prerender')?.remove();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <GsapProvider>
        <ClientLayout>
          <Home />
        </ClientLayout>
      </GsapProvider>
    </ThemeProvider>
  );
}
