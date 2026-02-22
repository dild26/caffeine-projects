import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { FileText, Mic, Volume2 } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/contract-icon-transparent.dim_128x128.png" 
              alt="E-Contracts" 
              className="h-20 w-20 drop-shadow-2xl"
            />
            <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-7xl">
              E-Contracts
            </h1>
          </div>
          <p className="max-w-2xl text-xl text-muted-foreground md:text-2xl">
            Decentralized contract management with AI-powered voice assistance
          </p>
        </div>

        {/* Hero Image */}
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-sm">
          <img 
            src="/assets/generated/dashboard-hero.dim_1200x400.png" 
            alt="Dashboard Preview" 
            className="h-auto w-full"
          />
        </div>

        {/* Features Grid */}
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="rounded-full bg-primary/10 p-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Smart Contracts</h3>
            <p className="text-center text-sm text-muted-foreground">
              Create, manage, and execute digital contracts with ease
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-accent/50 hover:shadow-lg">
            <div className="rounded-full bg-accent/10 p-4">
              <Mic className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Voice Commands</h3>
            <p className="text-center text-sm text-muted-foreground">
              Navigate and control with natural voice interactions
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-secondary/50 hover:shadow-lg">
            <div className="rounded-full bg-secondary/10 p-4">
              <Volume2 className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold">AI Assistance</h3>
            <p className="text-center text-sm text-muted-foreground">
              Get natural language responses with text-to-speech
            </p>
          </div>
        </div>

        {/* Login Button */}
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          className="group relative overflow-hidden px-12 py-6 text-lg font-semibold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
        >
          <span className="relative z-10">
            {isLoggingIn ? 'Connecting...' : 'Get Started'}
          </span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </Button>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          © 2025. Built with ❤️ using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
