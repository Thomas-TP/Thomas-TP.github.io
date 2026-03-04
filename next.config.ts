import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // unoptimized fallback for plain next/image usages
    // ExportedImage from next-image-export-optimizer generates optimized
    // WebP variants at build time, independently of this setting
    unoptimized: true,
  },
  env: {
    nextImageExportOptimizer_imageFolderPath: 'public',
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_quality: '80',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',
  },
};

export default nextConfig;
