import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import Pattern from '@src/components/custom/pattern';
import { ArticleContent, ArticleHero } from '@src/components/features/article';
import { Container } from '@src/components/shared/container';
import { defaultLocale, locales } from '@src/i18n/config';
import { client, previewClient } from '@src/lib/client';

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const gqlClient = preview ? previewClient : client;

  const { pageBlogPostCollection } = await gqlClient.pageBlogPost({ locale, slug, preview });
  const blogPost = pageBlogPostCollection?.items[0];

  const languages = Object.fromEntries(
    locales.map(locale => [locale, locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`]),
  );
  const metadata: Metadata = {
    alternates: {
      canonical: slug,
      languages,
    },
  };

  if (blogPost?.seoFields) {
    metadata.title = blogPost.seoFields.pageTitle;
    metadata.description = blogPost.seoFields.pageDescription;
    metadata.robots = {
      follow: !blogPost.seoFields.nofollow,
      index: !blogPost.seoFields.noindex,
    };
  }

  return metadata;
}

export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<{ locale: string; slug: string }[]> {
  const gqlClient = client;
  const { pageBlogPostCollection } = await gqlClient.pageBlogPostCollection({ locale, limit: 100 });

  if (!pageBlogPostCollection?.items) {
    throw new Error('No blog posts found');
  }

  return pageBlogPostCollection.items
    .filter((blogPost): blogPost is NonNullable<typeof blogPost> => Boolean(blogPost?.slug))
    .map(blogPost => {
      return {
        locale,
        slug: blogPost.slug!,
      };
    });
}

interface BlogPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function Page({ params }: BlogPageProps) {
  const { locale, slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const gqlClient = preview ? previewClient : client;
  const { pageBlogPostCollection } = await gqlClient.pageBlogPost({ locale, slug, preview });
  const { pageLandingCollection } = await gqlClient.pageLanding({ locale, preview });
  const landingPage = pageLandingCollection?.items[0];
  const blogPost = pageBlogPostCollection?.items[0];
  const isFeatured = Boolean(
    blogPost?.slug && landingPage?.featuredBlogPost?.slug === blogPost.slug,
  );

  if (!blogPost) {
    notFound();
  }

  return (
    <>
      <Container className="max-w-4xl">
        <ArticleHero article={blogPost} isFeatured={isFeatured} variant="flat" />
      </Container>
      <Container className="-pb-2 max-w-4xl pt-8 pb-0">
        <ArticleContent article={blogPost} />
      </Container>
      <Pattern />
    </>
  );
}
