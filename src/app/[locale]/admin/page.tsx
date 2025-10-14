import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@src/components/shared/container';
import { BlurFade } from '@src/components/ui/blur-fade';
import { Button } from '@src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description:
    'RAG System Administration - Manage content synchronization and monitor the vector database powering AI-assisted content discovery.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <BlurFade delay={0.25} inView direction="up">
      <Container>
        {/* Hero Header */}
        <div className="space-y-6 pb-8">
          <div className="space-y-2">
            <p className="text-primary font-body mb-4 text-sm font-semibold tracking-wider uppercase">
              System Administration
            </p>
            <h1 className="font-heading text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              RAG System Admin
            </h1>
            <p className="text-muted-foreground font-body text-xl md:text-2xl">
              Manage content synchronization and monitor the vector database powering AI-assisted
              content discovery.
            </p>
          </div>
        </div>

        <div className="border-border my-8 border-t" />

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Content Sync</CardTitle>
              <CardDescription className="font-body">
                Sync blog posts from Contentful to the vector database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground font-body mb-6 list-inside list-disc space-y-2 text-sm">
                <li>Sync individual posts by slug</li>
                <li>Bulk sync all posts for a locale</li>
                <li>Real-time sync progress</li>
                <li>Automatic chunking and embedding generation</li>
              </ul>
              <Link href="/en-US/admin/sync">
                <Button className="font-body">Go to Sync</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Database Status</CardTitle>
              <CardDescription className="font-body">
                View statistics and monitor the vector database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground font-body mb-6 list-inside list-disc space-y-2 text-sm">
                <li>Total chunks and articles</li>
                <li>Distribution by locale</li>
                <li>Recent sync history</li>
                <li>Full article listing</li>
              </ul>
              <Link href="/en-US/admin/status">
                <Button variant="outline" className="font-body">
                  View Status
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-body space-y-4 text-sm">
              <div>
                <strong className="font-semibold">Embedding Model:</strong> OpenAI
                text-embedding-3-small (1536 dimensions)
              </div>
              <div>
                <strong className="font-semibold">Chunking Strategy:</strong> 150 characters per
                chunk, 20 character overlap
              </div>
              <div>
                <strong className="font-semibold">Database:</strong> Neon PostgreSQL with pgvector
                extension
              </div>
              <div>
                <strong className="font-semibold">Indexing:</strong> HNSW index for fast similarity
                search
              </div>
              <div>
                <strong className="font-semibold">Supported Locales:</strong> en-US, de-DE
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Commands */}
        <div className="bg-muted mt-6 rounded-lg border p-6">
          <h3 className="font-heading mb-4 text-lg font-semibold">Quick Commands</h3>
          <pre className="overflow-x-auto font-mono text-sm">
            <code>
              {`# Setup vector extension
pnpm tsx src/db/setup-vector.ts

# Run migrations
pnpm db:generate && pnpm db:migrate

# CLI sync (alternative)
pnpm tsx src/db/sync-content.ts

# Open database studio
pnpm db:studio`}
            </code>
          </pre>
        </div>
      </Container>
    </BlurFade>
  );
}
