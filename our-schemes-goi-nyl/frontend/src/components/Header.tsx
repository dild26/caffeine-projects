import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, InfoIcon, ShieldIcon, CreditCardIcon } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/logo.png" alt="ourSchemes Logo" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">ourSchemes</span>
            <span className="text-xs text-muted-foreground">Government Schemes Search</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/about' })}
            className="gap-2"
          >
            <InfoIcon className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const element = document.getElementById('pinned-schemes');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="gap-2"
          >
            <BookmarkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">My List</span>
          </Button>

          {/* Restricted navigation - only show when authenticated */}
          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
                className="gap-2"
              >
                <ShieldIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/subscription' })}
                className="gap-2"
              >
                <CreditCardIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Subscription</span>
              </Button>
            </>
          )}

          <Button
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="ml-2"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </nav>
      </div>
    </header>
  );
}
