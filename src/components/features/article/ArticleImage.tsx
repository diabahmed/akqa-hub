'use client';

import { useContentfulInspectorMode } from '@contentful/live-preview/react';

import { CtfImage } from '@src/components/features/contentful';
import { ComponentRichImage } from '@src/lib/__generated/sdk';
import { cn } from '@src/lib/utils';

interface ArticleImageProps {
  image: ComponentRichImage;
}

export const ArticleImage = ({ image }: ArticleImageProps) => {
  const inspectorProps = useContentfulInspectorMode({ entryId: image.sys.id });
  return image.image ? (
    <figure>
      <div className="flex justify-center" {...inspectorProps({ fieldId: 'image' })}>
        <CtfImage
          nextImageProps={{
            className: cn(
              'w-full',
              image.fullWidth ? 'md:w-screen md:max-w-[calc(100vw-40px)] md:shrink-0' : '',
            ),
          }}
          {...image.image}
        />
      </div>
      {image.caption && (
        <figcaption
          className="text-muted-foreground mt-2 mb-4 text-center text-sm italic"
          {...inspectorProps({ fieldId: 'caption' })}
        >
          {image.caption}
        </figcaption>
      )}
    </figure>
  ) : null;
};
