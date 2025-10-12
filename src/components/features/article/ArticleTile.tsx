'use client';

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';
import Link from 'next/link';
import { HTMLProps } from 'react';

import { ArticleAuthor } from '@src/components/features/article/ArticleAuthor';
import { CtfImage } from '@src/components/features/contentful';
import { ContentCard } from '@src/components/shared/content-card';
import { FormatDate } from '@src/components/shared/format-date';
import { PageBlogPostFieldsFragment } from '@src/lib/__generated/sdk';
import { cn } from '@src/lib/utils';

interface ArticleTileProps extends HTMLProps<HTMLDivElement> {
  article: PageBlogPostFieldsFragment;
}

export const ArticleTile = ({ article, className }: ArticleTileProps) => {
  const { featuredImage, publishedDate, slug, title, shortDescription } =
    useContentfulLiveUpdates(article);
  const inspectorProps = useContentfulInspectorMode({ entryId: article.sys.id });

  return (
    <Link className="flex flex-col" href={`/${slug}`}>
      <ContentCard
        withPadding={false}
        className={cn(
          'group flex h-full flex-col transition-all duration-300 ease-out hover:scale-[1.02]',
          className,
        )}
      >
        {featuredImage && (
          <div className="overflow-hidden" {...inspectorProps({ fieldId: 'featuredImage' })}>
            <CtfImage
              nextImageProps={{
                className:
                  'object-cover aspect-16/10 w-full transition-transform duration-300 ease-out group-hover:scale-[1.02]',
              }}
              {...featuredImage}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-5">
          {title && (
            <h3
              className="font-heading mb-2 text-xl font-bold md:mb-3 md:text-2xl"
              {...inspectorProps({ fieldId: 'title' })}
            >
              {title}
            </h3>
          )}

          {shortDescription && (
            <p
              className="text-muted-foreground mb-4 line-clamp-2 text-sm"
              {...inspectorProps({ fieldId: 'shortDescription' })}
            >
              {shortDescription}
            </p>
          )}

          <div className="mt-auto flex items-center border-t pt-3">
            <ArticleAuthor article={article} />
            <div
              className={cn('text-muted-foreground ml-auto pl-2 text-xs')}
              {...inspectorProps({ fieldId: 'publishedDate' })}
            >
              <FormatDate date={publishedDate} />
            </div>
          </div>
        </div>
      </ContentCard>
    </Link>
  );
};
