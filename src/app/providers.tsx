'use client';

import '../i18n';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ClientLayout } from '@/components/layout/ClientLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ClientLayout>{children}</ClientLayout>
    </ThemeProvider>
  );
}
