import '@src/app/globals.css';

import { AudioProvider } from '@src/contexts/audio-context';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  return <AudioProvider>{children}</AudioProvider>;
}
