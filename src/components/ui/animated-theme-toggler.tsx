'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { AnimatedIconButton } from '@src/components/ui/animated-icon-button';

interface AnimatedThemeTogglerProps {
  duration?: number;
  className?: string;
}

export const AnimatedThemeToggler = ({ className, duration = 300 }: AnimatedThemeTogglerProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    // Check if browser supports View Transition API
    if (!document.startViewTransition) {
      // Fallback: just toggle the theme without animation
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      return;
    }

    // Determine the direction of the transition
    const isDarkNow = resolvedTheme === 'dark';

    // Get button position before starting transition
    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Start the view transition
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = isDarkNow ? 'light' : 'dark';
        setTheme(newTheme);
      });
    });

    // Wait for transition to be ready, then apply custom animation
    await transition.ready;

    // Animate the appropriate layer based on direction
    // When going to dark mode, animate the new (dark) layer
    // When going to light mode, animate the new (light) layer
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }, [resolvedTheme, duration, setTheme]);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <AnimatedIconButton
      ref={buttonRef}
      onClick={toggleTheme}
      icon={isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      iconKey={isDark ? 'sun' : 'moon'}
      variant="ghost"
      aria-label="Toggle theme"
      className={className}
    />
  );
};
