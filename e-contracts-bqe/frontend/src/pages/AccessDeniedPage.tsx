import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function AccessDeniedPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-destructive/10 p-4 text-destructive">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <CardTitle className="text-3xl">Access Denied</CardTitle>
            <CardDescription className="text-base">
              {isAuthenticated
                ? 'You do not have permission to access this page. This page is restricted to administrators only.'
                : 'This page requires authentication. Please log in to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {isAuthenticated ? (
              <>
                <p className="text-center text-sm text-muted-foreground">
                  If you believe you should have access to this page, please contact your administrator.
                </p>
                <Button
                  onClick={() => navigate({ to: '/' })}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Home
                </Button>
              </>
            ) : (
              <>
                <p className="text-center text-sm text-muted-foreground">
                  Please log in with an administrator account to access this page.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={login}
                    disabled={isLoggingIn}
                    className="gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go to Home
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
