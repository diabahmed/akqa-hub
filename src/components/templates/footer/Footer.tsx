'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Balancer from 'react-wrap-balancer';

import { Section, Container } from '../../ui/crafts';

export const Footer = () => {
  const { resolvedTheme, theme } = useTheme();

  // Use resolvedTheme if available, fall back to theme, default to 'dark' for safety
  const currentTheme = resolvedTheme || theme || 'dark';
  const logoSrc = currentTheme === 'dark' ? '/assets/svg/logo.svg' : '/assets/svg/logo-dark.svg';

  return (
    <footer className="not-prose border-t">
      <Section className="bg-background">
        <Container className="grid gap-6">
          <div className="grid gap-6">
            <Link href="/">
              <h3 className="sr-only">diabahmed/akqa-hub</h3>
              <Image
                src={logoSrc}
                alt="Logo"
                width={60}
                height={60}
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
