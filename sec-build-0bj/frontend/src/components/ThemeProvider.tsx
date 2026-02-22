import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'rainbow';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get theme from localStorage during initialization
    try {
      const stored = localStorage.getItem('eth-sandbox-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'rainbow') {
        return stored;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
    // Default to dark theme
    const defaultTheme = 'dark';
    // Apply class immediately in the state initializer for faster load
    if (typeof window !== 'undefined') {
      window.document.documentElement.classList.add(stored || defaultTheme);
    }
    return stored || defaultTheme;
  });

  // Apply theme immediately on mount to prevent flash
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'rainbow');

    // Add the current theme class
    root.classList.add(theme);

    // Mark as loaded after applying theme
    setIsLoading(false);
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (isLoading) return; // Skip during initial load

    const root = window.document.documentElement;

    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'rainbow');

    // Add the current theme class
    root.classList.add(theme);

    // Save to localStorage
    try {
      localStorage.setItem('eth-sandbox-theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme, isLoading]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'rainbow') {
      setThemeState(newTheme);
    } else {
      console.error('Invalid theme:', newTheme);
      setThemeState('dark'); // Fallback to dark
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

