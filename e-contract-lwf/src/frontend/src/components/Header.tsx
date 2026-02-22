import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetAllPages } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileText, Moon, Sun, LogOut, LogIn, Search, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import SitemapMenu from './SitemapMenu';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: allPages = [] } = useGetAllPages();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('econtract-cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(count);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: '/sitemap', search: { q: searchTerm } });
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  // Separate pages by access level and remove duplicates
  const { publicPages, adminPages } = useMemo(() => {
    const seen = new Set<string>();
    const pub: typeof allPages = [];
    const admin: typeof allPages = [];

    allPages.forEach(page => {
      if (!seen.has(page.path)) {
        seen.add(page.path);
        if (page.isAdminOnly) {
          admin.push(page);
        } else {
          pub.push(page);
        }
      }
    });

    return { publicPages: pub, adminPages: admin };
  }, [allPages]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-tight">E-Contracts</h1>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {publicPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Menu <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[70vh] overflow-y-auto w-56">
                  {publicPages.map((item) => (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate({ to: item.path })}
                      className="text-sm"
                    >
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isAdmin && adminPages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Admin <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[70vh] overflow-y-auto w-56">
                  {adminPages.map((item) => (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate({ to: item.path })}
                      className="text-sm"
                    >
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-[70vh] overflow-y-auto">
              {publicPages.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className="text-sm"
                >
                  {item.title}
                </DropdownMenuItem>
              ))}
              {isAdmin && adminPages.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {adminPages.map((item) => (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate({ to: item.path })}
                      className="text-sm"
                    >
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-32 sm:w-48 h-8 text-sm"
                autoFocus
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 200);
                }}
              />
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/cart' })}
            className="h-8 w-8 relative"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>

          {isAuthenticated && userProfile && (
            <div className="hidden md:flex items-center gap-2 rounded-full bg-muted px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-medium">{userProfile.name}</span>
            </div>
          )}

          <SitemapMenu position="top-right" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="h-8 text-xs"
          >
            {disabled ? (
              'Logging in...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Logout</span>
              </>
            ) : (
              <>
                <LogIn className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Login</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="border-t border-border/40 bg-muted/30">
        <div className="container flex h-10 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Real-time updates enabled</span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-7 w-48 text-xs"
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
