import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Palette } from 'lucide-react';
import { useActor } from '../hooks/useActor';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { actor } = useActor();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && actor && theme) {
      actor.setThemePreference(theme).catch(console.error);
    }
  }, [theme, actor, mounted]);

  if (!mounted) {
    return null;
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('rainbow');
    } else {
      setTheme('light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-10 w-10 rounded-full"
      title={`Current theme: ${theme}. Click to cycle.`}
    >
      {theme === 'light' && (
        <Sun className="h-5 w-5 text-yellow-500" />
      )}
      {theme === 'dark' && (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
      {theme === 'rainbow' && (
        <Palette className="h-5 w-5 text-purple-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
