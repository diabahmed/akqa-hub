'use client';

import { type ComponentProps, memo } from 'react';
import { harden } from 'rehype-harden';
import { defaultRehypePlugins, Streamdown } from 'streamdown';

import { cn } from '@src/lib/utils';

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        // Link styling - make links clearly visible and interactive
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
        '[&_a]:decoration-primary/50 [&_a]:transition-colors',
        '[&_a:hover]:text-primary/80 [&_a:hover]:decoration-primary',
        '[&_a]:cursor-pointer [&_a]:font-medium',
        className,
      )}
      rehypePlugins={[
        defaultRehypePlugins.raw,
        defaultRehypePlugins.katex,
        [
          harden,
          {
            defaultOrigin: typeof window !== 'undefined' ? window.location.origin : '',
            allowedLinkPrefixes: ['mailto:', '*'],
          },
        ],
      ]}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = 'Response';
