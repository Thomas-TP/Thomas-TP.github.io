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
  server: {
    port: 3000,
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: 'all',
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'vendor-three',
            chunks: 'async',
            priority: 20,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'vendor-framer',
            chunks: 'all',
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
