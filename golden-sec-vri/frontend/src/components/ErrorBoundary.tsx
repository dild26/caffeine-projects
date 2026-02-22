import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service if available
    if (typeof window !== 'undefined' && (window as any).errorLogger) {
      (window as any).errorLogger.log({
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
  }

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // If too many errors, suggest reload
      const tooManyErrors = this.state.errorCount > 3;

      return (
        <div className="container px-4 py-8 animate-in fade-in duration-300">
          <Card className="border-destructive shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-destructive">Something went wrong</CardTitle>
                  <CardDescription>
                    {tooManyErrors 
                      ? 'Multiple errors detected. A page reload is recommended.'
                      : 'An unexpected error occurred. Please try one of the options below.'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <Alert variant="destructive">
                  <Bug className="h-4 w-4" />
                  <AlertTitle>Error Details</AlertTitle>
                  <AlertDescription className="font-mono text-xs break-all">
                    {this.state.error.toString()}
                  </AlertDescription>
                </Alert>
              )}
              
              {this.state.errorInfo && process.env.NODE_ENV === 'development' && (
                <details className="rounded-lg border border-destructive/50 p-4 bg-destructive/5">
                  <summary className="cursor-pointer font-semibold text-sm text-destructive hover:text-destructive/80 transition-colors">
                    Stack Trace (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs overflow-x-auto max-h-64 text-muted-foreground">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {tooManyErrors && (
                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 dark:text-amber-200">
                    Multiple Errors Detected
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    The application has encountered {this.state.errorCount} errors. 
                    We recommend reloading the page to reset the application state.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                {!tooManyErrors && (
                  <Button onClick={this.handleReset} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                )}
                <Button 
                  onClick={this.handleReload} 
                  variant={tooManyErrors ? 'default' : 'outline'}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <p className="font-semibold">Troubleshooting Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Try clearing your browser cache and cookies</li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Try accessing the page in an incognito/private window</li>
                  <li>If the problem persists, contact support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
