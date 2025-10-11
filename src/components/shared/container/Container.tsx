import { HTMLProps } from 'react';

import { cn } from '@src/lib/utils';

export const Container = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'mx-auto min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,260px))] max-w-4xl space-y-12 py-12',
        className,
      )}
      {...props}
    />
  );
};
