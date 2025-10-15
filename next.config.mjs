import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['bcryptjs', 'pino']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default withNextIntl(nextConfig);
