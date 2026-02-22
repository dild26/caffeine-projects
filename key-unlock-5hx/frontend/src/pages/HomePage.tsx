import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Key, Globe } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to SECOINFI Authentication System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, decentralized identity management powered by Internet Computer blockchain technology
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <>
                <Button size="lg" onClick={() => navigate({ to: '/dashboard' })}>
                  Go to Dashboard
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/contact' })}>
                  Contact Us
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/about' })}>
                  Learn More
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/contact' })}>
                  Contact Us
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                Military-grade encryption protects your identity
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Private</CardTitle>
              <CardDescription>
                Your data remains under your control
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Key className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Decentralized</CardTitle>
              <CardDescription>
                No central authority controls your identity
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Universal</CardTitle>
              <CardDescription>
                One identity across multiple platforms
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect Your Identity</h3>
                <p className="text-muted-foreground">
                  Use Internet Identity to securely authenticate without passwords
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Set up your profile information on first login
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Access Securely</h3>
                <p className="text-muted-foreground">
                  Enjoy seamless access across all SECOINFI services
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated && (
          <Card className="border-2 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription className="text-base">
                Click the "Login" button in the header to authenticate with Internet Identity and access all features
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
