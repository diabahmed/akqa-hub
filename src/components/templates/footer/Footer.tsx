'use client';

import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';

import { Section, Container } from '../../ui/crafts';

import { Link001 } from '@src/components/custom/link';
import DottedGlowBackground from '@src/components/ui/dotted-glow-background';

export const Footer = () => {
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
              <h3 className="sr-only">akqa-hub</h3>
              {/* Light theme logo */}
              <Image
                src="/assets/svg/logo-dark.svg"
                alt="Logo"
                width={60}
                height={60}
                className="transition-all hover:opacity-75 dark:hidden"
                suppressHydrationWarning
              />
              {/* Dark theme logo */}
              <Image
                src="/assets/svg/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="hidden transition-all hover:opacity-75 dark:block"
                suppressHydrationWarning
              />
            </Link>
            <p>
              <Balancer>
                akqa-hub is where stories meet intelligence. Curated content, thoughtful
                recommendations, conversations that matter.
              </Balancer>
            </p>
            <p className="text-muted-foreground">
              © <a href="https://github.com/diabahmed">akqa-hub</a>. all rights reserved 2025.
              Music by{' '}
              <Link001
                href="https://www.hammockmusic.com/columbus-soundtrack"
                className="inline-flex font-serif font-extralight italic"
              >
                Hammock
              </Link001>
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
