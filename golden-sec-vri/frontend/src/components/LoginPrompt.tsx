import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Building2, Shield, TrendingUp, Users } from 'lucide-react';

export default function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();

  const features = [
    {
      icon: Building2,
      title: 'Fractional Ownership',
      description: 'Invest in premium properties with fractional ownership options',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Updates',
      description: 'Get instant price updates and market insights',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Built on Internet Computer for maximum security',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a growing community of property investors',
    },
  ];

  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <img
            src="/assets/generated/property-hero-banner.dim_1200x400.png"
            alt="Property Investment"
            className="mx-auto mb-8 w-full max-w-4xl rounded-2xl shadow-2xl"
          />
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Welcome to SECoin Property Investment Platform
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover premium real estate investment opportunities with fractional ownership.
            Login to explore properties and start investing today.
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-md border-2 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Login with Internet Identity to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Button
                onClick={login}
                disabled={loginStatus === 'logging-in'}
                size="lg"
                className="w-full max-w-xs"
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  'Login with Internet Identity'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
