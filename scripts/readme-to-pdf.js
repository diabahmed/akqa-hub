#!/usr/bin/env node

/**
 * README to PDF Converter
 * Converts README.md to a professionally formatted PDF for submission
 *
 * Usage: node scripts/readme-to-pdf.js
 * Output: README.pdf in the project root
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const README_PATH = path.join(__dirname, '../README.md');
const OUTPUT_PATH = path.join(__dirname, '../README.pdf');
const TEMP_HTML_PATH = path.join(__dirname, '../temp-readme.html');

// Check if required dependencies are installed
async function checkDependencies() {
  console.log('📦 Checking dependencies...\n');

  try {
    await import('marked');
    await import('puppeteer');
    console.log('✅ Dependencies found\n');
    return true;
  } catch (e) {
    console.log('❌ Missing dependencies. Installing...\n');
    console.log('Running: pnpm install marked puppeteer\n');
    console.error(e);

    try {
      execSync('pnpm install marked puppeteer', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
      console.log('\n✅ Dependencies installed successfully\n');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install dependencies:', installError.message);
      console.error('\nPlease run manually: pnpm install marked puppeteer');
      return false;
    }
  }
}

// Convert README to PDF
async function convertToPDF() {
  if (!(await checkDependencies())) {
    process.exit(1);
  }

  const { marked } = await import('marked');
  const puppeteer = await import('puppeteer');

  console.log('📖 Reading README.md...');
  const markdown = fs.readFileSync(README_PATH, 'utf-8');

  console.log('🔄 Converting Markdown to HTML...');
  const htmlContent = marked.parse(markdown);

  // AKQA Hub website styling - matching globals.css exactly
  const styledHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AKQA Hub - Technical Documentation</title>
  <style>
    /* Import actual website fonts */
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
    
    /* Design tokens from globals.css - Light theme only for print */
    :root {
      --background: 0 0% 97.6%;
      --foreground: 0 0% 3.9%;
      --primary: 0 0% 9%;
      --primary-foreground: 0 0% 98%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --border: 0 0% 89.8%;
      --radius: 0.5rem;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Base body - FK Grotesk (using system font stack as fallback) */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: hsl(var(--foreground));
      background: transparent;
      padding: 40px 60px;
      max-width: 210mm;
      margin: 0 auto;
      font-size: 15px;
      font-weight: 400;
    }
    
    /* Headings - PP Editorial New style (serif fallback) */
    h1, h2, h3, h4, h5, h6 {
      font-family: Georgia, 'Times New Roman', serif;
      font-weight: 700;
      color: hsl(var(--foreground));
      line-height: 1.2;
      margin-top: 2em;
      margin-bottom: 0.75em;
      page-break-after: avoid;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-top: 0;
      margin-bottom: 0.5em;
    }
    
    h1:first-child {
      margin-top: 0;
    }
    
    h2 {
      font-size: 1.875rem;
      font-weight: 700;
      margin-top: 2.5em;
      margin-bottom: 0.75em;
      padding-bottom: 0.5em;
      border-bottom: 1px solid hsl(var(--border));
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1.75em;
      margin-bottom: 0.65em;
    }
    
    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    
    h5 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
    }
    
    h6 {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
    }
    
    /* Paragraphs - Goudy Old Style (serif fallback) */
    p {
      font-family: Georgia, 'Times New Roman', serif;
      margin-bottom: 1em;
      font-size: 1rem;
      line-height: 1.7;
      color: hsl(var(--foreground));
      orphans: 3;
      widows: 3;
    }
    
    /* Blockquotes */
    blockquote {
      border-left: 3px solid hsl(var(--primary));
      padding-left: 1.25em;
      margin: 1.5em 0;
      font-style: italic;
      color: hsl(var(--muted-foreground));
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1rem;
    }
    
    blockquote p {
      margin-bottom: 0.75em;
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* Code - JetBrains Mono */
    code {
      font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
      background: #f5f5f5;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
      color: hsl(var(--foreground));
      font-weight: 400;
    }
    
    pre {
      font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
      background: #f8f8f8;
      padding: 1.25em;
      border-radius: var(--radius);
      overflow-x: auto;
      margin: 1.5em 0;
      font-size: 0.8125rem;
      line-height: 1.6;
      page-break-inside: avoid;
      border: 1px solid #e5e5e5;
    }
    
    pre code {
      background: transparent;
      padding: 0;
      font-size: inherit;
    }
    
    /* Lists */
    ul, ol {
      margin: 1em 0 1em 1.5em;
      padding: 0;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1rem;
      line-height: 1.7;
    }
    
    ul {
      list-style-type: disc;
    }
    
    ol {
      list-style-type: decimal;
    }
    
    li {
      margin-bottom: 0.375em;
      line-height: 1.7;
    }
    
    li p {
      margin-bottom: 0.375em;
    }
    
    li p:last-child {
      margin-bottom: 0;
    }
    
    /* Nested lists */
    li > ul,
    li > ol {
      margin-top: 0.375em;
      margin-bottom: 0;
    }
    
    /* Links */
    a {
      color: hsl(var(--primary));
      text-decoration: underline;
      text-decoration-color: hsla(var(--primary), 0.3);
      text-underline-offset: 2px;
      transition: text-decoration-color 150ms ease;
    }
    
    a:hover {
      text-decoration-color: hsl(var(--primary));
    }
    
    /* Strong and emphasis */
    strong, b {
      font-weight: 700;
      color: hsl(var(--foreground));
    }
    
    em, i {
      font-style: italic;
    }
    
    /* Horizontal rule */
    hr {
      border: none;
      border-top: 1px solid hsl(var(--border));
      margin: 2.5em 0;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
      font-size: 0.875rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      page-break-inside: avoid;
    }
    
    table th,
    table td {
      padding: 0.625em 0.875em;
      text-align: left;
      border: 1px solid hsl(var(--border));
      line-height: 1.5;
    }
    
    table th {
      background: #f8f8f8;
      font-weight: 600;
      color: hsl(var(--foreground));
    }
    
    /* Images */
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1.5em 0;
      border-radius: var(--radius);
      page-break-inside: avoid;
    }
    
    /* Badge styling - keep inline */
    img[alt*="badge"],
    img[src*="shields.io"],
    img[src*="img.shields.io"] {
      display: inline-block;
      margin: 0.25em 0.25em 0.25em 0;
      vertical-align: middle;
    }
    
    /* Print-specific styles */
    @media print {
      body {
        padding: 30px 40px;
        font-size: 11pt;
      }
      
      h1 {
        font-size: 24pt;
      }
      
      h2 {
        font-size: 18pt;
      }
      
      h3 {
        font-size: 14pt;
      }
      
      h4, h5, h6 {
        font-size: 12pt;
      }
      
      p, li {
        font-size: 10.5pt;
      }
      
      code {
        font-size: 9pt;
      }
      
      pre {
        font-size: 8.5pt;
      }
      
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }
      
      pre, blockquote, img, table {
        page-break-inside: avoid;
      }
      
      a {
        color: hsl(var(--primary));
      }
      
      /* Show URLs for external links */
      a[href^="http"]:not([href*="shields.io"]):after {
        content: " (" attr(href) ")";
        font-size: 0.7em;
        color: hsl(var(--muted-foreground));
        font-family: 'JetBrains Mono', monospace;
      }
    }
    
    /* Footer */
    .footer {
      margin-top: 3em;
      padding-top: 1.5em;
      border-top: 1px solid hsl(var(--border));
      text-align: center;
      font-size: 0.8125rem;
      color: hsl(var(--muted-foreground));
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .footer p {
      font-family: inherit;
      font-size: inherit;
      margin-bottom: 0.5em;
    }
  </style>
</head>
<body>
  ${htmlContent}
  
  <div class="footer">
    <p style="margin-top: 0.5em; font-size: 0.75rem;">Generated on ${new Date().toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    )}</p>
  </div>
