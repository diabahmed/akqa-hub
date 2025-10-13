'use client';

import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LanguageSelector } from '@src/components/features/language-selector/LanguageSelector';
import { AnimatedThemeToggler } from '@src/components/ui/animated-theme-toggler';

export const Header = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-125%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-4 right-0 left-0 z-50 mx-auto flex h-fit max-w-6xl items-center justify-between rounded-lg border p-2 backdrop-blur-md"
    >
      <h1 className="ml-2">
        <Link href="/">
          <h3 className="sr-only">akqa-hub</h3>
          {/* Light theme logo */}
          <Image
            src="/assets/svg/logo-dark.svg"
            alt="Logo"
            width={40}
            height={40}
            className="h-8 w-8 transition-all hover:opacity-75 sm:h-10 sm:w-10 dark:hidden"
            suppressHydrationWarning
          />
          {/* Dark theme logo */}
          <Image
            src="/assets/svg/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="hidden h-8 w-8 transition-all hover:opacity-75 sm:h-10 sm:w-10 dark:block"
            suppressHydrationWarning
          />
        </Link>
      </h1>
      <NavList />
    </motion.nav>
  );
};

const links = [
  { name: 'Admin', href: '/admin' },
  { name: 'Buttons', href: '/buttons' },
  { name: 'Typography', href: '/typography' },
];

const NavList = () => {
  const pathname = usePathname();
  const [showDevLinks, setShowDevLinks] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle dev links with Cmd+Shift+D (Mac) or Ctrl+Shift+D (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setShowDevLinks(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex items-center gap-8">
      {showDevLinks && (
        <div className="hidden items-center gap-4 text-sm md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? 'text-muted-foreground pointer-events-none'
                  : 'text-primary/80 hover:text-primary transition-all hover:-mt-px hover:mb-px'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1">
        <AnimatedThemeToggler />
        <LanguageSelector />
      </div>
    </div>
  );
};
