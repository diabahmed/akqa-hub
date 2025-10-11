import { HTMLProps, ReactNode } from 'react';

import { Badge } from '@src/components/ui/badge';
import { cn } from '@src/lib/utils';

interface ArticleLabelProps extends HTMLProps<HTMLSpanElement> {
  children: ReactNode;
}

export const ArticleLabel = ({ children, className, ...props }: ArticleLabelProps) => {
  return (
    <Badge
      className={cn(
        'bg-purple200 text-2xs text-purple600 rounded-sm px-2 py-1 leading-none font-semibold tracking-widest uppercase',
        className,
      )}
      {...props}
    >
      {children}
    </Badge>
  );
};
