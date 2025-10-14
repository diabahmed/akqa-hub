#!/usr/bin/env node

/**
 * README to PDF Converter
 * Converts the documentation page to a professionally formatted PDF for submission
 *
 * Usage: node scripts/readme-to-pdf.js [url]
 * Default URL: https://akqa-hub.vercel.app/documentation
 * Optional: Pass 'local' or 'localhost' to use http://localhost:3000/documentation
 * Output: README.pdf in the project root
 *
 * Examples:
 *   node scripts/readme-to-pdf.js
 *   node scripts/readme-to-pdf.js local
 *   node scripts/readme-to-pdf.js https://akqa-hub.vercel.app/documentation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '../README.pdf');

// Get URL from command line arguments or use default
const args = process.argv.slice(2);
let DOCUMENTATION_URL = 'https://akqa-hub.vercel.app/documentation';

if (args.length > 0) {
  const arg = args[0].toLowerCase();
  if (arg === 'local' || arg === 'localhost') {
    DOCUMENTATION_URL = 'http://localhost:3000/documentation';
  } else if (arg.startsWith('http://') || arg.startsWith('https://')) {
    DOCUMENTATION_URL = args[0];
  }
}

// Check if required dependencies are installed
async function checkDependencies() {
  console.log('📦 Checking dependencies...\n');

  try {
    await import('puppeteer');
    console.log('✅ Dependencies found\n');
    return true;
  } catch (e) {
    console.log('❌ Missing dependencies. Installing...\n');
    console.log('Running: pnpm install puppeteer\n');
    console.error(e);

    try {
      execSync('pnpm install puppeteer', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
      console.log('\n✅ Dependencies installed successfully\n');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install dependencies:', installError.message);
      console.error('\nPlease run manually: pnpm install puppeteer');
      return false;
    }
  }
}

// Convert documentation page to PDF
async function convertToPDF() {
  if (!(await checkDependencies())) {
    process.exit(1);
  }

  const puppeteer = await import('puppeteer');

  console.log(`🌐 Loading documentation from: ${DOCUMENTATION_URL}`);

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
  try {
    await page.goto(DOCUMENTATION_URL, {
      waitUntil: 'networkidle0',
      timeout: 60000, // 60 second timeout
    });

    // Wait for the content to be visible
    await page.waitForSelector('article.blog-content, .prose', {
      timeout: 30000,
    });

    // Inject CSS to hide unnecessary elements for PDF
    await page.addStyleTag({
      content: `
        /* Set PDF background to match app background */
        @page {
          background: hsl(0, 0%, 97.6%);
        }
        
        html,
        body {
          background: hsl(0, 0%, 97.6%) !important;
        }
        
        /* Hide elements not needed in PDF */
        nav,
        header,
        footer,
        .border-t,
        hr,
        /* Hide any interactive elements */
        button,
        [role="button"] {
          display: none !important;
        }
        
        /* Remove all borders and dividers */
        .border,
        .border-border,
        [class*="border-t"],
        [class*="border-b"] {
          border: none !important;
          display: none !important;
        }
        
        /* Ensure clean print styling */
        body {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        
        /* Remove any hover effects or transitions */
        * {
          transition: none !important;
        }
      `,
    });

    console.log('✅ Page loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load documentation page:', error.message);
    console.error('\nPlease ensure:');
    console.error('1. The URL is accessible:', DOCUMENTATION_URL);
    console.error('2. If using localhost, the dev server is running (pnpm dev)');
    console.error('3. Your internet connection is stable (for production URL)');
    await browser.close();
    process.exit(1);
  }

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
    displayHeaderFooter: false,
  });

  await browser.close();

  console.log('\n✅ SUCCESS! PDF generated:');
  console.log(`📁 ${OUTPUT_PATH}`);
  console.log(`🌐 Source: ${DOCUMENTATION_URL}\n`);

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
