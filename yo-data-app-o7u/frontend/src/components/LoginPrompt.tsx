import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Lock, TrendingUp, Users } from 'lucide-react';

export default function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <img
            src="/assets/generated/data-flow-hero.dim_1200x400.png"
            alt="Data Flow"
            className="mx-auto mb-8 rounded-lg shadow-lg"
          />
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to <span className="text-primary">YO-Data</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            A comprehensive data management and analytics platform that enables you to ingest, process, query, and
            visualize data from multiple sources.
          </p>
          <Button size="lg" onClick={handleLogin} disabled={isLoggingIn} className="px-8">
            {isLoggingIn ? 'Connecting...' : 'Get Started'}
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Database className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Data Ingestion</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Import data from CSV, JSON, Excel, and other structured formats</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Execute queries and perform advanced analytics on your datasets</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <img src="/assets/generated/data-viz-icons.dim_400x400.png" alt="Visualization" className="mb-2 h-8 w-8" />
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Create beautiful charts and dashboards to visualize insights</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Role-based access control with Internet Identity authentication</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
