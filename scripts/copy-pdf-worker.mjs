import { copyFileSync } from 'fs';
import { resolve } from 'path';

const src = resolve('node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const dest = resolve('public/pdf.worker.min.mjs');

copyFileSync(src, dest);
console.log('✓ Copied pdf.worker.min.mjs → public/');
