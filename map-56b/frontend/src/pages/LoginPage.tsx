import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Shield, Zap, Globe, TrendingUp, Users } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isLoggingIn = loginStatus === 'logging-in';

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (identity && loginStatus === 'success') {
      navigate({ to: '/moap' });
    }
  }, [identity, loginStatus, navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,oklch(var(--primary)/0.05),transparent_50%),radial-gradient(ellipse_at_bottom_right,oklch(var(--accent)/0.1),transparent_50%),oklch(var(--background))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src="/assets/generated/moap-logo-transparent.dim_200x200.png" alt="MOAP Logo" className="w-20 h-20 animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gradient">
                MOAP
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Mother Of All Platforms</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Legally Exploring & Unifying the World's Top 26 Domains
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A high-performance, scalable, modular platform that unifies the pros, USPs, functionalities, design, and business trends of global leaders—built to serve billions of users with on-demand products and services.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="card-3d card-3d-hover p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 neon-glow">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">26 Global Domain References</h3>
                  <p className="text-sm text-muted-foreground">
                    Legal exploration of e-commerce, search, social media, streaming, communication, and more
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d card-3d-hover p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 neon-glow">
                  <Layers className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Modular & Resilient Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    Unified features with scalable design patterns for high-performance delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d card-3d-hover p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-secondary/10 neon-glow">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Billion-User Scalability</h3>
                  <p className="text-sm text-muted-foreground">
                    Built for massive scale with on-demand products and services worldwide
                  </p>
                </div>
              </div>
            </div>

            <div className="card-3d card-3d-hover p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-success/10 neon-glow">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Business Trend Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    USP analysis and competitive intelligence from industry leaders
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <img src="/assets/generated/secoinfi-logo-transparent.dim_150x150.png" alt="SECOINFI" className="w-8 h-8" />
              <p className="text-sm font-semibold">SECOINFI / Sudha Enterprises</p>
            </div>
            <p className="text-xs text-muted-foreground">
              PIN 560097 • All-in-One Products & Services Platform
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="card-3d shadow-neon-lg">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl">Welcome to MOAP</CardTitle>
              <CardDescription className="text-base">
                Sign in to explore the unified platform management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted border-3px border-primary/20 relative">
                <img
                  src="/assets/generated/dashboard-3d-mockup.dim_1024x768.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="gradient-border p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gradient">26</div>
                  <div className="text-xs text-muted-foreground mt-1">Domain References</div>
                </div>
                <div className="gradient-border p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gradient-secondary">1B+</div>
                  <div className="text-xs text-muted-foreground mt-1">User Capacity</div>
                </div>
              </div>

              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full h-12 text-lg font-semibold neon-glow"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign in with Internet Identity
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure authentication powered by Internet Computer blockchain
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <div className="gradient-border p-3 rounded-lg text-center">
              <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-xs font-medium">Fast</div>
            </div>
            <div className="gradient-border p-3 rounded-lg text-center">
              <Shield className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-xs font-medium">Secure</div>
            </div>
            <div className="gradient-border p-3 rounded-lg text-center">
              <Layers className="w-5 h-5 text-secondary mx-auto mb-1" />
              <div className="text-xs font-medium">Modular</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