</body>
</html>
  `;

  // Write temporary HTML file
  fs.writeFileSync(TEMP_HTML_PATH, styledHTML);
  console.log('💾 Temporary HTML created');

  console.log('🚀 Launching browser...');

  let browser;
  try {
    browser = await puppeteer.default.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (chromeError) {
    if (chromeError.message.includes('Could not find Chrome')) {
      console.log('\n📥 Chrome not found. Installing...\n');
      try {
        execSync('npx puppeteer browsers install chrome', {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..'),
        });
        console.log('\n✅ Chrome installed. Retrying browser launch...\n');
        browser = await puppeteer.default.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      } catch (installError) {
        console.error('❌ Failed to install Chrome:', installError.message);
        console.error('\nPlease run manually: npx puppeteer browsers install chrome');
        process.exit(1);
      }
    } else {
      throw chromeError;
    }
  }

  const page = await browser.newPage();

  console.log('📄 Generating PDF...');
  await page.goto(`file://${TEMP_HTML_PATH}`, {
    waitUntil: 'networkidle0',
  });

  await page.pdf({
    path: OUTPUT_PATH,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 9px; text-align: center; width: 100%; color: hsl(0, 0%, 45.1%); padding: 0 15mm; font-family: 'Inter', sans-serif;">
        <span style="float: left;">AKQA Hub — Where Art Meets Science Through AI</span>
        <span style="float: right;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();

  // Clean up temporary HTML
  fs.unlinkSync(TEMP_HTML_PATH);
  console.log('🧹 Cleaned up temporary files');

  console.log('\n✅ SUCCESS! PDF generated:');
  console.log(`📁 ${OUTPUT_PATH}\n`);

  // Get file size
  const stats = fs.statSync(OUTPUT_PATH);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📊 File size: ${fileSizeInMB} MB`);
  console.log(`📄 Total pages: Check the PDF footer\n`);
}

// Run the converter
convertToPDF().catch(error => {
  console.error('\n❌ Error generating PDF:', error.message);
  console.error(error.stack);
  process.exit(1);
});
