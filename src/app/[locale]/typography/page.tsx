import type { Metadata } from 'next';

import { BlogPostExample } from '@src/components/custom/blog';
import { Container } from '@src/components/shared/container';

export const metadata: Metadata = {
  title: 'Typography System Documentation',
  description:
    'Complete guide to the custom typography system with all available font families and weights',
};

export default function TypographyDemoPage() {
  return (
    <Container>
      {/* Hero Header */}
      <div className="space-y-6 pb-8">
        <div className="space-y-2">
          <p className="font-body text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
            Design System
          </p>
          <h1 className="font-heading text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Typography
          </h1>
          <p className="font-body text-muted-foreground text-xl md:text-2xl">
            A comprehensive guide to fonts, weights, and typography patterns used throughout the
            application.
          </p>
        </div>
      </div>

      <div className="border-border my-8 border-t" />

      {/* Font Families Overview */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Font Families</h2>
          <p className="font-body text-muted-foreground text-lg">
            Five carefully selected typefaces for different use cases, from display to code.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* FK Display */}
          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-semibold">FK Display</h3>
              <code className="text-muted-foreground font-mono text-xs">--font-fk-display</code>
            </div>
            <p className="font-display text-3xl">The quick brown fox</p>
            <p className="font-body text-muted-foreground text-sm">
              Display font for large, attention-grabbing headlines and hero sections. Use sparingly
              for maximum impact.
            </p>
            <div className="space-y-1">
              <p className="font-body text-xs font-semibold tracking-wider uppercase">
                Available Weights
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">400 (Regular)</span>
              </div>
            </div>
          </div>

          {/* PP Editorial New */}
          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-semibold">PP Editorial New</h3>
              <code className="text-muted-foreground font-mono text-xs">
                --font-pp-editorial-new
              </code>
            </div>
            <p className="font-heading text-3xl">The quick brown fox</p>
            <p className="font-body text-muted-foreground text-sm">
              Editorial serif font for titles, headings, and creating typographic hierarchy. Elegant
              and refined.
            </p>
            <div className="space-y-1">
              <p className="font-body text-xs font-semibold tracking-wider uppercase">
                Available Weights
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                  200 (Ultralight)
                </span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">400 (Regular)</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                  800 (Ultrabold)
                </span>
              </div>
            </div>
          </div>

          {/* FK Grotesk */}
          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-semibold">FK Grotesk</h3>
              <code className="text-muted-foreground font-mono text-xs">--font-fk-grotesk</code>
            </div>
            <p className="font-body text-3xl">The quick brown fox</p>
            <p className="font-body text-muted-foreground text-sm">
              Modern sans-serif for UI elements, navigation, buttons, and short text. Clean and
              highly legible.
            </p>
            <div className="space-y-1">
              <p className="font-body text-xs font-semibold tracking-wider uppercase">
                Available Weights
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">100 (Thin)</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">300 (Light)</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">400 (Regular)</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">500 (Medium)</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">700 (Bold)</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">900 (Black)</span>
              </div>
            </div>
          </div>

          {/* Goudy Old Style */}
          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-semibold">Goudy Old Style</h3>
              <code className="text-muted-foreground font-mono text-xs">
                --font-goudy-old-style
              </code>
            </div>
            <p className="font-serif text-3xl">The quick brown fox</p>
            <p className="font-body text-muted-foreground text-sm">
              Classic serif for long-form content, articles, and blog posts. Optimized for
              readability.
            </p>
            <div className="space-y-1">
              <p className="font-body text-xs font-semibold tracking-wider uppercase">
                Available Weights
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">400 (Regular)</span>
              </div>
            </div>
          </div>

          {/* JetBrains Mono */}
          <div className="bg-card space-y-3 rounded-lg border p-6 md:col-span-2">
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-semibold">JetBrains Mono</h3>
              <code className="text-muted-foreground font-mono text-xs">--font-jetbrains-mono</code>
            </div>
            <p className="font-mono text-3xl">The quick brown fox</p>
            <p className="font-body text-muted-foreground text-sm">
              Developer-focused monospace font for code blocks, technical content, and inline code.
              Designed for extended coding sessions.
            </p>
            <div className="space-y-1">
              <p className="font-body text-xs font-semibold tracking-wider uppercase">
                Available Weights
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">100-900</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                  (All weights + Italics)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-border my-12 border-t" />

      {/* Weight Scale Examples */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Font Weight Scale</h2>
          <p className="font-body text-muted-foreground text-lg">
            FK Grotesk weight variations demonstrating the complete range from Thin to Black.
          </p>
        </div>

        <div className="bg-card space-y-4 rounded-lg border p-8">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between border-b pb-2">
              <span className="font-body text-4xl font-thin">The quick brown fox</span>
              <span className="text-muted-foreground font-mono text-sm">100 - Thin</span>
            </div>
            <div className="flex items-baseline justify-between border-b pb-2">
              <span className="font-body text-4xl font-light">The quick brown fox</span>
              <span className="text-muted-foreground font-mono text-sm">300 - Light</span>
            </div>
            <div className="flex items-baseline justify-between border-b pb-2">
              <span className="font-body text-4xl font-normal">The quick brown fox</span>
              <span className="text-muted-foreground font-mono text-sm">400 - Regular</span>
            </div>
            <div className="flex items-baseline justify-between border-b pb-2">
              <span className="font-body text-4xl font-medium">The quick brown fox</span>
              <span className="text-muted-foreground font-mono text-sm">500 - Medium</span>
            </div>
            <div className="flex items-baseline justify-between border-b pb-2">
              <span className="font-body text-4xl font-bold">The quick brown fox</span>
              <span className="text-muted-foreground font-mono text-sm">700 - Bold</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-body text-4xl font-black">The quick brown fox</span>
              <span className="text-muted-foreground font-mono text-sm">900 - Black</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-border my-12 border-t" />

      {/* Utility Classes */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Utility Classes</h2>
          <p className="font-body text-muted-foreground text-lg">
            Tailwind utility classes for applying font families throughout your application.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <code className="text-primary font-mono text-sm font-semibold">font-display</code>
                  <span className="font-body text-muted-foreground text-xs">FK Display</span>
                </div>
                <p className="font-body text-muted-foreground text-sm">
                  For hero sections and large headlines
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <code className="text-primary font-mono text-sm font-semibold">font-heading</code>
                  <span className="font-body text-muted-foreground text-xs">PP Editorial New</span>
                </div>
                <p className="font-body text-muted-foreground text-sm">
                  For titles and section headers
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <code className="text-primary font-mono text-sm font-semibold">font-body</code>
                  <span className="font-body text-muted-foreground text-xs">FK Grotesk</span>
                </div>
                <p className="font-body text-muted-foreground text-sm">
                  For UI elements and short text
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <code className="text-primary font-mono text-sm font-semibold">font-serif</code>
                  <span className="font-body text-muted-foreground text-xs">Goudy Old Style</span>
                </div>
                <p className="font-body text-muted-foreground text-sm">
                  For long-form articles and content
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-baseline justify-between">
                  <code className="text-primary font-mono text-sm font-semibold">font-mono</code>
                  <span className="font-body text-muted-foreground text-xs">JetBrains Mono</span>
                </div>
                <p className="font-body text-muted-foreground text-sm">
                  For code blocks and technical content
                </p>
              </div>
            </div>

            <div className="border-border border-t pt-4">
              <p className="font-body text-muted-foreground mb-3 text-sm font-semibold">
                Example Usage:
              </p>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 font-mono text-sm">
                <code>{`<h1 className="font-heading text-4xl font-bold">
  Article Title
</h1>

<p className="font-body text-base">
  UI text and navigation
</p>

<article className="font-serif text-lg">
  Long-form content...
</article>

<code className="font-mono text-sm">
  const example = "code";
</code>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <div className="border-border my-12 border-t" />

      {/* Component Classes */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Pre-styled Component Classes</h2>
          <p className="font-body text-muted-foreground text-lg">
            Ready-to-use classes for common blog and content patterns with optimized typography
            settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card space-y-3 rounded-lg border p-6">
            <code className="text-primary font-mono text-sm font-semibold">blog-title</code>
            <h1 className="blog-title">Example Blog Title</h1>
            <p className="font-body text-muted-foreground text-sm">
              Large, bold heading for blog post titles. Responsive sizing from 4xl to 6xl.
            </p>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <code className="text-primary font-mono text-sm font-semibold">blog-subtitle</code>
            <p className="blog-subtitle">Example subtitle for additional context</p>
            <p className="font-body text-muted-foreground text-sm">
              Secondary heading with lighter weight. Responsive from 2xl to 3xl.
            </p>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <code className="text-primary font-mono text-sm font-semibold">blog-meta</code>
            <div className="blog-meta">By John Doe • Oct 11, 2025 • 5 min read</div>
            <p className="font-body text-muted-foreground text-sm">
              Metadata information with muted foreground color for author, date, and reading time.
            </p>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <code className="text-primary font-mono text-sm font-semibold">blog-content</code>
            <div className="blog-content text-sm">
              <p>Auto-styled paragraphs and headings within this container.</p>
            </div>
            <p className="font-body text-muted-foreground text-sm">
              Container that automatically styles all child elements (p, h2, h3, h4, code).
            </p>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6 md:col-span-2">
            <code className="text-primary font-mono text-sm font-semibold">display-text</code>
            <p className="display-text text-4xl">Hero Headline</p>
            <p className="font-body text-muted-foreground text-sm">
              Extra large text for hero sections. Responsive sizing from 5xl to 7xl.
            </p>
          </div>
        </div>
      </section>

      <div className="border-border my-12 border-t" />

      <div className="border-border my-12 border-t" />

      {/* Complete Example */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Complete Blog Post Example</h2>
          <p className="font-body text-muted-foreground text-lg">
            A real-world example demonstrating how all typography elements work together in a blog
            post layout.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <BlogPostExample
            title="The Art of Modern Web Typography"
            subtitle="How to create beautiful, readable content on the web"
            author="Jane Designer"
            date="October 11, 2025"
            readTime="8 min read"
            content={
              <>
                <p>
                  Typography is one of the most important aspects of web design. It affects
                  readability, user experience, and the overall aesthetic of your website. The
                  careful selection and implementation of typefaces can make the difference between
                  a good design and a great one.
                </p>

                <h2>Why Typography Matters</h2>
                <p>
                  Good typography guides the reader&apos;s eye, creates hierarchy, and makes content
                  more digestible. It&apos;s not just about choosing fonts—it&apos;s about creating
                  a harmonious reading experience that respects the reader&apos;s time and
                  attention.
                </p>

                <h3>Creating Hierarchy</h3>
                <p>
                  Start with a clear typographic hierarchy. Use different font families to create
                  contrast between headings and body text. In this system, we use PP Editorial New
                  for headings, FK Grotesk for UI elements, and Goudy Old Style for body content.
                </p>

                <h3>Code Example</h3>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 font-mono text-sm">
                  <code>{`const typography = {
  display: 'FK Display',      // Hero sections
  heading: 'PP Editorial New', // Titles & headings
  body: 'FK Grotesk',         // UI elements
  serif: 'Goudy Old Style',   // Long-form content
  mono: 'JetBrains Mono'      // Code blocks
};

// Apply fonts using utility classes
<h1 className="font-heading">Title</h1>
<p className="font-serif">Content...</p>
<code className="font-mono">code</code>`}</code>
                </pre>

                <h2>Best Practices</h2>
                <p>
                  Maintain consistency throughout your application. Use display fonts sparingly for
                  maximum impact. Ensure sufficient contrast between text and background. Consider
                  line length and spacing for optimal readability.
                </p>
              </>
            }
          />
        </div>
      </section>

      <div className="border-border my-12 border-t" />

      {/* Best Practices */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Best Practices</h2>
          <p className="font-body text-muted-foreground text-lg">
            Guidelines for using typography effectively in your designs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Use Display Fonts Sparingly</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Reserve FK Display for hero sections and major headlines only. Overuse diminishes
                  impact.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Maintain Clear Hierarchy</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Use heading fonts (PP Editorial New) for all h1-h6 elements to create visual
                  structure.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Optimize for Readability</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Use serif fonts (Goudy Old Style) for long-form content. Minimum 16px font size
                  for body text.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                4
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Consider Performance</h3>
                <p className="font-body text-muted-foreground text-sm">
                  All fonts are optimized and loaded once. Use font-display: swap for better
                  performance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                5
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Use Mono for Code</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Always use JetBrains Mono for code blocks and technical content for optimal
                  legibility.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                6
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Test Responsively</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Ensure typography scales appropriately across all device sizes and remains
                  readable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-border my-12 border-t" />

      {/* Additional Resources */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Additional Resources</h2>
          <p className="font-body text-muted-foreground text-lg">
            More information and documentation about the typography system.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card space-y-4 rounded-lg border p-6">
            <h3 className="font-heading text-xl font-semibold">Configuration Files</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <code className="text-primary font-mono text-sm">
                  /public/assets/fonts/fonts.ts
                </code>
                <p className="font-body text-muted-foreground text-sm">
                  Font definitions and Next.js font loader configuration
                </p>
              </div>
              <div className="space-y-1">
                <code className="text-primary font-mono text-sm">/src/app/globals.css</code>
                <p className="font-body text-muted-foreground text-sm">
                  CSS variables and utility classes for typography
                </p>
              </div>
              <div className="space-y-1">
                <code className="text-primary font-mono text-sm">/src/app/[locale]/layout.tsx</code>
                <p className="font-body text-muted-foreground text-sm">
                  Font variables applied to the root HTML element
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card space-y-4 rounded-lg border p-6">
            <h3 className="font-heading text-xl font-semibold">Full Documentation</h3>
            <p className="font-body text-muted-foreground text-sm">
              For a comprehensive guide including implementation details, troubleshooting, and
              advanced patterns, refer to the complete documentation file.
            </p>
            <code className="text-primary bg-muted block rounded-lg p-3 font-mono text-sm">
              /docs/TYPOGRAPHY_GUIDE.md
            </code>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="bg-muted mt-12 rounded-lg p-6 text-center">
        <p className="font-body text-muted-foreground text-sm">
          This typography system is designed to be flexible and scalable. All fonts are loaded
          efficiently and available globally throughout the application.
        </p>
      </div>
    </Container>
  );
}
