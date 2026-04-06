import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Use the pdfjs-dist version bundled by react-pdf (nested), not the hoisted one.
// A version mismatch between the worker and the library causes a handshake failure.
const nested = resolve('node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const hoisted = resolve('node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const src = existsSync(nested) ? nested : hoisted;
const dest = resolve('public/pdf.worker.min.mjs');

copyFileSync(src, dest);
console.log('✓ Copied pdf.worker.min.mjs → public/');
