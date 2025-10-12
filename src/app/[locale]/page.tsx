import { GrainGradient } from '@paper-design/shaders-react';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Balancer from 'react-wrap-balancer';

import { ArticleHero, ArticleTileGrid } from '@src/components/features/article';
import { Container } from '@src/components/shared/container';
import TranslationsProvider from '@src/components/shared/i18n/TranslationProvider';
import { SpinningText } from '@src/components/ui/spinning-text';
import initTranslations from '@src/i18n';
import { defaultLocale, locales } from '@src/i18n/config';
import { PageBlogPostOrder } from '@src/lib/__generated/sdk';
import { client, previewClient } from '@src/lib/client';

interface LandingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { isEnabled: preview } = await draftMode();
  const gqlClient = preview ? previewClient : client;
  const landingPageData = await gqlClient.pageLanding({ locale, preview });
  const page = landingPageData.pageLandingCollection?.items[0];

  const languages = Object.fromEntries(
    locales.map(locale => [locale, locale === defaultLocale ? '/' : `/${locale}`]),
  );
  const metadata: Metadata = {
    alternates: {
      canonical: '/',
      languages: languages,
    },
  };
  if (page?.seoFields) {
    metadata.title = page.seoFields.pageTitle;
    metadata.description = page.seoFields.pageDescription;
    metadata.robots = {
      follow: !page.seoFields.nofollow,
      index: !page.seoFields.noindex,
    };
  }

  return metadata;
}

export default async function Page({ params }: LandingPageProps) {
  const { locale } = await params;
  const { isEnabled: preview } = await draftMode();
  const { t, resources } = await initTranslations({ locale });
  const gqlClient = preview ? previewClient : client;

  const landingPageData = await gqlClient.pageLanding({ locale, preview });
  const page = landingPageData.pageLandingCollection?.items[0];

  if (!page) {
    notFound();
  }

  const blogPostsData = await gqlClient.pageBlogPostCollection({
    limit: 6,
    locale,
    order: PageBlogPostOrder.PublishedDateDesc,
    where: {
      slug_not: page?.featuredBlogPost?.slug,
    },
    preview,
  });
  const posts = blogPostsData.pageBlogPostCollection?.items;

  if (!page?.featuredBlogPost || !posts) {
    return;
  }

  return (
    <TranslationsProvider locale={locale} resources={resources}>
      <Container className="space-y-12">
        {/* Featured Article */}
        <section className="fade-in-1">
          <Link href={`/${page.featuredBlogPost.slug}`}>
            <ArticleHero article={page.featuredBlogPost} isFeatured variant="card" />
          </Link>
        </section>

        {/* Latest Articles */}
        <section className="fade-in-2">
          <div className="mb-8 flex items-center gap-0.5">
            <SpinningText
              radius={3.5}
              duration={10}
              className="text-primary h-20 w-20 shrink-0 font-serif text-[10px] font-semibold tracking-widest"
            >
              • NEW • LATEST • FRESH
            </SpinningText>
            <div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">
                {t('landingPage.latestArticles')}
              </h2>
            </div>
          </div>
          <ArticleTileGrid className="md:grid-cols-2 lg:grid-cols-3" articles={posts} />
        </section>

        {/* Quote Section */}
        <section className="fade-in-3">
          <div className="relative overflow-hidden rounded-lg border p-8 shadow-sm md:p-12 lg:p-16">
            {/* Shader Background */}
            <div className="absolute inset-0">
              <GrainGradient
                width={1280}
                height={720}
                colors={['#000000', '#ffffff']}
                colorBack="#000000"
                softness={0.75}
                intensity={0.15}
                noise={0.5}
                shape="wave"
                speed={1.7}
                rotation={28}
                offsetY={0.25}
              />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <p className="mb-6 font-serif text-xs font-semibold tracking-widest text-white/60 uppercase">
                The larger picture
              </p>
              <blockquote className="font-heading text-3xl leading-tight font-light text-white md:text-4xl lg:text-5xl">
                <Balancer>
                  &ldquo;In a world of scarcity, we treasure{' '}
                  <span className="text-white">tools</span>.
                  <br />
                  In a world of abundance, we treasure{' '}
                  <span className="font-extralight text-white italic">taste</span>&rdquo;
                </Balancer>
              </blockquote>
              <footer className="mt-8 flex flex-col items-center gap-4">
                <div className="space-y-1 text-center">
                  <p className="font-body text-sm font-semibold text-white">Anu Atluru</p>
                  <Link
                    href="https://www.workingtheorys.com/p/taste-is-eating-silicon-valley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    The Working Theory
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </Container>
    </TranslationsProvider>
  );
}
