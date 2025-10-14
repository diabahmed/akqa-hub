import fs from 'fs';
import path from 'path';

import { marked } from 'marked';
import type { Metadata } from 'next';

import { Container } from '@src/components/shared/container';
import { BlurFade } from '@src/components/ui/blur-fade';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete technical documentation for AKQA Hub - Where Art Meets Science Through AI',
};

// Configure marked options for better rendering
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Read README.md from project root
function getReadmeContent(): string {
  const readmePath = path.join(process.cwd(), 'README.md');
  try {
    return fs.readFileSync(readmePath, 'utf-8');
  } catch (error) {
    console.error('Error reading README.md:', error);
    return '# Documentation\n\nUnable to load documentation.';
  }
}

export default function DocumentationPage() {
  const markdownContent = getReadmeContent();
  const htmlContent = marked.parse(markdownContent);

  return (
    <BlurFade delay={0.25} inView direction="up">
      <Container>
        {/* Hero Header */}
        <div className="space-y-6 pb-8">
          <div className="space-y-2">
            <p className="font-body text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
              Technical Guide
            </p>
            <h1 className="font-heading text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Documentation
            </h1>
            <p className="font-body text-muted-foreground text-xl md:text-2xl">
              Complete technical documentation for AKQA Hub — Where Art Meets Science Through AI.
            </p>
          </div>
        </div>

        <div className="border-border my-8 border-t" />

        {/* README Content */}
        <article
          className="blog-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer Links */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-bold">Additional Resources</h2>
            <p className="font-body text-muted-foreground text-lg">
              Explore more detailed documentation and guides.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://github.com/diabahmed/akqa-hub/blob/main/docs/TECHNICAL_DOCUMENTATION_2.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card hover:bg-accent group relative overflow-hidden rounded-lg border p-6 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">Complete Technical Docs</h3>
                <p className="font-body text-muted-foreground text-sm">
                  1,200+ lines covering every architectural decision, RAG implementation, and system
                  design.
                </p>
                <div className="text-primary font-body text-sm font-medium">
                  Read Documentation →
                </div>
              </div>
            </a>

            <a
              href="https://github.com/diabahmed/akqa-hub/blob/main/docs/TYPOGRAPHY_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card hover:bg-accent group relative overflow-hidden rounded-lg border p-6 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">Typography Guide</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Complete guide to the 5-font system: FK Display, PP Editorial New, FK Grotesk,
                  Goudy Old Style, JetBrains Mono.
                </p>
                <div className="text-primary font-body text-sm font-medium">View Typography →</div>
              </div>
            </a>

            <a
              href="https://github.com/diabahmed/akqa-hub/blob/main/docs/TECHNICAL_DOCUMENTATION_1.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card hover:bg-accent group relative overflow-hidden rounded-lg border p-6 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">CMS Integration</h3>
                <p className="font-body text-muted-foreground text-sm">
                  Contentful headless CMS setup, GraphQL queries, and content synchronization
                  details.
                </p>
                <div className="text-primary font-body text-sm font-medium">
                  Read Integration Docs →
                </div>
              </div>
            </a>
          </div>
        </div>
      </Container>
    </BlurFade>
  );
}
