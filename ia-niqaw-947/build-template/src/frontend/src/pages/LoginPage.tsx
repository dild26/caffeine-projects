import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Shield, Users, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/secoinfi-logo-transparent.png" alt="SECOINFI" className="h-12 w-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SECOINFI
            </h1>
          </div>
          <h2 className="text-3xl font-bold">Business Management Platform</h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive CRM, billing, and product management solution built on the Internet Computer.
          </p>

          <div className="grid gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">CRM & Contact Management</h3>
                <p className="text-sm text-muted-foreground">Organize contacts, tags, and customer relationships</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Billing & Invoicing</h3>
                <p className="text-sm text-muted-foreground">Stripe integration with invoice generation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">Multi-tenant with admin, sales, billing, and viewer roles</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in with Internet Identity to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full gap-2">
              <LogIn className="h-5 w-5" />
              {isLoggingIn ? 'Connecting...' : 'Login with Internet Identity'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by the Internet Computer
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
