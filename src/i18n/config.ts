export type Locale = (typeof locales)[number];

export const locales = ['en-US', 'de-DE'];
export const defaultLocale: Locale = 'en-US';

export default {
  locales,
  defaultLocale,
};
