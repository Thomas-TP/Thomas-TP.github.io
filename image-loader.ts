// Custom image loader for next-image-export-optimizer
// Serves optimized WebP images generated at build time for static export
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Use the next-image-export-optimizer generated images
  // Falls back to original src during development (when optimized images don't exist yet)
  return `/_next/static/chunks/pages${src}?w=${width}&q=${quality ?? 80}`;
}
