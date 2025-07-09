
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avaz.sa',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ejar.sa',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rei.rega.gov.sa',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'red.rega.gov.sa',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'balady.gov.sa',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mapservice.alriyadh.gov.sa',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.moj.gov.sa', // Ministry of Justice
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'srem.moj.gov.sa', // Real Estate Market (subdomain of MOJ)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com', // For Firebase logo in market navigator
        port: '',
        pathname: '/**',
      },
      { // From previous configuration, kept for safety
        protocol: 'https',
        hostname: 'momah.gov.sa',
        port: '',
        pathname: '/**',
      },
      { // From previous configuration, kept for safety though subdomains might cover it
        protocol: 'https',
        hostname: 'rega.gov.sa',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;


    