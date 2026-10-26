/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
  async redirects() {
    return [
      // Preserve old intake links used by campaigns, social bios and messages.
      { source: '/apply', destination: '/forms', permanent: false },
      { source: '/apply/:type', destination: '/forms/:type', permanent: false },
      { source: '/forms/index', destination: '/forms', permanent: false },
      { source: '/contact', destination: '/forms/inquiry', permanent: false },
      { source: '/model', destination: '/forms/model', permanent: false },
      { source: '/models', destination: '/forms/model', permanent: false },
      { source: '/ambassador', destination: '/forms/ambassador', permanent: false },
      { source: '/creator', destination: '/forms/ambassador', permanent: false },
      { source: '/influencer', destination: '/forms/influencer', permanent: false },
      { source: '/partnerships', destination: '/forms/sponsor', permanent: false },
      // Preserve traffic from retired Shopify collection handles instead of
      // turning old campaign/search links into dead ends.
      { source: '/collections/all', destination: '/collections/stush', permanent: true },
      { source: '/collections/the-outerwear-vault', destination: '/collections/stush', permanent: true },
      { source: '/collections/the-sets-edit', destination: '/collections/stush', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
