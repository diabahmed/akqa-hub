'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Container } from '@src/components/shared/container';
import { BlurFade } from '@src/components/ui/blur-fade';
import { Button } from '@src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu';
import { syncAllBlogPostsAction, syncBlogPostAction } from '@src/lib/actions/sync-content';

export default function SyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState('en-US');

  const handleSyncAll = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await syncAllBlogPostsAction(locale);
      setResult(res);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    setLoading(false);
  };

  const handleSyncSingle = async () => {
    if (!slug.trim()) {
      setResult({ success: false, error: 'Please enter a slug' });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await syncBlogPostAction(slug.trim(), locale);
      setResult(res);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    setLoading(false);
  };

  return (
    <BlurFade delay={0.25} inView direction="up">
      <Container>
        {/* Hero Header */}
        <div className="space-y-6 pb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-primary font-body mb-4 text-sm font-semibold tracking-wider uppercase">
                Content Management
              </p>
              <h1 className="font-heading text-5xl font-bold tracking-tight md:text-6xl">
                Content Sync
              </h1>
              <p className="text-muted-foreground font-body text-xl md:text-2xl">
                Synchronize blog posts from Contentful to the vector database for AI-powered search.
              </p>
            </div>
            <Link href="/en-US/admin/status">
              <Button variant="outline" className="font-body">
                View Status
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-border my-8 border-t" />

        {/* Sync Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Sync Single Post</CardTitle>
              <CardDescription className="font-body">
                Sync a specific blog post by slug
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-body mb-2 block text-sm font-medium">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="my-blog-post"
                  className="border-input bg-background font-body w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="font-body mb-2 block text-sm font-medium">Locale</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-body w-full justify-start">
                      {locale === 'en-US' ? 'English (en-US)' : 'German (de-DE)'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setLocale('en-US')}>
                      English (en-US)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocale('de-DE')}>
                      German (de-DE)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button onClick={handleSyncSingle} disabled={loading} className="font-body">
                {loading ? 'Syncing...' : 'Sync Single Post'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Sync All Posts</CardTitle>
              <CardDescription className="font-body">
                Sync all blog posts for a locale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-body mb-2 block text-sm font-medium">Locale</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-body w-full justify-start">
                      {locale === 'en-US' ? 'English (en-US)' : 'German (de-DE)'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setLocale('en-US')}>
                      English (en-US)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocale('de-DE')}>
                      German (de-DE)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                onClick={handleSyncAll}
                disabled={loading}
                variant="destructive"
                className="font-body"
              >
                {loading ? 'Syncing...' : 'Sync All Posts'}
              </Button>
              <p className="text-muted-foreground font-body text-sm">
                This will sync all blog posts and may take several minutes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Result Display */}
        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted overflow-auto rounded-md p-4 font-mono text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </Container>
    </BlurFade>
  );
}
