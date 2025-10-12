'use client';

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';

import { ArticleAuthor } from '@src/components/features/article/ArticleAuthor';
import { CtfImage } from '@src/components/features/contentful';
import { ContentCard } from '@src/components/shared/content-card';
import { FormatDate } from '@src/components/shared/format-date';
import { Tilt } from '@src/components/ui/tilt';
import { PageBlogPostFieldsFragment } from '@src/lib/__generated/sdk';
import { cn } from '@src/lib/utils';

interface ArticleHeroProps {
  article: PageBlogPostFieldsFragment;
  isFeatured?: boolean;
  isReversedLayout?: boolean;
  locale?: string;
  variant?: 'card' | 'flat';
}

export const ArticleHero = ({
  article,
  isFeatured = false,
  isReversedLayout = false,
  variant = 'card',
}: ArticleHeroProps) => {
  const inspectorProps = useContentfulInspectorMode({ entryId: article.sys.id });
  const { title, shortDescription, publishedDate } = useContentfulLiveUpdates(article);

  // Flat variant for individual blog pages (journal/sketch style)
  if (variant === 'flat') {
    return (
      <div className="space-y-6">
        {/* Header section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ArticleAuthor article={article} />
            <div
              className="text-muted-foreground ml-auto text-sm"
              {...inspectorProps({ fieldId: 'publishedDate' })}
            >
              <FormatDate date={publishedDate} />
            </div>
          </div>

          <h1
            className="font-heading text-4xl leading-tight font-bold md:text-5xl lg:text-6xl"
            {...inspectorProps({ fieldId: 'title' })}
          >
            {title}
          </h1>

          {shortDescription && (
            <p
              className="blog-subtitle text-muted-foreground"
              {...inspectorProps({ fieldId: 'shortDescription' })}
            >
              {shortDescription}
            </p>
          )}
        </div>

        {/* Featured image - full bleed, sketch-like */}
        <div
          className="relative -mx-4 overflow-hidden xl:-mx-0 xl:rounded-lg"
          {...inspectorProps({ fieldId: 'featuredImage' })}
        >
          {article.featuredImage && (
            <CtfImage
              nextImageProps={{
                className: 'w-full aspect-video object-cover',
                priority: true,
                sizes: undefined,
              }}
              {...article.featuredImage}
            />
          )}
        </div>
      </div>
    );
  }

  // Card variant for main page (blog selection)
  const cardContent = (
    <ContentCard
      withPadding={false}
      className={cn(
        'group flex flex-col overflow-hidden transition-all duration-300 ease-out hover:scale-[1.01]',
        isReversedLayout ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div
        className="flex-1 basis-1/2 overflow-hidden"
        {...inspectorProps({ fieldId: 'featuredImage' })}
      >
        {article.featuredImage && (
          <CtfImage
            nextImageProps={{
              className:
                'w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]',
              priority: true,
              sizes: undefined,
            }}
            {...article.featuredImage}
          />
        )}
      </div>

      <div className="relative flex flex-1 basis-1/2 flex-col justify-center px-6 py-8 lg:px-12 lg:py-12 xl:px-16">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <ArticleAuthor article={article} />
          <div
            className={cn(
              'text-muted-foreground ml-auto hidden text-sm lg:block',
              isReversedLayout ? '' : '',
            )}
            {...inspectorProps({ fieldId: 'publishedDate' })}
          >
            <FormatDate date={publishedDate} />
          </div>
        </div>

        <h2
          className="font-heading mb-3 text-2xl font-bold md:text-3xl lg:text-4xl"
          {...inspectorProps({ fieldId: 'title' })}
        >
          {title}
        </h2>

        {shortDescription && (
          <p
            className="text-muted-foreground mb-3 line-clamp-3"
            {...inspectorProps({ fieldId: 'shortDescription' })}
          >
            {shortDescription}
          </p>
        )}

        <div
          className="text-muted-foreground text-sm lg:hidden"
          {...inspectorProps({ fieldId: 'publishedDate' })}
        >
          <FormatDate date={publishedDate} />
        </div>
      </div>
    </ContentCard>
  );

  // Wrap with Tilt if it's the featured article
  if (isFeatured) {
    return (
      <Tilt rotationFactor={4} isRevese>
        {cardContent}
      </Tilt>
    );
  }

  return cardContent;
};
