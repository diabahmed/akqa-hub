import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Sync',
  description:
    'Synchronize Contentful blog posts to the vector database for AI-powered content discovery.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SyncLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
