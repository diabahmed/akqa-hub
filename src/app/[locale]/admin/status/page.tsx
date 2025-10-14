import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@src/components/shared/container';
import { BlurFade } from '@src/components/ui/blur-fade';
import { Button } from '@src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { getAllSyncedArticlesAction, getSyncStatusAction } from '@src/lib/actions/get-sync-status';

export const metadata: Metadata = {
  title: 'Sync Status',
  description:
    'Monitor RAG system status and view all synchronized articles in the vector database.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StatusPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const params = await searchParams;
  const locale = params?.locale;

  const statusResult = await getSyncStatusAction();
  const articlesResult = await getAllSyncedArticlesAction(locale);

  if (!statusResult.success || !statusResult.stats) {
    return (
      <BlurFade delay={0.25} inView direction="up">
        <Container>
          <div className="bg-destructive/10 text-destructive rounded-md border p-6">
            <h2 className="font-heading mb-2 text-xl font-bold">Error Loading Status</h2>
            <p className="font-body">{statusResult.error || 'Unknown error'}</p>
          </div>
        </Container>
      </BlurFade>
    );
  }

  const stats = statusResult.stats;
  const articles = articlesResult.success && articlesResult.articles ? articlesResult.articles : [];

  return (
    <BlurFade delay={0.25} inView direction="up">
      <Container>
        {/* Hero Header */}
        <div className="space-y-6 pb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-primary font-body mb-4 text-sm font-semibold tracking-wider uppercase">
                Database Monitoring
              </p>
              <h1 className="font-heading text-5xl font-bold tracking-tight md:text-6xl">
                Database Status
              </h1>
              <p className="text-muted-foreground font-body text-xl md:text-2xl">
                Monitor vector database statistics and synced content.
              </p>
            </div>
            <Link href="/en-US/admin/sync">
              <Button className="font-body">Go to Sync</Button>
            </Link>
          </div>
        </div>

        <div className="border-border my-8 border-t" />

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Total Chunks</CardTitle>
              <CardDescription className="font-body">Embeddings stored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-heading text-4xl font-bold">{stats.totalChunks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Unique Articles</CardTitle>
              <CardDescription className="font-body">Blog posts synced</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-heading text-4xl font-bold">{stats.uniqueArticles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>By Locale</CardTitle>
              <CardDescription>Content distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.byLocale.map(item => (
                <div key={item.locale} className="flex justify-between">
                  <span className="font-medium">{item.locale}:</span>
                  <span>{item.chunks} chunks</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Syncs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Syncs</CardTitle>
            <CardDescription>Last 10 synced articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentSyncs.map((sync, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <div className="font-medium">{sync.title}</div>
                    <div className="text-muted-foreground text-sm">
                      {sync.slug} • {sync.locale}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div>{sync.chunks} chunks</div>
                    <div className="text-muted-foreground">
                      {sync.lastSyncedAt ? new Date(sync.lastSyncedAt).toLocaleString() : 'Never'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Synced Articles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Synced Articles</CardTitle>
                <CardDescription>
                  {locale ? `Filtered by locale: ${locale}` : 'All locales'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/en-US/admin/status">
                  <Button variant="outline" size="sm">
                    All
                  </Button>
                </Link>
                <Link href="/en-US/admin/status?locale=en-US">
                  <Button variant="outline" size="sm">
                    en-US
                  </Button>
                </Link>
                <Link href="/en-US/admin/status?locale=de-DE">
                  <Button variant="outline" size="sm">
                    de-DE
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Slug</th>
                    <th className="pb-2 font-medium">Locale</th>
                    <th className="pb-2 font-medium">Chunks</th>
                    <th className="pb-2 font-medium">Last Synced</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, idx) => (
                    <tr key={idx} className="font-body border-b last:border-0">
                      <td className="py-3">{article.title}</td>
                      <td className="text-muted-foreground py-3 text-sm">{article.slug}</td>
                      <td className="py-3">{article.locale}</td>
                      <td className="py-3">
                        {article.chunkCount} / {article.totalChunks}
                      </td>
                      <td className="py-3 text-sm">
                        {article.lastSyncedAt
                          ? new Date(article.lastSyncedAt).toLocaleDateString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Container>
    </BlurFade>
  );
}
