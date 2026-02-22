import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Menu, X, BookOpen, LogIn } from 'lucide-react';
import { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import SearchMenu from './SearchMenu';
import { useGetAllNavigationItemsSorted } from '../hooks/useQueries';
import { Skeleton } from './ui/skeleton';

export default function Header() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: allNavItems, isLoading: navLoading } = useGetAllNavigationItemsSorted();

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

  // Get public menu items from backend
  const publicMenuItems = allNavItems?.filter(item => 
    item.isPublic && item.type === 'menu' && item.url !== '/'
  ).slice(0, 6) || [];

  // Fallback menu items if backend data is not loaded
  const fallbackMenuItems = [
    { url: '/dashboard', navLabel: 'Dashboard' },
    { url: '/explore', navLabel: 'Explore' },
    { url: '/resources', navLabel: 'Resources' },
    { url: '/instructors', navLabel: 'Instructors' },
    { url: '/about', navLabel: 'About' },
    { url: '/contact', navLabel: 'Contact' },
  ];

  const mainNavLinks = publicMenuItems.length > 0 
    ? publicMenuItems.map(item => ({ to: item.url, label: item.navLabel }))
    : fallbackMenuItems.map(item => ({ to: item.url, label: item.navLabel }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          aria-label="Go to homepage"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">E-Tutorial</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </>
          ) : (
            mainNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                {link.label}
              </Link>
            ))
          )}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeSelector />
          <SearchMenu />
          <Button 
            onClick={handleAuth} 
            variant={isAuthenticated ? "outline" : "default"}
            size="sm" 
            className="hidden md:flex"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Logging in...
              </>
            ) : isAuthenticated ? (
              'Logout'
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 flex flex-col space-y-3">
            {navLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </>
            ) : (
              mainNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  activeProps={{ className: 'text-primary' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))
            )}
            <Button 
              onClick={handleAuth} 
              variant={isAuthenticated ? "outline" : "default"}
              size="sm" 
              className="w-full mt-4"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
