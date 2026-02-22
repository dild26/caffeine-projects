import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            {isAuthenticated
              ? 'You do not have permission to access this page. This page is restricted to administrators or subscribers only.'
              : 'This page requires authentication. Please log in to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated && (
            <Button onClick={login} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login to Continue
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
