import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred in the application
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg text-left">
          <p className="text-sm font-mono text-destructive break-words">
            {error.message}
          </p>
        </div>

        <div className="space-y-2">
          <Button onClick={resetErrorBoundary} className="w-full">
            Reset Application
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Reload Page
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          If this problem persists, try clearing your browser cache or contact support
        </p>
      </div>
    </div>
  );
}
