import { GlobeIcon, CaretDownIcon, CaretUpIcon } from '@contentful/f36-icons';
import Link from 'next/link';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { twMerge } from 'tailwind-merge';

import { locales } from '@src/i18n/config';

const useClickOutside = (ref, setIsOpen) => {
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setIsOpen]);
};

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
  // Simple, stable hooks only
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Effect hook
  useClickOutside(containerRef, setIsOpen);

  // Derived values after all hooks
  const localesToShow = locales.filter(locale => locale !== currentLocale);
  // Try to extract and match a locale from a pattern of `/en-US/:slug`
  const pathnameHasLocale = locales.includes(currentPathname.slice(1, 6));
  const pathnameWithoutLocale = currentPathname.slice(6);

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case ' ':
      case 'SpaceBar':
      case 'Enter':
        e.preventDefault();

        setIsOpen(currentState => !currentState);
        break;
      case 'Escape':
        e.preventDefault();

        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleMenuItemKeydown = (e: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    switch (e.key) {
      case ' ':
      case 'SpaceBar':
      case 'Enter':
        e.stopPropagation();
        e.preventDefault();

        e.currentTarget?.click();

        break;
      case 'ArrowUp':
      case 'ArrowDown': {
        e.stopPropagation();
        e.preventDefault();

        const items = [...(menuRef.current?.children || [])];

        if (e.key === 'ArrowUp') {
          (items?.[index - 1] || items?.[items.length - 1])?.querySelector('a')?.focus();
        }

        if (e.key === 'ArrowDown') {
          (items?.[index + 1] || items?.[0])?.querySelector('a')?.focus();
        }

        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="menu-locale"
        className="flex items-center font-normal uppercase"
        onClick={() => setIsOpen(currentState => !currentState)}
      >
        <GlobeIcon width="18px" height="18px" variant="secondary" className="mr-1 ml-1" />
        {localeName(currentLocale)}
        {isOpen ? (
          <CaretUpIcon variant="secondary" className="pl-1" />
        ) : (
          <CaretDownIcon variant="secondary" className="pl-1" />
        )}
      </button>
      <FocusLock disabled={!isOpen} returnFocus={true}>
        <ul
          ref={menuRef}
          className={twMerge(
            'bg-color-white absolute top-100 right-0 z-10 w-24 translate-y-3 cursor-pointer rounded-md text-center text-base shadow-sm',
            isOpen ? 'block' : 'hidden',
          )}
          id="menu-locale"
          role="menu"
          onKeyDown={handleMenuKeyDown}
        >
          {localesToShow?.map((availableLocale, index) => {
            return (
              <li key={availableLocale} role="none">
                <Link
                  onKeyDown={e => handleMenuItemKeydown(e, index)}
                  role="menuitem"
                  className="block py-2"
                  href={
                    pathnameHasLocale
                      ? `/${availableLocale}${pathnameWithoutLocale}`
                      : `/${availableLocale}${currentPathname}`
                  }
                  onClick={event => {
                    onChange(event);
                    setIsOpen(false);
                  }}
                >
                  {displayName(availableLocale).of(localeName(availableLocale))}
                </Link>
              </li>
            );
          })}
        </ul>
      </FocusLock>
    </div>
  );
};
