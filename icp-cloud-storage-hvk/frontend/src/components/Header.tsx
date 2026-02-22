import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button as OriginalButton } from './ui/button';
import { Avatar as OriginalAvatar, AvatarFallback as OriginalAvatarFallback } from './ui/avatar';
import {
  DropdownMenu as OriginalDropdownMenu,
  DropdownMenuContent as OriginalDropdownMenuContent,
  DropdownMenuItem as OriginalDropdownMenuItem,
  DropdownMenuLabel as OriginalDropdownMenuLabel,
  DropdownMenuSeparator as OriginalDropdownMenuSeparator,
  DropdownMenuTrigger as OriginalDropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet as OriginalSheet,
  SheetContent as OriginalSheetContent,
  SheetHeader as OriginalSheetHeader,
  SheetTitle as OriginalSheetTitle,
} from './ui/sheet';
import { LogOut, Menu as MenuIcon, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useState, useCallback, useMemo } from 'react';
import MenuManager from './MenuManager';
import ThemeToggle from './ThemeToggle';

const Button = (OriginalButton as any);
const Avatar = (OriginalAvatar as any);
const AvatarFallback = (OriginalAvatarFallback as any);
const DropdownMenu = (OriginalDropdownMenu as any);
const DropdownMenuContent = (OriginalDropdownMenuContent as any);
const DropdownMenuItem = (OriginalDropdownMenuItem as any);
const DropdownMenuLabel = (OriginalDropdownMenuLabel as any);
const DropdownMenuSeparator = (OriginalDropdownMenuSeparator as any);
const DropdownMenuTrigger = (OriginalDropdownMenuTrigger as any);
const Sheet = (OriginalSheet as any);
const SheetContent = (OriginalSheetContent as any);
const SheetHeader = (OriginalSheetHeader as any);
const SheetTitle = (OriginalSheetTitle as any);
// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/about', '/faq', '/contact', '/compare', '/pros', '/terms', '/sitemap', '/features'];

export default function Header() {
  const { logout, identity, login, isInitializing, isLoggingIn } = useInternetIdentity();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname === route);

  // Only fetch user data if authenticated
  const { data: userProfile } = useGetCallerUserProfile();
  const userData = userProfile as any; // Temporary cast to bypass inference issue if lossy
  const { data: isAdmin = false } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    queryClient.clear();
  }, [logout, queryClient]);

  const handleLogin = useCallback(async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  }, [login]);

  const getInitials = useCallback((name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleLogoClick = useCallback(() => {
    window.open('https://secoinfi.com', '_blank');
  }, []);

  const handleNavigate = useCallback((to: string) => {
    setSheetOpen(false);
    navigate({ to });
  }, [navigate]);

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setSheetOpen(open);
  }, []);

  const userInitials = useMemo(() => {
    return userData ? getInitials(userData.name) : 'U';
  }, [userData, getInitials]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 cursor-pointer"
        >
          <img
            src="/assets/generated/cloud-storage-icon-transparent.dim_200x200.png"
            alt="Gateway Edge Logo"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Gateway Edge
            </h1>
            <p className="text-xs text-muted-foreground">Cloud Storage ICP</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSheetOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <MenuManager isAdmin={isAdmin} onNavigate={handleNavigate} />
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />

          {identity ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userData?.email || ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isPublicRoute ? (
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isLoggingIn ? 'Connecting...' : 'Sign In'}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
