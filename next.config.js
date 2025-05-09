/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Deprecated, but keeping for backward compatibility
    domains: ['placehold.co', 'picsum.photos', 'storage.googleapis.com', 'images.pexels.com', 'player.vimeo.com', 'images.unsplash.com', 'source.unsplash.com', 'res.cloudinary.com'],
    // New recommended way to configure remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours cache for images
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920], // Device breakpoint sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Image sizes for srcsets
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Note: the api config has been removed as it's not valid in Next.js config
  // Configure body parser in individual API routes instead
  // Add custom headers for static assets
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Apply cache headers to images
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache
          },
        ],
      },
      {
        // Apply cache headers to static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache
          },
        ],
      },
    ];
  },
  // Optimize image assets using Sharp for better performance
  webpack(config) {
    config.module.rules.push({
      test: /\.(jpe?g|png|webp|avif)$/i,
      type: 'asset',
      use: [
        {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            name: 'static/media/[name]-[hash]-[width].[ext]',
            sizes: [320, 640, 960, 1280],
            placeholder: true,
            placeholderSize: 40,
            format: 'webp',
            quality: 80,
          },
        },
      ],
    });
    
    return config;
  },
}

module.exports = nextConfig 