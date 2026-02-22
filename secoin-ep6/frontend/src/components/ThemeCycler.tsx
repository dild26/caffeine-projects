import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Rainbow } from 'lucide-react';

export default function ThemeCycler() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'rainbow'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    setCurrentTheme((prev) => {
      if (prev === 'dark') {
        setTheme('light');
        return 'light';
      } else if (prev === 'light') {
        document.documentElement.classList.add('rainbow-theme');
        return 'rainbow';
      } else {
        document.documentElement.classList.remove('rainbow-theme');
        setTheme('dark');
        return 'dark';
      }
    });
  };

  if (!mounted) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 cursor-pointer transition-transform hover:scale-110"
      onClick={cycleTheme}
      onMouseEnter={cycleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cycleTheme();
        }
      }}
      aria-label={`Current theme: ${currentTheme}. Click to cycle themes.`}
    >
      <Badge variant="outline" className="gap-2 bg-background/80 backdrop-blur-sm">
        {currentTheme === 'dark' && <Moon className="h-4 w-4" />}
        {currentTheme === 'light' && <Sun className="h-4 w-4" />}
        {currentTheme === 'rainbow' && <Rainbow className="h-4 w-4" />}
        <span className="capitalize">{currentTheme}</span>
      </Badge>
    </div>
  );
}
