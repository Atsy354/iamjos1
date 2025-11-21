'use client';

import { Globe } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { Dropdown, DropdownItem, DropdownSection } from "@/components/ui/dropdown";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    // Reload page to apply new locale
    window.location.reload();
  };

  return (
    <Dropdown
      button={
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Globe className="h-4 w-4 text-white" />
          <span className="text-white text-base font-medium" style={{ fontSize: '1rem' }}>
            {localeNames[locale]}
          </span>
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
      }
      align="right"
    >
      <DropdownSection>
        {locales.map((loc) => (
          <DropdownItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            icon={<Globe className="h-4 w-4" />}
            className={locale === loc ? 'bg-gray-100 font-semibold' : ''}
          >
            {localeNames[loc]}
          </DropdownItem>
        ))}
      </DropdownSection>
    </Dropdown>
  );
}

