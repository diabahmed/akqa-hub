import { cn } from '@src/lib/utils';

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  full: 'max-w-full',
};

export function ContentCard({
  children,
  className,
  withPadding = true,
  maxWidth = '6xl',
}: ContentCardProps) {
  return (
    <div
      className={cn(
        'no-scrollbar group bg-background relative w-full overflow-hidden rounded-lg border drop-shadow-md transition-all hover:drop-shadow-xl sm:m-2',
        maxWidthClasses[maxWidth],
        withPadding && 'p-6 md:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
