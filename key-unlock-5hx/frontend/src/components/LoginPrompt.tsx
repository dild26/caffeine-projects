import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Zap } from 'lucide-react';

export default function LoginPrompt() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <img
            src="/assets/generated/security-shield-transparent.dim_64x64.png"
            alt="Security"
            className="w-16 h-16"
          />
        </div>
        <h2 className="text-3xl font-bold mb-2">Welcome to Auth System</h2>
        <p className="text-muted-foreground text-lg">
          Secure authentication powered by Internet Identity
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Secure</CardTitle>
            <CardDescription>
              End-to-end encryption with blockchain-based identity
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Private</CardTitle>
            <CardDescription>
              No passwords, no tracking, complete privacy control
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Fast</CardTitle>
            <CardDescription>
              Instant authentication with seamless user experience
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Click the "Login" button in the header to authenticate with Internet Identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <img
              src="/assets/generated/mobile-auth.dim_200x200.png"
              alt="Mobile Authentication"
              className="w-32 h-32 rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click the Login button to start authentication</li>
                <li>Create or use your Internet Identity</li>
                <li>Set up your profile with your name</li>
                <li>Access your secure dashboard</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
