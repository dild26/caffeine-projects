import { useEffect, useState } from 'react';
import { XCircle, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { useValidateMenuAndThemeData, useGetDefaultThemes, useGetAllNavigationItemsSorted } from '../hooks/useQueries';

const VALIDATION_TIMEOUT = 15000; // 15 seconds timeout
const AUTO_DISMISS_SUCCESS = 4000; // Auto-dismiss success after 4 seconds
const AUTO_DISMISS_WARNING = 8000; // Auto-dismiss warning after 8 seconds

export default function ValidationAlert() {
  const { data: isValid, isLoading, error } = useValidateMenuAndThemeData();
  const { data: themes, isLoading: themesLoading } = useGetDefaultThemes();
  const { data: navItems, isLoading: navLoading } = useGetAllNavigationItemsSorted();
  const [showAlert, setShowAlert] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Timeout mechanism to prevent indefinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading || themesLoading || navLoading) {
        console.warn('⚠️ Validation timeout reached - dismissing loading indicator');
        setTimedOut(true);
        setShowAlert(false);
      }
    }, VALIDATION_TIMEOUT);

    return () => clearTimeout(timer);
  }, [isLoading, themesLoading, navLoading]);

  // Handle validation state changes
  useEffect(() => {
    // Don't show anything if dismissed or timed out
    if (dismissed || timedOut) return;

    // Still loading - show nothing (let DataSeeder handle initial loading)
    if (isLoading || themesLoading || navLoading) {
      return;
    }

    // Error state - show warning
    if (error) {
      console.error('❌ Validation error:', error);
      setShowAlert(true);
      setShowSuccess(false);
      
      // Auto-dismiss error after timeout
      const timer = setTimeout(() => {
        setShowAlert(false);
        setDismissed(true);
      }, AUTO_DISMISS_WARNING);
      
      return () => clearTimeout(timer);
    }

    // Success state
    if (isValid === true) {
      console.log('✅ Validation passed - all data present');
      setShowSuccess(true);
      setShowAlert(false);
      
      // Auto-dismiss success message
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setDismissed(true);
      }, AUTO_DISMISS_SUCCESS);
      
      return () => clearTimeout(timer);
    }

    // Validation failed - show warning
    if (isValid === false) {
      console.warn('⚠️ Validation failed - checking details...');
      console.log('Themes:', themes?.length || 0, themes?.map(t => t.name));
      console.log('Navigation items:', navItems?.length || 0);
      console.log('Public navigation items:', navItems?.filter(n => n.isPublic).length || 0);
      
      setShowAlert(true);
      setShowSuccess(false);
      
      // Auto-dismiss warning after timeout
      const timer = setTimeout(() => {
        setShowAlert(false);
        setDismissed(true);
      }, AUTO_DISMISS_WARNING);
      
      return () => clearTimeout(timer);
    }
  }, [isValid, isLoading, themesLoading, navLoading, error, dismissed, timedOut, themes, navItems]);

  // Success message
  if (showSuccess && !showAlert) {
    return (
      <Alert className="fixed bottom-4 right-4 max-w-md z-50 shadow-lg border-green-500/50 bg-green-50 dark:bg-green-950/20 animate-in slide-in-from-bottom-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <AlertTitle className="mb-1 text-green-800 dark:text-green-200">Platform Ready</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
              All navigation items and themes loaded successfully.
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1 text-green-600 hover:text-green-700"
            onClick={() => {
              setShowSuccess(false);
              setDismissed(true);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    );
  }

  // Don't show loading alert if timed out or dismissed
  if (!showAlert || dismissed || timedOut) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md z-50 shadow-lg animate-in slide-in-from-bottom-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <AlertTitle className="mb-2">Validation Error</AlertTitle>
            <AlertDescription>
              <p className="text-sm">Failed to validate platform data. The application will continue to function.</p>
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={() => {
              setShowAlert(false);
              setDismissed(true);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    );
  }

  // Validation failed - show missing items
  const hasVibgyor = themes?.some(t => t.name === 'VIBGYOR') ?? false;
  const hasDark = themes?.some(t => t.name === 'Dark') ?? false;
  const hasLight = themes?.some(t => t.name === 'Light') ?? false;
  const hasHome = navItems?.some(n => n.url === '/' && n.isPublic) ?? false;
  const publicItemsCount = navItems?.filter(n => n.isPublic).length || 0;

  const missingItems: string[] = [];
  if (!hasVibgyor) missingItems.push('VIBGYOR theme');
  if (!hasDark) missingItems.push('Dark theme');
  if (!hasLight) missingItems.push('Light theme');
  if (!hasHome) missingItems.push('Home navigation');
  if (publicItemsCount === 0) missingItems.push('Public navigation items');

  // Only show if there are actually missing items
  if (missingItems.length === 0) {
    return null;
  }

  return (
    <Alert className="fixed bottom-4 right-4 max-w-md z-50 shadow-lg border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-600 dark:text-yellow-400" />
        <div className="flex-1">
          <AlertTitle className="mb-2 text-yellow-800 dark:text-yellow-200">Initializing Platform</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            <p className="mb-2 text-sm">Setting up platform data...</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              {missingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs opacity-90">
              This will complete automatically. You can dismiss this message.
            </p>
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mt-1 -mr-1 text-yellow-600 hover:text-yellow-700"
          onClick={() => {
            setShowAlert(false);
            setDismissed(true);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
