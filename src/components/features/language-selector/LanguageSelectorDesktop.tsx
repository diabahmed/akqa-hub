import { GlobeIcon } from '@contentful/f36-icons';
import Link from 'next/link';

import { Button } from '@src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu';
import { locales } from '@src/i18n/config';

interface LanguageSelectorDesktopProps {
  localeName: (locale: string) => string;
  onChange: (event: any) => void;
  displayName: (locale: string) => Intl.DisplayNames;
  currentLocale: string;
  currentPathname: string;
}

export const LanguageSelectorDesktop = ({
  localeName,
  onChange,
  displayName,
  currentLocale,
  currentPathname,
}: LanguageSelectorDesktopProps) => {
  const localesToShow = locales.filter(locale => locale !== currentLocale);
  // Try to extract and match a locale from a pattern of `/en-US/:slug`
  const pathnameHasLocale = locales.includes(currentPathname.slice(1, 6));
  const pathnameWithoutLocale = currentPathname.slice(6);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-2 font-normal uppercase sm:px-4"
        >
          <GlobeIcon width="18px" height="18px" variant="secondary" />
          <span className="hidden sm:inline">{localeName(currentLocale)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className="z-[100] max-w-[200px] min-w-24"
        collisionPadding={8}
        avoidCollisions={true}
      >
        {localesToShow?.map(availableLocale => {
          return (
            <DropdownMenuItem key={availableLocale} asChild>
              <Link
                className="cursor-pointer text-sm whitespace-nowrap sm:text-base"
                href={
                  pathnameHasLocale
                    ? `/${availableLocale}${pathnameWithoutLocale}`
                    : `/${availableLocale}${currentPathname}`
                }
                onClick={event => {
                  onChange(event);
                }}
              >
                {displayName(availableLocale).of(localeName(availableLocale))}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
