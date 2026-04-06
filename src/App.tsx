import { ThemeProvider } from '@/components/ui/theme-provider';
import { LazyMotionProvider } from '@/components/ui/motion-provider';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Home } from '@/components/Home';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <LazyMotionProvider>
        <ClientLayout>
          <Home />
        </ClientLayout>
      </LazyMotionProvider>
    </ThemeProvider>
  );
}
