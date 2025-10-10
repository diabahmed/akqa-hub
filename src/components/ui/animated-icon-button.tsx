'use client';

import type { VariantProps } from 'class-variance-authority';
import { Check, Copy, Heart, Star, ThumbsUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { Button, buttonVariants } from '@src/components/ui/button';
import { useClipboard } from '@src/hooks/use-clipboard';
import { cn } from '@src/lib/utils';

type AnimatedIconButtonProps = Omit<React.ComponentProps<typeof Button>, 'children'> &
  VariantProps<typeof buttonVariants> & {
    /**
     * The current icon to display
     */
    icon: React.ReactNode;
    /**
     * Unique key to trigger animation on change
     * When this key changes, the icon will animate out and the new one will animate in
     */
    iconKey?: string;
    /**
     * Animation duration in seconds
     * @default 0.3
     */
    animationDuration?: number;
    /**
     * Animation spring bounce
     * @default 0
     */
    animationBounce?: number;
  };

const AnimatedIconButton = React.forwardRef<HTMLButtonElement, AnimatedIconButtonProps>(
  (
    {
      icon,
      iconKey,
      animationDuration = 0.3,
      animationBounce = 0,
      className,
      variant,
      size = 'icon',
      ...props
    },
    ref,
  ) => {
    // Use iconKey if provided, otherwise use a stable key
    const key = iconKey ?? 'static';

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('relative cursor-pointer overflow-hidden', className)}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
            transition={{
              type: 'spring',
              duration: animationDuration,
              bounce: animationBounce,
            }}
            className="flex items-center justify-center"
          >
            {icon}
          </motion.div>
        </AnimatePresence>
      </Button>
    );
  },
);

AnimatedIconButton.displayName = 'AnimatedIconButton';

export { AnimatedIconButton };
export type { AnimatedIconButtonProps };

/**
 * Example 1: Basic Copy Button with State Toggle
 */
export function CopyButtonExample() {
  const { isCopied, copy } = useClipboard();

  const handleCopy = () => {
    copy('Hello! This text was copied using the useClipboard hook.');
  };

  return (
    <AnimatedIconButton
      onClick={handleCopy}
      icon={isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
      iconKey={isCopied ? 'check' : 'copy'}
      variant="outline"
      aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
    />
  );
}

/**
 * Example 2: Like Button with Different Variants
 */
export function LikeButtonExample() {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <AnimatedIconButton
      onClick={() => setIsLiked(!isLiked)}
      icon={<Heart className={`size-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />}
      iconKey={isLiked ? 'liked' : 'unliked'}
      variant={isLiked ? 'default' : 'ghost'}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    />
  );
}

/**
 * Example 3: Rating Button with Custom Animation
 */
export function RatingButtonExample() {
  const [isStarred, setIsStarred] = React.useState(false);

  return (
    <AnimatedIconButton
      onClick={() => setIsStarred(!isStarred)}
      icon={<Star className={`size-4 ${isStarred ? 'fill-current text-yellow-500' : ''}`} />}
      iconKey={isStarred ? 'starred' : 'unstarred'}
      variant="outline"
      size="icon-lg"
      animationDuration={0.5}
      animationBounce={0.4}
      aria-label={isStarred ? 'Unstar' : 'Star'}
    />
  );
}

/**
 * Example 4: Multiple State Button
 */
export function MultiStateButtonExample() {
  const [state, setState] = React.useState<'neutral' | 'thumbsup' | 'thumbsdown'>('neutral');

  const getIcon = () => {
    switch (state) {
      case 'thumbsup':
        return <ThumbsUp className="size-4 fill-current" />;
      case 'thumbsdown':
        return <ThumbsUp className="size-4 rotate-180 fill-current" />;
      default:
        return <ThumbsUp className="size-4" />;
    }
  };

  const handleClick = () => {
    setState(current => {
      if (current === 'neutral') return 'thumbsup';
      if (current === 'thumbsup') return 'thumbsdown';
      return 'neutral';
    });
  };

  return (
    <AnimatedIconButton
      onClick={handleClick}
      icon={getIcon()}
      iconKey={state}
      variant={state === 'neutral' ? 'ghost' : 'default'}
      aria-label="Vote"
    />
  );
}

/**
 * Example 5: Different Sizes
 */
export function ButtonSizesExample() {
  const { isCopied, copy } = useClipboard();

  const handleCopy = () => {
    copy('Copied from size example buttons!');
  };

  return (
    <div className="flex items-center gap-4">
      <AnimatedIconButton
        onClick={handleCopy}
        icon={isCopied ? <Check /> : <Copy />}
        iconKey={isCopied ? 'check' : 'copy'}
        size="icon-sm"
        variant="outline"
      />
      <AnimatedIconButton
        onClick={handleCopy}
        icon={isCopied ? <Check /> : <Copy />}
        iconKey={isCopied ? 'check' : 'copy'}
        size="icon"
        variant="outline"
      />
      <AnimatedIconButton
        onClick={handleCopy}
        icon={isCopied ? <Check /> : <Copy />}
        iconKey={isCopied ? 'check' : 'copy'}
        size="icon-lg"
        variant="outline"
      />
    </div>
  );
}
