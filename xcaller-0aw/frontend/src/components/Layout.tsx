import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Link2, FileText, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SiCoffeescript } from 'react-icons/si';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              <Link2 className="h-6 w-6 text-primary" />
              DomainHub
            </button>
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant={currentPath === '/' ? 'secondary' : 'ghost'}
                onClick={() => navigate({ to: '/' })}
                className="font-medium"
              >
                Features
              </Button>
              <Button
                variant={currentPath === '/terms' ? 'secondary' : 'ghost'}
                onClick={() => navigate({ to: '/terms' })}
                className="font-medium"
              >
                <FileText className="h-4 w-4 mr-2" />
                Terms
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="font-medium"
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30 backdrop-blur">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © 2025. Built with <SiCoffeescript className="h-4 w-4 text-primary" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button
              onClick={() => navigate({ to: '/terms' })}
              className="hover:text-foreground transition-colors"
            >
              Privacy & Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
