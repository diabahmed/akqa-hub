import { AIDevtools } from '@ai-sdk-tools/devtools';
import { dir } from 'i18next';
import type { Metadata, Viewport } from 'next';
import { Urbanist } from 'next/font/google';
import { draftMode } from 'next/headers';

import { ContentfulPreviewProvider } from '@src/components/features/contentful';
import TranslationsProvider from '@src/components/shared/i18n/TranslationProvider';
import { Footer } from '@src/components/templates/footer';
import { Header } from '@src/components/templates/header';
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

const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' });

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
    <html lang={locale} dir={dir(locale)}>
      <head>
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      </head>

      <body suppressHydrationWarning={true} className="antialiased">
        <TranslationsProvider locale={locale} resources={resources}>
          <ContentfulPreviewProvider
            locale={locale}
            enableInspectorMode={preview}
            enableLiveUpdates={preview}
            targetOrigin={allowedOriginList}
          >
            <main className={`${urbanist.variable} font-sans`}>
              <Header />
              {children}
              <Footer />
              <Toaster position="top-center" closeButton richColors />
            </main>
            <div id="portal" className={`${urbanist.variable} font-sans`} />
          </ContentfulPreviewProvider>
        </TranslationsProvider>
        <AIDevtools
          config={{
            enabled: process.env.NODE_ENV === 'development',
            position: 'overlay',
            theme: 'auto',
          }}
        />
      </body>
    </html>
  );
}
