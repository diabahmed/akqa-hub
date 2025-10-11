# Typography System Documentation

A comprehensive guide to the custom typography system configured in this application, including all font families, weights, utility classes, and usage patterns.

## Available Fonts

The application uses five carefully selected typefaces, each optimized for specific use cases:

1. **FK Display** (`--font-fk-display`) - Display font for large, attention-grabbing headlines and hero sections
2. **PP Editorial New** (`--font-pp-editorial-new`) - Editorial serif font for titles, headings, and creating typographic hierarchy
3. **FK Grotesk** (`--font-fk-grotesk`) - Modern sans-serif for body text, UI elements, navigation, and buttons
4. **JetBrains Mono** (`--font-jetbrains-mono`) - Developer-focused monospace font for code blocks and technical content
5. **Goudy Old Style** (`--font-goudy-old-style`) - Classic serif font for long-form content and articles

## Font Details & Weights

### FK Display

**Use Case:** Hero sections, major headlines  
**Available Weights:**

- 400 (Regular) - `font-normal`

### PP Editorial New

**Use Case:** Titles, headings, section headers  
**Available Weights:**

- 200 (Ultralight) - `font-extralight`
- 400 (Regular) - `font-normal`
- 800 (Ultrabold) - `font-extrabold`

### FK Grotesk

**Use Case:** UI elements, navigation, short text  
**Available Weights:**

- 100 (Thin) - `font-thin`
- 300 (Light) - `font-light`
- 400 (Regular) - `font-normal`
- 500 (Medium) - `font-medium`
- 700 (Bold) - `font-bold`
- 900 (Black) - `font-black`

### JetBrains Mono

**Use Case:** Code blocks, technical content, inline code  
**Available Weights:**

- 100-900 (All weights) - Plus italic variants
- Use standard Tailwind font-weight utilities

### Goudy Old Style

**Use Case:** Long-form articles, blog posts  
**Available Weights:**

- 400 (Regular) - `font-normal`

## Typography Hierarchy

### For Blog Posts

The fonts are organized in a semantic hierarchy perfect for blog and article content:

- **Headers/Titles** → PP Editorial New (elegant serif, creates authority)
- **Metadata/Info** → FK Grotesk (clean sans-serif, unobtrusive)
- **Body Content** → Goudy Old Style (readable serif, optimized for long-form)
- **Code Snippets** → JetBrains Mono (monospace, developer-friendly)
- **Hero Text** → FK Display (display font, maximum impact)

## Usage Methods

### Method 1: Using Utility Classes (Recommended)

Use these Tailwind utility classes anywhere in your components:

```tsx
// Display font - for hero sections and large headlines
<h1 className="font-display text-6xl">Hero Headline</h1>

// Heading font - for titles and section headers
<h2 className="font-heading text-4xl">Article Title</h2>

// Body font - for UI elements and short text
<p className="font-body text-base">Navigation or UI text</p>

// Serif font - for long-form content
<article className="font-serif text-lg">Blog post content...</article>

// Mono font - for code blocks and technical content
<code className="font-mono text-sm">const hello = "world";</code>
```

### Method 2: Using Pre-built Component Classes

For blog posts and content-heavy pages, use these pre-configured component classes that combine fonts, sizing, and spacing:

```tsx
export function BlogPost() {
  return (
    <article>
      {/* Blog title - PP Editorial New, large size */}
      <h1 className="blog-title">10 Tips for Better Web Development</h1>

      {/* Blog subtitle - PP Editorial New, medium size */}
      <h2 className="blog-subtitle">A comprehensive guide to modern practices</h2>

      {/* Blog metadata - FK Grotesk, muted color */}
      <div className="blog-meta">By John Doe • October 11, 2025 • 5 min read</div>

      {/* Blog content - Goudy Old Style with auto-styled children */}
      <div className="blog-content">
        <p>This is a paragraph with beautiful serif typography...</p>

        <h2>Section Heading</h2>
        <p>More content here...</p>

        <h3>Subsection</h3>
        <p>Even more content...</p>

        <code>const example = "code";</code>
      </div>
    </article>
  );
}
```

### Available Pre-built Classes

- `blog-title` - Large, bold heading for blog post titles (responsive 4xl → 6xl)
- `blog-subtitle` - Secondary heading with lighter weight (responsive 2xl → 3xl)
- `blog-meta` - Metadata text with muted foreground color
- `blog-content` - Container that auto-styles all child elements (p, h2-h4, code)
- `display-text` - Extra large text for hero sections (responsive 5xl → 7xl)

### Method 3: Using CSS Variables Directly

In your custom CSS or style props:

