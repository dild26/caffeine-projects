import { Palette, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useTheme } from './ThemeProvider';
import { useGetDefaultThemes } from '../hooks/useQueries';
import { Badge } from './ui/badge';

export default function ThemeSelector() {
  const { theme, setTheme, isLoading } = useTheme();
  const { data: backendThemes, isLoading: themesLoading } = useGetDefaultThemes();

  const themes = [
    { id: 'vibgyor', name: 'VIBGYOR', icon: '🌈' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'light', name: 'Light', icon: '☀️' },
  ];

  const hasAllThemes = backendThemes && backendThemes.length >= 3;
  const missingThemes = themes.filter(t => 
    !backendThemes?.some(bt => bt.name.toLowerCase() === t.name.toLowerCase())
  );

  const handleThemeChange = (themeId: string) => {
    const newTheme = themeId as 'vibgyor' | 'dark' | 'light';
    console.log(`🎨 User selected theme: ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 relative" 
          disabled={isLoading || themesLoading}
          title="Change theme"
        >
          <Palette className="h-4 w-4" />
          {!hasAllThemes && backendThemes && backendThemes.length > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full" />
          )}
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Theme</p>
        </div>
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </span>
            {theme === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs">
          {themesLoading ? (
            <span className="text-muted-foreground">Loading themes...</span>
          ) : backendThemes && backendThemes.length > 0 ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">
                {backendThemes.length} theme{backendThemes.length !== 1 ? 's' : ''} synced
              </span>
              {hasAllThemes ? (
                <Badge variant="secondary" className="text-xs h-5">✓</Badge>
              ) : (
                <Badge variant="destructive" className="text-xs h-5">!</Badge>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
              <AlertCircle className="h-3 w-3" />
              <span>Syncing themes...</span>
            </div>
          )}
          {missingThemes.length > 0 && backendThemes && backendThemes.length > 0 && (
            <p className="text-yellow-600 dark:text-yellow-500 text-xs mt-1">
              Missing: {missingThemes.map(t => t.name).join(', ')}
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
