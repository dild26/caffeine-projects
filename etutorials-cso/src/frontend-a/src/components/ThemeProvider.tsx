import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useGetCallerUserProfile, useUpdateCallerThemePreference } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { validateThemeContrast } from '../lib/contrastUtils';

type ThemeMode = 'vibgyor' | 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isLoading: boolean;
  contrastValidation: {
    isValid: boolean;
    failures: Array<{ pair: string; ratio: number; required: number }>;
  } | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Fallback contrast-safe colors for each theme
const FALLBACK_THEMES: Record<ThemeMode, { bg: string; fg: string }> = {
  light: { bg: '100 0 0', fg: '15 0 0' },
  dark: { bg: '15 0 0', fg: '98 0 0' },
  vibgyor: { bg: '98 0.01 300', fg: '20 0.08 280' },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const updateTheme = useUpdateCallerThemePreference();
  const [theme, setThemeState] = useState<ThemeMode>('vibgyor');
  const [isInitialized, setIsInitialized] = useState(false);
  const [contrastValidation, setContrastValidation] = useState<{
    isValid: boolean;
    failures: Array<{ pair: string; ratio: number; required: number }>;
  } | null>(null);

  // Apply theme to DOM with automatic contrast validation and correction
  const applyTheme = useCallback((newTheme: ThemeMode) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('vibgyor', 'dark', 'light');
    
    // Add new theme class
    root.classList.add(newTheme);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', newTheme);
    
    // Force reflow to ensure theme is applied
    void root.offsetHeight;
    
    // Add theme-loaded class for transitions (after initial load)
    if (isInitialized) {
      root.classList.add('theme-loaded');
    }
    
    console.log(`✅ Theme applied to DOM: ${newTheme}`);
    
    // Validate contrast after theme is applied
    setTimeout(() => {
      try {
        const validation = validateThemeContrast();
        setContrastValidation(validation);
        
        if (!validation.isValid) {
          console.warn(`⚠️ Contrast issues detected in ${newTheme} theme:`, validation.failures);
          
          // Auto-correct critical contrast issues
          const criticalFailures = validation.failures.filter(f => f.ratio < 3);
          if (criticalFailures.length > 0) {
            console.log('🔧 Auto-correcting critical contrast issues...');
            
            // Apply fallback colors for critical failures
            const fallback = FALLBACK_THEMES[newTheme];
            root.style.setProperty('--background', fallback.bg);
            root.style.setProperty('--foreground', fallback.fg);
            
            console.log('✅ Applied fallback contrast-safe colors');
            
            // Re-validate after correction
            setTimeout(() => {
              const revalidation = validateThemeContrast();
              setContrastValidation(revalidation);
              if (revalidation.isValid) {
                console.log('✅ Contrast issues resolved with fallback colors');
              }
            }, 100);
          }
        } else {
          console.log(`✅ ${newTheme} theme passes WCAG AA contrast requirements`);
        }
      } catch (error) {
        console.error('❌ Contrast validation failed:', error);
        // Apply safe fallback on validation error
        const fallback = FALLBACK_THEMES[newTheme];
        root.style.setProperty('--background', fallback.bg);
        root.style.setProperty('--foreground', fallback.fg);
      }
    }, 150);
  }, [isInitialized]);

  // Apply default theme immediately on mount (before any data loads)
  useEffect(() => {
    const localTheme = localStorage.getItem('theme') as ThemeMode | null;
    const initialTheme = (localTheme && ['vibgyor', 'dark', 'light'].includes(localTheme)) ? localTheme : 'vibgyor';
    
    // Apply theme immediately without waiting for backend
    applyTheme(initialTheme);
    setThemeState(initialTheme);
    
    console.log('🎨 Initial theme applied immediately:', initialTheme);
    
    // Mark as initialized after a short delay
    setTimeout(() => setIsInitialized(true), 100);
  }, [applyTheme]);

  // Sync with user profile when available
  useEffect(() => {
    if (!isInitialized || !identity || !userProfile?.themePreference) return;

    const savedTheme = userProfile.themePreference as ThemeMode;
    if (['vibgyor', 'dark', 'light'].includes(savedTheme) && savedTheme !== theme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
      localStorage.setItem('theme', savedTheme);
      console.log(`✅ Synced theme from user profile: ${savedTheme}`);
    }
  }, [userProfile, identity, isInitialized, theme, applyTheme]);

  const setTheme = async (newTheme: ThemeMode) => {
    if (!['vibgyor', 'dark', 'light'].includes(newTheme)) {
      console.error('❌ Invalid theme:', newTheme);
      return;
    }

    console.log(`🎨 Switching theme to: ${newTheme}`);

    // Update state and apply immediately
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to localStorage for persistence
    localStorage.setItem('theme', newTheme);
    
    // Save to backend for authenticated users (non-blocking)
    if (identity) {
      try {
        await updateTheme.mutateAsync(newTheme);
        console.log(`✅ Theme saved to backend: ${newTheme}`);
      } catch (error) {
        console.error('❌ Failed to save theme to backend:', error);
        // Theme is still applied locally even if backend save fails
      }
    } else {
      console.log(`✅ Theme saved to localStorage (guest): ${newTheme}`);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        isLoading: false, // Never block UI on theme loading
        contrastValidation,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Safe fallback: return default theme context to prevent crashes
    console.error('⚠️ useTheme must be used within a ThemeProvider. Using fallback default theme.');
    return {
      theme: 'vibgyor' as ThemeMode,
      setTheme: () => {
        console.error('⚠️ Cannot set theme: ThemeProvider not found in component tree');
      },
      isLoading: false,
      contrastValidation: null,
    };
  }
  return context;
}