```css
.custom-heading {
  font-family: var(--font-heading);
  font-size: 2rem;
}

.custom-body {
  font-family: var(--font-serif);
  line-height: 1.6;
}
```

## Complete Blog Example

Here's a complete example of a blog post component:

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPostPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="blog-title mb-4">The Art of Modern Web Typography</h1>

        <p className="blog-subtitle mb-6">How to create beautiful, readable content on the web</p>

        <div className="blog-meta flex gap-4">
          <span>By Jane Designer</span>
          <span>•</span>
          <time>October 11, 2025</time>
          <span>•</span>
          <span>8 min read</span>
        </div>
      </header>

      {/* Main Content */}
      <article className="blog-content">
        <p>
          Typography is one of the most important aspects of web design. It affects readability,
          user experience, and the overall aesthetic of your website.
        </p>

        <h2>Why Typography Matters</h2>
        <p>
          Good typography guides the reader's eye, creates hierarchy, and makes content more
          digestible. It's not just about choosing fonts—it's about creating a harmonious reading
          experience.
        </p>

        <h3>Choosing the Right Fonts</h3>
        <p>When selecting fonts for your project, consider the following factors:</p>

        <ul className="mb-4 list-disc pl-6">
          <li>Readability at different sizes</li>
          <li>Brand alignment</li>
          <li>Performance and loading times</li>
        </ul>

        <h3>Code Example</h3>
        <pre className="bg-muted overflow-x-auto rounded-lg p-4">
          <code>{`const typography = {
  display: 'FK Display',
  heading: 'PP Editorial New',
  body: 'FK Grotesk',
  content: 'Goudy Old Style',
  code: 'JetBrains Mono'
};`}</code>
        </pre>

        <h2>Conclusion</h2>
        <p>
          Mastering typography takes time and practice, but the results are worth it. Start with
          these principles and experiment to find what works best for your content.
        </p>
      </article>
    </div>
  );
}
```

## CSS Variables

All fonts are available as CSS custom properties that can be used in your stylesheets:

```css
.custom-heading {
  font-family: var(--font-heading); /* PP Editorial New */
  font-family: var(--font-display); /* FK Display */
}

.custom-body {
  font-family: var(--font-body); /* FK Grotesk */
  font-family: var(--font-serif); /* Goudy Old Style */
  font-family: var(--font-mono); /* JetBrains Mono */
}
```

## Combining with Tailwind

You can combine font utilities with other Tailwind classes:

```tsx
// Responsive typography
<h1 className="font-heading text-3xl md:text-5xl lg:text-7xl font-bold">
  Responsive Heading
</h1>

// With colors and spacing
<p className="font-serif text-lg leading-relaxed text-foreground mb-4">
  Well-spaced paragraph
</p>

// With animations
<div className="font-display text-6xl fade-in">
  Animated Display Text
</div>
```

## Best Practices

1. **Use Display fonts sparingly** - Reserve `font-display` (FK Display) for hero sections and major headlines only. Overuse diminishes impact.

2. **Heading fonts for structure** - Use `font-heading` (PP Editorial New) for all h1-h6 elements to create clear visual hierarchy and structure.

3. **Body fonts for UI** - Use `font-body` (FK Grotesk) for navigation, buttons, labels, and any short UI text. Its clean, modern aesthetic works well for interface elements.

4. **Serif fonts for reading** - Use `font-serif` (Goudy Old Style) for long-form content, articles, and blog posts. Optimized for extended reading sessions.

5. **Mono fonts for code** - Always use `font-mono` (JetBrains Mono) for code blocks, inline code, and technical content. Designed specifically for programming.

6. **Maintain contrast** - Don't mix too many different fonts on the same page. The system provides enough variety for any use case.

7. **Consider accessibility** - Ensure sufficient font size (minimum 16px for body text) and adequate line-height for readability.

8. **Respect font weights** - Each font family has specific weights. Use the appropriate weight for the context (e.g., bold for emphasis, light for subtlety).

9. **Test responsively** - Typography should scale appropriately across all device sizes. Use responsive utilities like `text-base md:text-lg`.

10. **Optimize performance** - All fonts are preloaded and optimized. Avoid loading additional font files unless absolutely necessary.

## Advanced Patterns

### Responsive Typography

```tsx
<h1 className="font-heading text-3xl md:text-5xl lg:text-7xl font-bold">
  Scales from mobile to desktop
</h1>

<p className="font-serif text-base md:text-lg leading-relaxed">
  Readable across all screen sizes
