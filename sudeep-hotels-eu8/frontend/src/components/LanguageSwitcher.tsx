import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { Language } from '../types/language';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languageLabels: Record<Language, string> = {
  [Language.english]: 'English',
  [Language.malayalam]: 'മലയാളം',
  [Language.arabic]: 'العربية',
  [Language.hindi]: 'हिन्दी',
};

const languageFlags: Record<Language, string> = {
  [Language.english]: '🇺🇸',
  [Language.malayalam]: '🇮🇳',
  [Language.arabic]: '🇸🇦',
  [Language.hindi]: '🇮🇳',
};

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageFlags[currentLanguage]} {languageLabels[currentLanguage]}
          </span>
          <span className="sm:hidden">
            {languageFlags[currentLanguage]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(Language).map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => onLanguageChange(language)}
            className={currentLanguage === language ? 'bg-accent' : ''}
          >
            <span className="mr-2">{languageFlags[language]}</span>
            {languageLabels[language]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
