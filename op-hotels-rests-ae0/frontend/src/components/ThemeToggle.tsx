import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon"><Sun className="h-5 w-5" /></Button>;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-5 w-5 text-amber-500" />;
      case 'dark':
        return <Moon className="h-5 w-5 text-blue-400" />;
      case 'rainbow':
        return <Palette className="h-5 w-5 text-purple-500" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const handleThemeChange = (newTheme: string) => {
    // Force immediate theme change by updating both the theme and the document class
    setTheme(newTheme);
    
    // Immediately update document class for instant visual feedback
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'rainbow');
    root.classList.add(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className={currentTheme === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className={currentTheme === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('rainbow')}
          className={currentTheme === 'rainbow' ? 'bg-accent' : ''}
        >
          <Palette className="mr-2 h-4 w-4 text-purple-500" />
          <span>Rainbow</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
