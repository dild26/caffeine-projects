import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Shield, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false, requireAuth = true }: ProtectedRouteProps) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show loading state while checking authentication
  if (isInitializing || (isAuthenticated && isAdminLoading)) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
              <LogIn className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription className="text-base">
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                This page requires authentication. Please log in to continue.
              </p>
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full sm:w-auto"
              >
                {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-2 border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10 w-fit">
              <Shield className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription className="text-base">
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="h-5 w-5" />
                <p>This page is restricted to administrators only.</p>
              </div>
              <p className="text-sm text-muted-foreground">
                If you believe you should have access, please contact the system administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
