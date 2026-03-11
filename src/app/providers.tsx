'use client';

import '../i18n';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { LazyMotionProvider } from '@/components/ui/motion-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <LazyMotionProvider>
        <ClientLayout>{children}</ClientLayout>
      </LazyMotionProvider>
    </ThemeProvider>
  );
}
