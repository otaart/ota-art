import type { NextConfig } from 'next';

const security = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are prepared ahead of time (scripts/build-images.mjs); later they come from the Sanity CDN.
  images: { unoptimized: true },
  async headers() {
    return [
      { source: '/:path*', headers: security },
      // built media never change under the same name
      { source: '/media/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
  async redirects() {
    return [
      // prototype addresses
      { source: '/:locale(en|cs)/gallery', destination: '/:locale/works', permanent: true },
    ];
  },
};

export default config;
