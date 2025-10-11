'use client';

import { GlobeIcon } from '@contentful/f36-icons';
import { useCurrentLocale } from 'next-i18n-router/client';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@src/components/ui/button';
import { Label } from '@src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@src/components/ui/sheet';
import i18nConfig, { locales } from '@src/i18n/config';

interface LanguageSelectorMobileProps {
  localeName: (locale: string) => string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  displayName: (locale: string) => Intl.DisplayNames;
}

export const LanguageSelectorMobile = ({
  localeName,
  onChange,
  displayName,
}: LanguageSelectorMobileProps) => {
  const currentLocale = useCurrentLocale(i18nConfig);
  const { t } = useTranslation();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleValueChange = useCallback(
    (value: string) => {
      const event = {
        type: 'change',
        target: { value },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
      setShowDrawer(false);
    },
    [onChange],
  );

  return (
    <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={t('common.languageDrawer')}
          aria-label={t('common.languageDrawer')}
        >
          <GlobeIcon width="18px" height="18px" variant="secondary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80vw]">
        <SheetHeader>
          <SheetTitle>{t('common.regionalSettings')}</SheetTitle>
          <SheetDescription>Choose your preferred language and regional settings.</SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language-select" className="text-base font-semibold">
              {t('common.language')}
            </Label>
            <Select value={currentLocale} onValueChange={handleValueChange}>
              <SelectTrigger id="language-select" className="w-full">
                <SelectValue placeholder={t('common.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {locales?.map(availableLocale => (
                  <SelectItem key={availableLocale} value={availableLocale}>
                    {displayName(availableLocale).of(localeName(availableLocale))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
