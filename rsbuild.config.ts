import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  html: {
    template: './index.html',
  },
  output: {
    distPath: {
      root: 'dist',
    },
    assetPrefix: '/',
    inlineStyles: true,
  },
  tools: {
    cssLoader: {
      url: {
        filter: (url: string) => {
          // Don't resolve absolute URLs starting with / — they reference public dir files
          if (url.startsWith('/')) return false;
          return true;
        },
      },
    },
  },
  dev: {
    lazyCompilation: false,
  },
  server: {
    port: 3000,
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'vendor-three',
            chunks: 'async',
            priority: 20,
          },
          gsap: {
            test: /[\\/]node_modules[\\/](gsap|@gsap)[\\/]/,
            name: 'vendor-gsap',
            chunks: 'async',
            priority: 20,
          },
          pdfjs: {
            test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
            name: 'vendor-pdf',
            chunks: 'async',
            priority: 20,
          },
        },
      },
    },
  },
});
