import { Bricolage_Grotesque, DM_Sans, EB_Garamond, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-grotesque',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

// FK Display - Display font with regular variants
const fkDisplay = localFont({
  src: [
    {
      path: './FK Display/FKDisplayTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './FK Display/FKDisplayTrial-RegularAlt.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-fk-display',
});

// FK Grotesk - Main sans-serif font family
const fkGrotesk = localFont({
  src: [
    {
      path: './FK Grotesk/FKGroteskTrial-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskTrial-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-fk-grotesk',
});

// FK Grotesk Mono - Monospace variant
const fkGroteskMono = localFont({
  src: [
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskMonoTrial-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-fk-grotesk-mono',
});

// FK Grotesk Semi Mono - Semi-monospace variant
const fkGroteskSemiMono = localFont({
  src: [
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './FK Grotesk/FKGroteskSemiMonoTrial-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-fk-grotesk-semi-mono',
});

// PP Editorial New - Editorial serif font
const ppEditorialNew = localFont({
  src: [
    {
      path: './PPEditorialNew/PPEditorialNew-Ultralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './PPEditorialNew/PPEditorialNew-UltralightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: './PPEditorialNew/PPEditorialNew-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './PPEditorialNew/PPEditorialNew-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './PPEditorialNew/PPEditorialNew-Ultrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './PPEditorialNew/PPEditorialNew-UltraboldItalic.otf',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-pp-editorial-new',
});

// Goudy Old Style - Classic serif font
const goudyOldStyle = localFont({
  src: './Goudy Old Style/GOUDOS.ttf',
  variable: '--font-goudy-old-style',
});

export {
  bricolageGrotesque,
  dmSans,
  ebGaramond,
  fkDisplay,
  fkGrotesk,
  fkGroteskMono,
  fkGroteskSemiMono,
  goudyOldStyle,
  jetBrainsMono,
  ppEditorialNew,
};
