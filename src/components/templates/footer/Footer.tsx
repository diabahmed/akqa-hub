'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Balancer from 'react-wrap-balancer';

import { Section, Container } from '../../ui/crafts';

import DottedGlowBackground from '@src/components/ui/dotted-glow-background';

export const Footer = () => {
  const { resolvedTheme, theme } = useTheme();

  // Use resolvedTheme if available, fall back to theme, default to 'light' for safety
  const currentTheme = resolvedTheme || theme || 'light';
  const logoSrc = currentTheme === 'dark' ? '/assets/svg/logo.svg' : '/assets/svg/logo-dark.svg';

  return (
    <footer className="not-prose relative border-t">
      <DottedGlowBackground
        className="pointer-events-none opacity-20 dark:opacity-100"
        opacity={0.1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
      <Section className="bg-background">
        <Container className="grid gap-6">
          <div className="grid gap-6">
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
            <p>
              <Balancer>
                diabahmed/akqa-hub is a collection of Next.js, React, Typescript components for
                building landing pages and websites.
              </Balancer>
            </p>
            <p className="text-muted-foreground">
              © <a href="https://github.com/diabahmed">diabahmed/akqa-hub</a>. all rights reserved.
              2025.
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
