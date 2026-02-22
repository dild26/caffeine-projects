import { useState, useMemo } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetNavigationMenu } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, Settings, User, Menu, Search, Lock } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: menuItems } = useGetNavigationMenu();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const initials = userProfile?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  const isActivePath = (path: string) => {
    return routerState.location.pathname === path;
  };

  const handleNavigate = (path: string, requiresAdmin: boolean) => {
    if (requiresAdmin && !isAdmin) {
      navigate({ to: '/access-denied' });
    } else {
      navigate({ to: path });
    }
    setMenuOpen(false);
  };

  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!menuItems) return [];
    if (!searchQuery.trim()) return menuItems;

    const query = searchQuery.toLowerCase();
    return menuItems.filter(item =>
      item.displayName.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img 
              src="/assets/generated/contract-icon-transparent.dim_128x128.png" 
              alt="E-Contracts" 
              className="h-10 w-10"
            />
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
              E-Contracts
            </h1>
          </button>

          {/* Right-aligned Actions */}
          <div className="flex items-center gap-2">
            {/* Navigation Menu with Search */}
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 bg-card/30 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Navigation</h3>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-9 text-sm"
                    />
                  </div>

                  {searchQuery && (
                    <p className="text-xs text-muted-foreground">
                      Found {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''}
                    </p>
                  )}

                  {/* Menu Items */}
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map((item) => (
                          <Button
                            key={item.id}
                            variant={isActivePath(item.url) ? 'default' : 'ghost'}
                            className={cn(
                              'w-full justify-start gap-2',
                              isActivePath(item.url) && 'bg-primary text-primary-foreground'
                            )}
                            onClick={() => handleNavigate(item.url, item.requiresAdmin)}
                          >
                            <span className="flex-1 text-left">{item.displayName}</span>
                            {item.requiresAdmin && (
                              <Lock className="h-3 w-3 opacity-70" />
                            )}
                          </Button>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            No menu items found matching "{searchQuery}"
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* User Menu or Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userProfile?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin ? 'Admin Account' : 'User Account'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                size="sm"
                className="gap-2"
              >
                <User className="h-4 w-4" />
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

