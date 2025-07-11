/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'avaz.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'www.ejar.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'rei.rega.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'red.rega.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'balady.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'mapservice.alriyadh.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'www.moj.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'srem.moj.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'www.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'momah.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'rega.gov.sa', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;