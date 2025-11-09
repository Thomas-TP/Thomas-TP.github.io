import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  // Configuration de base
  root: './',
  publicDir: 'public',
  base: '/',

  // Configuration du serveur de développement
  server: {
    port: 8000,
    host: true,
    open: true,
    cors: true,
  },

  // Configuration du build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',

    // Optimisations de performance
    reportCompressedSize: true,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true,
    },

    // Options de minification avancées
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2,
        ecma: 2020,
        arrows: true,
        booleans_as_integers: true,
        keep_fargs: false,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
      mangle: {
        safari10: true,
      },
    },

    // Configuration Rollup pour optimisation
    rollupOptions: {
      output: {
        // Nommage des chunks avec hash pour cache busting
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          if (/\.(png|jpe?g|webp|svg|gif|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name].[hash].[ext]';
          }

          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name].[hash].[ext]';
          }

          if (/\.css$/i.test(assetInfo.name)) {
            return 'assets/css/[name].[hash].[ext]';
          }

          return 'assets/[name].[hash].[ext]';
        },

        // Optimisation des chunks
        manualChunks: (id) => {
          // Séparer les dépendances node_modules en vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },

    // Taille limite des chunks (warning)
    chunkSizeWarningLimit: 1000,

    // Copier les fichiers statiques supplémentaires
    copyPublicDir: true,
  },

  // Optimisations CSS
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [],
    },
  },

  // Plugins
  plugins: [
    // Plugin d'optimisation des images
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: true,
          },
        ],
      },
      webp: {
        quality: 85,
      },
    }),

    // Plugin de compression (gzip et brotli)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Ne compresser que les fichiers > 1KB
      deleteOriginFile: false,
    }),

    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),

    // Plugin personnalisé pour copier et minifier les JS non-modules
    {
      name: 'copy-and-minify-scripts',
      apply: 'build',
      async closeBundle() {
        const fs = await import('fs');
        const path = await import('path');
        const { minify } = await import('terser');

        const jsFiles = [
          'assets/js/privacy-manager.js',
          'assets/js/insights.js',
          'assets/js/hero-animation.js',
          'assets/js/language-manager.js',
          'assets/js/performance-monitor.js',
          'assets/js/security-monitor.js',
          'assets/js/svg-sprite-manager.js',
          'assets/js/theme-manager.js',
          'assets/js/webp-fallbacks.js',
        ];

        const distJsDir = path.default.join('dist', 'assets', 'js');
        await fs.promises.mkdir(distJsDir, { recursive: true });

        for (const file of jsFiles) {
          try {
            const content = await fs.promises.readFile(file, 'utf-8');
            const minified = await minify(content, {
              compress: {
                drop_console: true,
                drop_debugger: true,
                passes: 2,
              },
              format: {
                comments: false,
              },
            });

            const filename = path.default.basename(file);
            await fs.promises.writeFile(
              path.default.join(distJsDir, filename),
              minified.code
            );
          } catch (err) {
            console.warn(`Failed to minify ${file}:`, err.message);
          }
        }

        // Copier le service worker
        try {
          const swContent = await fs.promises.readFile('sw.js', 'utf-8');
          const minifiedSw = await minify(swContent, {
            compress: { passes: 2 },
            format: { comments: false },
          });
          await fs.promises.writeFile('dist/sw.js', minifiedSw.code);
        } catch (err) {
          console.warn('Failed to minify sw.js:', err.message);
        }
      },
    },
  ],

  // Optimisation des dépendances
  optimizeDeps: {
    include: [],
    exclude: [],
  },

  // Configuration des assets
  assetsInclude: ['**/*.pdf', '**/*.xml', '**/*.webmanifest'],

  // Mode de résolution pour compatibilité
  resolve: {
    alias: {
      '@': '/assets',
      '@js': '/assets/js',
      '@css': '/assets/css',
      '@images': '/assets/images',
    },
  },
});
