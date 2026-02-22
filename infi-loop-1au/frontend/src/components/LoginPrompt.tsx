import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Shield, Database, TrendingUp } from 'lucide-react';

export default function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
              <Network className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to InfiLoop</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modular, scalable, decentralized information-exchange platform with trackable data provenance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Database className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Domain Management</CardTitle>
              <CardDescription>
                Ingest, deduplicate, and manage large-scale domain lists with automatic synchronization
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Network className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Smart URL Generator</CardTitle>
              <CardDescription>
                Create customizable URL templates with variable placeholders and pattern support
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Data Provenance</CardTitle>
              <CardDescription>
                Track data integrity with Merkle tree-based verification and audit trails
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <TrendingUp className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Get Started</h3>
                <p className="text-muted-foreground mb-4">
                  Login to access domain management, URL generation, and analytics features
                </p>
              </div>
              <Button size="lg" onClick={handleLogin} disabled={loginStatus === 'logging-in'}>
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
