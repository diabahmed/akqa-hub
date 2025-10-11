'use client';

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';

import { CtfImage } from '@src/components/features/contentful';
import { Avatar } from '@src/components/ui/avatar';
import { PageBlogPostFieldsFragment } from '@src/lib/__generated/sdk';

interface ArticleAuthorProps {
  article: PageBlogPostFieldsFragment;
}

export const ArticleAuthor = ({ article }: ArticleAuthorProps) => {
  const { author } = useContentfulLiveUpdates(article);
  const inspectorProps = useContentfulInspectorMode({ entryId: author?.sys.id });

  return (
    <div className="flex items-center">
      <Avatar
        className="border-blue500 mr-2 size-7 border"
        {...inspectorProps({ fieldId: 'avatar' })}
      >
        {author?.avatar && (
          <CtfImage
            nextImageProps={{
              width: 28,
              height: 28,
              sizes: undefined,
              placeholder: undefined,
            }}
            {...author.avatar}
          />
        )}
      </Avatar>
      <span className="text-gray600 text-xs leading-none" {...inspectorProps({ fieldId: 'name' })}>
        {author?.name}
      </span>
    </div>
  );
};
