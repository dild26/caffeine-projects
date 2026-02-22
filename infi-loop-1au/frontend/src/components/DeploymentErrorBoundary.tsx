import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class DeploymentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for monitoring
    console.error(`[${this.props.componentName}] Error caught by boundary:`, {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    // Increment error count for self-healing logic
    this.setState((prevState) => ({
      errorCount: prevState.errorCount + 1,
    }));

    // Self-healing: Auto-reload if too many errors
    if (this.state.errorCount >= 3) {
      console.warn(`[${this.props.componentName}] Multiple errors detected, initiating auto-reload...`);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 border border-destructive rounded-lg bg-destructive/10 my-4">
          <div className="text-destructive text-lg font-semibold mb-2">
            Component Error: {this.props.componentName}
          </div>
          <div className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          {this.state.errorCount >= 3 && (
            <div className="text-xs text-yellow-600 mb-4">
              Auto-reloading in 3 seconds...
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
