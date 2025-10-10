import withBundleAnalyzer from '@next/bundle-analyzer';

export default [
  [
    withBundleAnalyzer,
    {
      enabled: process.env.BUNDLE_ANALYZE === 'true',
    },
  ],
];
