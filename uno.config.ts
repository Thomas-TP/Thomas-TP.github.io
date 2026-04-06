import { defineConfig, presetWind } from 'unocss';

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  },
  presets: [
    presetWind({
      dark: 'class',
    }),
  ],
  theme: {
    colors: {
      background: 'rgb(var(--background) / <alpha-value>)',
      foreground: 'rgb(var(--foreground) / <alpha-value>)',
      card: {
        DEFAULT: 'rgb(var(--card) / <alpha-value>)',
        foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
      },
      popover: {
        DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
        foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
      },
      primary: {
        DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
        foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
      },
      secondary: {
        DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
        foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
      },
      muted: {
        DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
        foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
      },
      accent: {
        DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
        foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
      },
      destructive: {
        DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
        foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
      },
      border: 'rgb(var(--border) / <alpha-value>)',
      input: 'rgb(var(--input) / <alpha-value>)',
      ring: 'rgb(var(--ring) / <alpha-value>)',
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
    fontFamily: {
      sans: 'var(--font-inter), "Inter", sans-serif',
    },
  },
  shortcuts: {
    'glass': 'bg-white/70 backdrop-blur-md border border-black/5 dark:bg-black/40 dark:border-white/10 shadow-sm dark:shadow-none',
    'text-gradient': 'bg-clip-text text-transparent bg-gradient-to-br from-black via-black/80 to-black/40 dark:from-white dark:via-white/80 dark:to-white/40',
  },
});
