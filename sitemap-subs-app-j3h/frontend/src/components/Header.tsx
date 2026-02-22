import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Moon, Sun, Menu, Search, LayoutDashboard } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/generated/sitemap-icon-transparent.dim_64x64.png" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SitemapHub
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-sm font-medium transition-colors hover:text-primary">
              <Search className="inline h-4 w-4 mr-1" />
              Search
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  <LayoutDashboard className="inline h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link to="/analytics" className="text-sm font-medium transition-colors hover:text-primary">
                  Analytics
                </Link>
                <Link to="/referral" className="text-sm font-medium transition-colors hover:text-primary">
                  Referral
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isAuthenticated && userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex">
                  {userProfile.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: '/subscription' })}>
                  Subscription
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button onClick={handleAuth} disabled={disabled} className="hidden md:flex">
            {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/search" className="text-lg font-medium">Search</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className="text-lg font-medium">Dashboard</Link>
                    <Link to="/analytics" className="text-lg font-medium">Analytics</Link>
                    <Link to="/referral" className="text-lg font-medium">Referral</Link>
                    <Link to="/subscription" className="text-lg font-medium">Subscription</Link>
                    <Link to="/admin" className="text-lg font-medium">Admin</Link>
                  </>
                )}
                <Button onClick={handleAuth} disabled={disabled} className="mt-4">
                  {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
