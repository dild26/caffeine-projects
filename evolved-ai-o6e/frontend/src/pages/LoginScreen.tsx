import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-background border border-border/50 shadow-xl overflow-hidden p-1">
            <img src="/assets/logo.png" alt="Evolved AI Logo" className="h-full w-full object-cover rounded-xl" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent italic">
              Evolved-AI
            </CardTitle>
            <CardDescription className="mt-2 text-base font-medium text-muted-foreground/80">
              Scaffold Platform - Dynamic Module Management
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 rounded-lg bg-muted/50 p-4">
            <h3 className="font-semibold text-sm">Platform Features:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Real-time module configuration</li>
              <li>• Dynamic blueprint management</li>
              <li>• CSV fixture imports</li>
              <li>• YAML pipeline processing</li>
            </ul>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold shadow-lg"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Login with Internet Identity'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
