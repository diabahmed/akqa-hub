'use client';

import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { LanguageSelector } from '@src/components/features/language-selector/LanguageSelector';
import { AnimatedThemeToggler } from '@src/components/ui/animated-theme-toggler';

export const Header = () => {
  const { scrollY } = useScroll();
  const { resolvedTheme } = useTheme();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const logoSrc = resolvedTheme === 'dark' ? '/assets/svg/logo.svg' : '/assets/svg/logo-dark.svg';

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
          <h3 className="sr-only">diabahmed/akqa-hub</h3>
          <Image
            src={logoSrc}
            alt="Logo"
            width={40}
            height={40}
            className="transition-all hover:opacity-75"
          />
        </Link>
      </h1>
      <NavList />
    </motion.nav>
  );
};

const NavList = () => {
  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-1">
        <AnimatedThemeToggler />
        <LanguageSelector />
      </div>
    </div>
  );
};
