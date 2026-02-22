import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">E-Tutorial</CardTitle>
            <CardDescription className="text-base">
              Educational Resource Management Platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-sm text-muted-foreground text-center">
            <p>Secure authentication with Internet Identity</p>
            <p>Manage resources, instructors, and appointments</p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>
                Logging in...
              </span>
            ) : (
              'Login to Get Started'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By logging in, you agree to our terms of service
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
