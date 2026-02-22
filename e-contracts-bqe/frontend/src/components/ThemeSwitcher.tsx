import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, Palette, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useActor } from '../hooks/useActor';
import { Theme } from '../backend';

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { actor } = useActor();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'normal' | 'dark' | 'vibgyor'>('normal');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && actor) {
      // Load theme from backend
      actor.getTheme().then((backendTheme) => {
        const themeMap: Record<Theme, string> = {
          [Theme.normal]: 'light',
          [Theme.dark]: 'dark',
          [Theme.vibgyor]: 'vibgyor',
        };
        const mappedTheme = themeMap[backendTheme];
        if (mappedTheme) {
          setTheme(mappedTheme);
          setCurrentTheme(backendTheme === Theme.normal ? 'normal' : backendTheme === Theme.dark ? 'dark' : 'vibgyor');
        }
      }).catch(console.error);
    }
  }, [mounted, actor]);

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'vibgyor') => {
    // Apply theme immediately for smooth transition
    if (newTheme === 'vibgyor') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('vibgyor');
      setTheme('vibgyor');
      setCurrentTheme('vibgyor');
    } else if (newTheme === 'dark') {
      document.documentElement.classList.remove('vibgyor');
      document.documentElement.classList.add('dark');
      setTheme('dark');
      setCurrentTheme('dark');
    } else {
      document.documentElement.classList.remove('dark', 'vibgyor');
      setTheme('light');
      setCurrentTheme('normal');
    }

    // Save to backend
    if (actor) {
      try {
        const backendThemeMap: Record<string, Theme> = {
          light: Theme.normal,
          dark: Theme.dark,
          vibgyor: Theme.vibgyor,
        };
        await actor.setTheme(backendThemeMap[newTheme]);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Theme switcher">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const getIcon = () => {
    if (theme === 'vibgyor' || currentTheme === 'vibgyor') {
      return <Palette className="h-5 w-5" />;
    }
    if (resolvedTheme === 'dark' || theme === 'dark') {
      return <Moon className="h-5 w-5" />;
    }
    return <Sun className="h-5 w-5" />;
  };

  const isActive = (themeOption: string) => {
    if (themeOption === 'vibgyor') {
      return theme === 'vibgyor' || currentTheme === 'vibgyor';
    }
    if (themeOption === 'dark') {
      return (theme === 'dark' || resolvedTheme === 'dark') && currentTheme !== 'vibgyor';
    }
    return (theme === 'light' || resolvedTheme === 'light') && currentTheme === 'normal';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme switcher">
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleThemeChange('light')} className="gap-2">
          <Sun className="h-4 w-4" />
          <span className="flex-1">Light</span>
          {isActive('light') && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="gap-2">
          <Moon className="h-4 w-4" />
          <span className="flex-1">Dark</span>
          {isActive('dark') && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('vibgyor')} className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="flex-1">VIBGYOR</span>
          {isActive('vibgyor') && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

