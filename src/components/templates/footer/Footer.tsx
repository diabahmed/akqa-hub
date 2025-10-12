'use client';

import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';

import { Section, Container } from '../../ui/crafts';

import { Link001 } from '@src/components/custom/link';
import DottedGlowBackground from '@src/components/ui/dotted-glow-background';
import { TextLoop } from '@src/components/ui/text-loop';

export const Footer = () => {
  return (
    <footer className="not-prose relative border-t">
      <DottedGlowBackground
        className="pointer-events-none opacity-20 dark:opacity-100"
        opacity={0.2}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-800"
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
            <div>
              <Balancer>
                a space where stories meet intelligence. curated content, thoughtful
                recommendations, conversations that{' '}
                <TextLoop
                  className="inline-flex overflow-y-clip"
                  interval={3}
                  transition={{
                    type: 'spring',
                    stiffness: 900,
                    damping: 80,
                    mass: 10,
                  }}
                  variants={{
                    initial: {
                      y: 20,
                      rotateX: 90,
                      opacity: 0,
                      filter: 'blur(4px)',
                    },
                    animate: {
                      y: 0,
                      rotateX: 0,
                      opacity: 1,
                      filter: 'blur(0px)',
                    },
                    exit: {
                      y: -20,
                      rotateX: -90,
                      opacity: 0,
                      filter: 'blur(4px)',
                    },
                  }}
                >
                  <span>matter</span>
                  <span>inspire</span>
                  <span>resonate</span>
                  <span>connect</span>
                  <span>transform</span>
                  <span>enlighten</span>
                  <span>challenge</span>
                  <span>provoke</span>
                  <span>illuminate</span>
                  <span>cultivate</span>
                  <span>transcend</span>
                  <span>evolve</span>
                  <span>amplify</span>
                  <span>catalyze</span>
                  <span>captivate</span>
                </TextLoop>
                .
              </Balancer>
            </div>
            <p className="text-muted-foreground">
              © 2025{' '}
              <a href="https://github.com/diabahmed" target="_blank" rel="noopener noreferrer">
                diabahmed/akqa-hub
              </a>
              . all rights reserved.{' '}
              <span className="text-s">
                music by{' '}
                <Link001
                  href="https://www.hammockmusic.com/columbus-soundtrack"
                  className="font-heading inline-flex font-extralight italic"
                >
                  Hammock
                </Link001>
              </span>
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
