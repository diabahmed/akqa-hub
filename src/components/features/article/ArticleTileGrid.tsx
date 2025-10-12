import { HTMLProps } from 'react';

import { ArticleTile } from '@src/components/features/article/ArticleTile';
import { PageBlogPostFieldsFragment } from '@src/lib/__generated/sdk';
import { cn } from '@src/lib/utils';

interface ArticleTileGridProps extends HTMLProps<HTMLDivElement> {
  articles?: Array<PageBlogPostFieldsFragment | null>;
}

export const ArticleTileGrid = ({ articles, className, ...props }: ArticleTileGridProps) => {
  const staggerClasses = [
    'fade-in-3',
    'fade-in-4',
    'fade-in-5',
    'fade-in-6',
    'fade-in-6',
    'fade-in-6',
  ];

  return articles && articles.length > 0 ? (
    <div
      className={cn(
        'grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3 lg:gap-x-12 lg:gap-y-12',
        className,
      )}
      {...props}
    >
      {articles.map((article, index) => {
        return article ? (
          <ArticleTile
            key={article.slug || index}
            article={article}
            className={staggerClasses[index] || 'fade-in-6'}
          />
        ) : null;
      })}
    </div>
  ) : null;
};