</p>
```

### Combining Fonts

```tsx
<section>
  {/* Display for maximum impact */}
  <h1 className="font-display mb-4 text-7xl">Hero</h1>

  {/* Heading for structure */}
  <h2 className="font-heading mb-2 text-2xl">Subtitle</h2>

  {/* Body for UI elements */}
  <p className="font-body text-muted-foreground mb-6 text-sm">Metadata • Date • Category</p>

  {/* Serif for content */}
  <article className="font-serif text-lg leading-relaxed">Long-form article content...</article>
</section>
```

### Dark Mode Considerations

All fonts work well in both light and dark modes. The system automatically adjusts text colors using semantic color tokens:

```tsx
<p className="font-body text-foreground">
  Automatically adapts to theme
</p>

<p className="font-serif text-muted-foreground">
  Muted text in both modes
</p>
```

## Performance & Optimization

### Font Loading Strategy

All fonts are optimized for performance using Next.js font optimization:

- **Local fonts** (FK Display, FK Grotesk, PP Editorial New, Goudy Old Style) are self-hosted for maximum control
- **Google Fonts** (JetBrains Mono) are loaded via Next.js with automatic optimization
- Font files are subset and preloaded for faster initial page load
- CSS variables are available immediately, preventing layout shift

### Best Practices for Performance

1. **Limit font variations** - Only use the weights you actually need
2. **Subset fonts** - Fonts are automatically subset to Latin characters
3. **Preload critical fonts** - Done automatically by Next.js
4. **Use font-display: swap** - Configured by default for all fonts
5. **Avoid FOUT/FOIT** - Font loading is optimized to minimize flash issues

## Troubleshooting

### Fonts Not Loading

If fonts aren't displaying correctly:

1. **Check font files exist**

   ```bash
   ls -la public/assets/fonts/
   ```

2. **Verify font configuration**
   - Check `/public/assets/fonts/fonts.ts` for correct paths
   - Ensure font variables are exported

3. **Confirm layout setup**
   - Verify fonts are imported in `/src/app/[locale]/layout.tsx`
   - Check that font variables are added to the `<html>` className

4. **Clear cache and rebuild**

   ```bash
   pnpm clean
   pnpm build
   ```

5. **Check browser DevTools**
   - Look for font loading errors in Console
   - Verify font files are being downloaded in Network tab
   - Check computed styles show correct font-family

### Common Issues

**Issue:** Font not changing when utility class is applied  
**Solution:** Check that the font variable is properly loaded in the layout and that you're using the correct class name.

**Issue:** Font weights not working  
**Solution:** Verify the font file includes that weight. Some fonts only have specific weights available.

**Issue:** Fonts look different than expected  
**Solution:** Make sure you're viewing in the correct theme (light/dark) and that CSS variables are properly defined.

## File Structure

```
akqa-hub/
├── public/assets/fonts/
│   ├── fonts.ts                    # Font configuration
│   ├── FK Display/                 # Display font files
│   ├── FK Grotesk/                 # Body font files
│   ├── PPEditorialNew/             # Heading font files
│   └── Goudy Old Style/            # Serif font files
├── src/
│   ├── app/
│   │   ├── globals.css             # Typography utilities & variables
│   │   └── [locale]/
│   │       └── layout.tsx          # Font variable application
│   └── components/
│       └── custom/
│           └── typography-examples.tsx  # Example components
└── docs/
    └── TYPOGRAPHY_GUIDE.md         # This file
```

## Quick Reference Card

| Use Case          | Utility Class  | Font Family      | Variable                  |
| ----------------- | -------------- | ---------------- | ------------------------- |
| Hero headlines    | `font-display` | FK Display       | `--font-fk-display`       |
| Titles & headings | `font-heading` | PP Editorial New | `--font-pp-editorial-new` |
| UI elements       | `font-body`    | FK Grotesk       | `--font-fk-grotesk`       |
| Article content   | `font-serif`   | Goudy Old Style  | `--font-goudy-old-style`  |
| Code blocks       | `font-mono`    | JetBrains Mono   | `--font-jetbrains-mono`   |

## Additional Resources

- **Live Demo**: Visit `/typography-demo` to see all fonts in action
- **Font Configuration**: `/public/assets/fonts/fonts.ts`
- **Global Styles**: `/src/app/globals.css`
- **Layout Setup**: `/src/app/[locale]/layout.tsx`
- **Example Components**: `/src/components/custom/typography-examples.tsx`

## Version History

- **v1.2** - Switched from FK Grotesk Mono to JetBrains Mono for code
- **v1.1** - Added comprehensive component classes for blog posts
- **v1.0** - Initial typography system with 5 font families

---

For questions or suggestions about the typography system, please refer to the project documentation or create an issue in the repository.
