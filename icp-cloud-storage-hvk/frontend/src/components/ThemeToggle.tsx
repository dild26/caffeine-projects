import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Sun, Moon, Palette } from 'lucide-react';
import { useSetThemePreference } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

type Theme = 'light' | 'dark' | 'vibgyor';

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('light');
  const { mutate: saveThemePreference } = useSetThemePreference();
  const { identity } = useInternetIdentity();
  const isInitializedRef = useRef(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === 'vibgyor') {
      root.classList.remove('dark');
      root.classList.add('vibgyor');
    } else if (newTheme === 'dark') {
      root.classList.remove('vibgyor');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark', 'vibgyor');
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current) return;

    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && ['light', 'dark', 'vibgyor'].includes(stored)) {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    }

    isInitializedRef.current = true;
  }, [applyTheme]);

  const cycleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'vibgyor'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setThemeState(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);

    if (identity) {
      saveThemePreference(nextTheme);
    }
  }, [theme, applyTheme, identity, saveThemePreference]);

  const getIcon = useCallback(() => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'vibgyor':
        return <Palette className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to cycle.`}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
