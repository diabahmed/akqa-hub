'use client';

import { Check } from 'lucide-react';
import type { ComponentProps } from 'react';

import { AnimatedIconButton } from '@src/components/ui/animated-icon-button';
import { Button } from '@src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@src/components/ui/tooltip';
import { useClipboard } from '@src/hooks/use-clipboard';
import { cn } from '@src/lib/utils';

export type ActionsProps = ComponentProps<'div'>;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
  copyText?: string;
};

export const Action = ({
  tooltip,
  children,
  label,
  copyText,
  className,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ...props
}: ActionProps) => {
  const { isCopied, copy } = useClipboard();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (copyText) {
      copy(copyText);
    }
    onClick?.(e);
  };

  // Determine the icon and key for animation
  const icon = copyText && isCopied ? <Check className="size-3" /> : children;
  const iconKey = copyText ? (isCopied ? 'check' : 'copy') : undefined;

  const button = (
    <AnimatedIconButton
      icon={icon}
      iconKey={iconKey}
      className={cn('text-muted-foreground hover:text-foreground relative size-9 p-1.5', className)}
      size={size}
      type="button"
      variant={variant}
      onClick={handleClick}
      aria-label={label || tooltip}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{isCopied && copyText ? 'Copied!' : tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
