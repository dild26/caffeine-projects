import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllSecoinfiApps } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Moon, Sun, LogOut, User, Menu, Search, ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

export default function Header() {
  const { clear, identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: apps = [], isLoading: appsLoading } = useGetAllSecoinfiApps();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const appCount = apps.length;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'Pros', path: '/pros' },
    { 
      label: appCount > 0 ? `${appCount}${appCount >= 26 ? '+' : ''} Secoinfi-Apps` : 'Secoinfi-Apps', 
      path: '/apps' 
    },
    { label: 'Sitemap', path: '/sitemap' },
  ];

  const filteredApps = apps.filter((app) => {
    const search = searchTerm.toLowerCase();
    return (
      app.name.toLowerCase().includes(search) ||
      app.description.toLowerCase().includes(search)
    );
  });

  const filteredPages = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={location.pathname === item.path ? 'default' : 'ghost'}
          onClick={() => navigate({ to: item.path })}
          className={mobile ? 'w-full justify-start' : ''}
        >
          {item.label}
        </Button>
      ))}
      {isAuthenticated && (
        <Button
          variant={location.pathname === '/admin' ? 'default' : 'ghost'}
          onClick={() => navigate({ to: '/admin' })}
          className={mobile ? 'w-full justify-start' : ''}
        >
          Admin
        </Button>
      )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
                <span className="text-xl font-bold text-primary-foreground">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Multi-Apps-Unify</h1>
                <p className="text-xs text-muted-foreground">Specification Management Platform</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-2 lg:flex">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userProfile?.email || ''}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} disabled={isLoggingIn} size="sm" className="hidden md:flex">
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 pt-6">
                  <NavLinks mobile />
                  {!isAuthenticated && (
                    <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full justify-start">
                      {isLoggingIn ? 'Logging in...' : 'Login'}
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search pages and applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {/* Pages Section */}
                {filteredPages.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Pages</h3>
                    <div className="space-y-1">
                      {filteredPages.map((page) => (
                        <button
                          key={page.path}
                          onClick={() => {
                            navigate({ to: page.path });
                            setSearchOpen(false);
                            setSearchTerm('');
                          }}
                          className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                        >
                          <Badge variant="outline">Page</Badge>
                          <span className="font-medium">{page.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apps Section */}
                {filteredApps.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Secoinfi-Apps {!appsLoading && `(${filteredApps.length})`}
                    </h3>
                    <div className="space-y-1">
                      {filteredApps.map((app, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                        >
                          <Badge variant="default" className="mt-0.5">
                            App
                          </Badge>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{app.name}</span>
                              {app.url && (
                                <a
                                  href={app.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground transition-colors hover:text-primary"
                                  onClick={(e) => e.stopPropagation()}
                                  title={`Visit ${app.name}`}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchTerm && filteredPages.length === 0 && filteredApps.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No results found for "{searchTerm}"
                  </div>
                )}

                {!searchTerm && (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="mb-2">Start typing to search pages and applications</p>
                    {!appsLoading && appCount > 0 && (
                      <p className="text-xs">
                        {appCount} {appCount === 1 ? 'app' : 'apps'} available to search
                      </p>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
              <span>Press Ctrl+K or Cmd+K to open search</span>
              {!appsLoading && (
                <span>
                  {appCount} {appCount === 1 ? 'app' : 'apps'} available
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
