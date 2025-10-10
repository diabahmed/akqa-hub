import type { Metadata } from 'next';

import { Container } from '@src/components/shared/container';
import {
  ButtonSizesExample,
  CopyButtonExample,
  LikeButtonExample,
  MultiStateButtonExample,
  RatingButtonExample,
} from '@src/components/ui/animated-icon-button';

export const metadata: Metadata = {
  title: 'Animated Icon Button Examples',
  description: 'Test page showcasing all AnimatedIconButton component variations',
};

export default function AnimatedIconButtonTestPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Animated Icon Button Examples</h1>
          <p className="text-muted-foreground text-lg">
            Interactive examples showcasing the AnimatedIconButton component with smooth icon
            transitions.
          </p>
        </div>

        {/* Example 1: Copy Button */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Copy Button</h2>
            <p className="text-muted-foreground text-sm">
              Click to copy text. The icon animates from Copy to Check with a smooth transition.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CopyButtonExample />
            <span className="text-muted-foreground text-sm">
              Click the button to see the animation
            </span>
          </div>
        </section>

        {/* Example 2: Like Button */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Like Button</h2>
            <p className="text-muted-foreground text-sm">
              Toggle between liked and unliked states with color and variant changes.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LikeButtonExample />
            <span className="text-muted-foreground text-sm">Click to toggle the like state</span>
          </div>
        </section>

        {/* Example 3: Rating Button */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Rating Button</h2>
            <p className="text-muted-foreground text-sm">
              Star rating with custom animation duration and bounce effect.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <RatingButtonExample />
            <span className="text-muted-foreground text-sm">
              Click to star/unstar with bouncy animation
            </span>
          </div>
        </section>

        {/* Example 4: Multi-State Button */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Multi-State Button</h2>
            <p className="text-muted-foreground text-sm">
              Cycles through multiple states: neutral → thumbs up → thumbs down → neutral
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MultiStateButtonExample />
            <span className="text-muted-foreground text-sm">Click to cycle through states</span>
          </div>
        </section>

        {/* Example 5: Button Sizes */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Button Sizes</h2>
            <p className="text-muted-foreground text-sm">
              Available sizes: small, default, and large icon buttons.
            </p>
          </div>
          <div className="space-y-4">
            <ButtonSizesExample />
            <div className="text-muted-foreground flex gap-8 text-xs">
              <span>Small (32px)</span>
              <span>Default (36px)</span>
              <span>Large (40px)</span>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Usage</h2>
            <p className="text-muted-foreground text-sm">
              Basic example of how to use the AnimatedIconButton component with the useClipboard
              hook:
            </p>
          </div>
          <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
            <code>{`import { Check, Copy } from 'lucide-react';
import { AnimatedIconButton } from '@src/components/ui/animated-icon-button';
import { useClipboard } from '@src/hooks/use-clipboard';

function CopyButton() {
  const { isCopied, copy } = useClipboard();

  const handleCopy = () => {
    copy('Text to copy');
  };

  return (
    <AnimatedIconButton
      onClick={handleCopy}
      icon={isCopied ? <Check /> : <Copy />}
      iconKey={isCopied ? 'check' : 'copy'}
      variant="outline"
    />
  );
}`}</code>
          </pre>
        </section>

        {/* Props Documentation */}
        <section className="bg-card space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Props</h2>
            <p className="text-muted-foreground text-sm">
              Available props for the AnimatedIconButton component:
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pr-4 pb-2 font-semibold">Prop</th>
                  <th className="pr-4 pb-2 font-semibold">Type</th>
                  <th className="pr-4 pb-2 font-semibold">Default</th>
                  <th className="pb-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-4 font-mono">icon</td>
                  <td className="py-2 pr-4">React.ReactNode</td>
                  <td className="py-2 pr-4">-</td>
                  <td className="py-2">The icon to display</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">iconKey</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">-</td>
                  <td className="py-2">Unique key to trigger animation on change</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">variant</td>
                  <td className="py-2 pr-4">ButtonVariant</td>
                  <td className="py-2 pr-4">&apos;default&apos;</td>
                  <td className="py-2">Button style variant</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">size</td>
                  <td className="py-2 pr-4">ButtonSize</td>
                  <td className="py-2 pr-4">&apos;icon&apos;</td>
                  <td className="py-2">Button size</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">animationDuration</td>
                  <td className="py-2 pr-4">number</td>
                  <td className="py-2 pr-4">0.3</td>
                  <td className="py-2">Animation duration in seconds</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">animationBounce</td>
                  <td className="py-2 pr-4">number</td>
                  <td className="py-2 pr-4">0</td>
                  <td className="py-2">Spring animation bounce value</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Container>
  );
}
