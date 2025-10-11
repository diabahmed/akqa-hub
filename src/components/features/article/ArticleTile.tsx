'use client';

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';
import Link from 'next/link';
import { HTMLProps } from 'react';

import { ArticleAuthor } from '@src/components/features/article/ArticleAuthor';
import { CtfImage } from '@src/components/features/contentful';
import { FormatDate } from '@src/components/shared/format-date';
import { Card, CardContent } from '@src/components/ui/card';
import { PageBlogPostFieldsFragment } from '@src/lib/__generated/sdk';
import { cn } from '@src/lib/utils';

interface ArticleTileProps extends HTMLProps<HTMLDivElement> {
  article: PageBlogPostFieldsFragment;
}

export const ArticleTile = ({ article, className }: ArticleTileProps) => {
  const { featuredImage, publishedDate, slug, title } = useContentfulLiveUpdates(article);
  const inspectorProps = useContentfulInspectorMode({ entryId: article.sys.id });

  return (
    <Link className="flex flex-col" href={`/${slug}`}>
      <Card
        className={cn(
          'border-gray300 flex flex-1 flex-col gap-0 overflow-hidden rounded-2xl shadow-lg',
          className,
        )}
      >
        {featuredImage && (
          <div {...inspectorProps({ fieldId: 'featuredImage' })}>
            <CtfImage
              nextImageProps={{ className: 'object-cover aspect-16/10 w-full' }}
              {...featuredImage}
            />
          </div>
        )}
        <CardContent className="flex flex-1 flex-col px-4 py-3 md:px-5 md:py-4 lg:px-7 lg:py-5">
          {title && (
            <p className="h3 text-gray800 mb-2 md:mb-3" {...inspectorProps({ fieldId: 'title' })}>
              {title}
            </p>
          )}

          <div className="mt-auto flex items-center">
            <ArticleAuthor article={article} />
            <div
              className={cn('text-gray600 ml-auto pl-2 text-xs')}
              {...inspectorProps({ fieldId: 'publishedDate' })}
            >
              <FormatDate date={publishedDate} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
