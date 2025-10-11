import { AIDevtools } from '@ai-sdk-tools/devtools';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { dir } from 'i18next';
import type { Metadata, Viewport } from 'next';
import { draftMode } from 'next/headers';

import {
  fkDisplay,
  fkGrotesk,
  jetBrainsMono,
  ppEditorialNew,
  goudyOldStyle,
} from '@public/assets/fonts/fonts';
import { MusicToggleButton } from '@src/components/custom/music-button';
import { ThemeProvider } from '@src/components/custom/theme-provider';
import { ContentfulPreviewProvider } from '@src/components/features/contentful';
import TranslationsProvider from '@src/components/shared/i18n/TranslationProvider';
import { Footer } from '@src/components/templates/footer';
import { Header } from '@src/components/templates/header';
import { Background } from '@src/components/ui/background';
import { Toaster } from '@src/components/ui/sonner';
import initTranslations from '@src/i18n';
import { locales } from '@src/i18n/config';

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export async function generateStaticParams(): Promise<{ locale: string }[]> {
  return locales.map(locale => ({ locale }));
}

const allowedOriginList = ['https://app.contentful.com', 'https://app.eu.contentful.com'];

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PageLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const { isEnabled: preview } = await draftMode();
  const { resources } = await initTranslations({ locale });

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`scroll-smooth antialiased focus:scroll-auto ${fkGrotesk.variable} ${fkDisplay.variable} ${ppEditorialNew.variable} ${jetBrainsMono.variable} ${goudyOldStyle.variable}`}
    >
      <head>
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      </head>

      <body className="px-4 xl:px-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationsProvider locale={locale} resources={resources}>
            <ContentfulPreviewProvider
              locale={locale}
              enableInspectorMode={preview}
              enableLiveUpdates={preview}
              targetOrigin={allowedOriginList}
            >
              <main className="font-body">
                <Header />
                {children}
                <Footer />
                <Toaster position="top-center" closeButton richColors />
                <Background />
                <Analytics />
                <SpeedInsights />
              </main>
              <div className="fixed bottom-4 left-4 z-50">
                <MusicToggleButton />
              </div>
              <div id="portal" className="font-body" />
              <AIDevtools
                config={{
                  enabled: process.env.NODE_ENV === 'development',
                  position: 'overlay',
                  theme: 'auto',
                }}
              />
            </ContentfulPreviewProvider>
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
