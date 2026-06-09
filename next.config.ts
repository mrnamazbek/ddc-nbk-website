import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
  turbopack: {
    resolveAlias: {
      three: 'three',
    },
  },
};

export default withNextIntl(nextConfig);
