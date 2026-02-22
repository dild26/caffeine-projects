import { useEffect, useState } from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { useIsCallerAdmin } from '../hooks/useQueries';

const AUTO_DISMISS_SUCCESS = 3000;
const AUTO_DISMISS_WARNING = 10000;

export default function ContrastAlert() {
  const { theme, contrastValidation } = useTheme();
  const { data: isAdmin } = useIsCallerAdmin();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when theme changes
  useEffect(() => {
    setDismissed(false);
  }, [theme]);

  // Auto-dismiss logic
  useEffect(() => {
    if (!contrastValidation || dismissed || !isAdmin) return;

    if (contrastValidation.isValid) {
      const timer = setTimeout(() => setDismissed(true), AUTO_DISMISS_SUCCESS);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setDismissed(true), AUTO_DISMISS_WARNING);
      return () => clearTimeout(timer);
    }
  }, [contrastValidation, dismissed, isAdmin]);

  // Don't show if not admin, dismissed, or no validation data
  if (!isAdmin || dismissed || !contrastValidation) {
    return null;
  }

  // Show success message
  if (contrastValidation.isValid) {
    return (
      <Alert className="fixed bottom-4 left-4 max-w-md z-50 shadow-lg border-green-500 bg-green-50 dark:bg-green-950 animate-in slide-in-from-bottom-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <AlertTitle className="text-green-900 dark:text-green-100">
              Contrast Validated ✓
            </AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              <p className="text-sm">
                The <strong>{theme}</strong> theme meets WCAG AA standards for accessibility.
              </p>
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1 text-green-600 hover:text-green-700"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    );
  }

  // Show warning for contrast failures
  return (
    <Alert variant="destructive" className="fixed bottom-4 left-4 max-w-md z-50 shadow-lg animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <AlertTitle className="mb-2 flex items-center gap-2">
            Contrast Issues Detected
            <Badge variant="destructive" className="text-xs">
              {contrastValidation.failures.length}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            <p className="mb-2 text-sm">
              The <strong>{theme}</strong> theme has contrast issues that have been auto-corrected:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 max-h-32 overflow-y-auto">
              {contrastValidation.failures.map((failure, idx) => (
                <li key={idx}>
                  <strong>{failure.pair}</strong>: {failure.ratio.toFixed(2)}:1 
                  (needs {failure.required}:1)
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs opacity-90">
              Fallback colors have been applied to ensure readability. WCAG AA requires 4.5:1 contrast for normal text.
            </p>
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mt-1 -mr-1"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
