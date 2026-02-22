import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <Shield className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Authentication Required</h1>
          <p className="text-muted-foreground">
            Terror Uproot is a secure platform for security research and emergency response coordination.
            Please authenticate to access the system.
          </p>
        </div>

        <div className="rounded-lg border border-warning bg-warning/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium text-warning">Authorized Access Only</p>
              <p className="text-muted-foreground mt-1">
                This platform handles sensitive security data. All access is logged and monitored.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={login} 
          disabled={isLoggingIn}
          size="lg"
          className="w-full"
        >
          {isLoggingIn ? 'Authenticating...' : 'Login with Internet Identity'}
        </Button>

        <p className="text-xs text-muted-foreground">
          By logging in, you agree to use this platform ethically and in accordance with applicable laws.
        </p>
      </div>
    </div>
  );
}

