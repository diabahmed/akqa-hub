import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import nextComposePlugins from 'next-compose-plugins';

import headers from './config/headers.js';
import plugins from './config/plugins.js';

/**
 * https://github.com/cyrilwanner/next-compose-plugins/issues/59
 */
const { withPlugins } = nextComposePlugins.extend(() => ({}));

/**
 * Next config
 * documentation: https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
export default withPlugins(plugins, {
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  /**
   * add the environment variables you would like exposed to the client here
   * documentation: https://nextjs.org/docs/api-reference/next.config.js/environment-variables
   */
  env: {
    ENVIRONMENT_NAME: process.env.ENVIRONMENT_NAME,
  },

  /**
   * The experimental option allows you to enable future/experimental options
   * like React 18 concurrent features.
   */
  experimental: {
    // urlImports: true,
    // concurrentFeatures: true,
    // serverComponents: true,
  },

  /**
   * SWC minification opt-in
   * Please note that while not in experimental, the swcMinification may cause issues in your build.
   * example: https://github.com/vercel/next.js/issues/30429 (Yup email validation causes an exception)
   */
  // swcMinify: true,

  poweredByHeader: false,
  compress: true,
  assetPrefix: '/exp1-static',
  transpilePackages: ['@workspace/ui'],

  /**
   * add the headers you would like your next server to use
   * documentation: https://nextjs.org/docs/api-reference/next.config.js/headers
   *                https://nextjs.org/docs/advanced-features/security-headers
   */
  headers,

  /**
   * https://nextjs.org/docs/basic-features/image-optimization
   * Settings are the defaults
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'images.eu.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'downloads.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  /**
   * Turbopack configuration for development
   * documentation: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
   */
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
});
