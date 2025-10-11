/**
 * Example Blog Post Component
 *
 * This component demonstrates how to use the typography system
 * for a blog post with proper font hierarchy.
 */

interface BlogPostExampleProps {
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
}

export function BlogPostExample({
  title,
  subtitle,
  author,
  date,
  readTime,
  content,
}: BlogPostExampleProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header Section - Uses heading font (PP Editorial New) */}
      <header className="mb-12 space-y-6">
        {/* Main title - Large, elegant serif */}
        <h1 className="blog-title">{title}</h1>

        {/* Subtitle - Secondary heading */}
        {subtitle && <p className="blog-subtitle text-muted-foreground">{subtitle}</p>}

        {/* Metadata - Uses body font (FK Grotesk) */}
        <div className="blog-meta flex flex-wrap gap-2">
          <span className="font-semibold">{author}</span>
          <span className="text-muted-foreground">•</span>
          <time className="text-muted-foreground">{date}</time>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{readTime}</span>
        </div>

        {/* Divider */}
        <div className="bg-border h-px" />
      </header>

      {/* Main Content - Uses serif font (Goudy Old Style) */}
      <article className="blog-content">{content}</article>

      {/* Footer */}
      <footer className="border-border mt-12 border-t pt-8">
        <div className="font-body text-muted-foreground text-sm">
          <p>Thank you for reading!</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Example usage in a page:
 *
 * <BlogPostExample
 *   title="The Future of Web Development"
 *   subtitle="Exploring new trends and technologies"
 *   author="John Doe"
 *   date="October 11, 2025"
 *   readTime="5 min read"
 *   content={
 *     <>
 *       <p>
 *         This is the introduction paragraph. It uses the Goudy Old Style serif
 *         font, which is perfect for long-form reading.
 *       </p>
 *
 *       <h2>Section Heading</h2>
 *       <p>
 *         Section headings automatically use the PP Editorial New font for
 *         consistency and hierarchy.
 *       </p>
 *
 *       <h3>Subsection</h3>
 *       <p>More detailed content here...</p>
 *
 *       <pre><code>
 *         const example = "This uses FK Grotesk Mono";
 *       </code></pre>
 *     </>
 *   }
 * />
 */
