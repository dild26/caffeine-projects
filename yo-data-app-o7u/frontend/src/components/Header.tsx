import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetNavigationPages, useGetSitemapPages } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { LogOut, Moon, Sun, Menu, Settings, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import NavigationManager from './NavigationManager';
import SitemapPageManager from './SitemapPageManager';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: navigationPages = [] } = useGetNavigationPages();
  const { data: sitemapPages = [] } = useGetSitemapPages();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [navManagerOpen, setNavManagerOpen] = useState(false);
  const [sitemapManagerOpen, setSitemapManagerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  const builtInPages = [
    { route: '/', title: 'Home' },
    { route: '/dashboard', title: 'Dashboard' },
    { route: '/explore', title: 'Explore' },
    { route: '/feature', title: 'Features' },
    { route: '/contact', title: 'Contact' },
    { route: '/sitemap', title: 'Sitemap' },
  ];

  const contentPages = sitemapPages
    .filter((page) => page.visibility)
    .map((page) => ({
      route: page.route,
      title: page.title,
    }));

  const customPages = navigationPages.map((page) => ({
    route: page.route,
    title: page.title,
  }));

  const allPages = [...builtInPages, ...contentPages, ...customPages];

  const displayName = userProfile?.name || userProfile?.username || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img
              src="/assets/generated/yo-data-logo-transparent.dim_200x200.png"
              alt="YO-Data"
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">YO-Data</h1>
              <p className="text-xs text-muted-foreground">Data Management Platform</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {allPages.slice(0, 6).map((page) => (
                  <NavigationMenuItem key={page.route}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => handleNavigate(page.route)}
                      active={routerState.location.pathname === page.route}
                    >
                      {page.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {allPages.length > 6 && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>More</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-2 p-2">
                        {allPages.slice(6).map((page) => (
                          <li key={page.route}>
                            <NavigationMenuLink
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              onClick={() => handleNavigate(page.route)}
                            >
                              {page.title}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 pt-8">
                {allPages.map((page) => (
                  <Button
                    key={page.route}
                    variant={routerState.location.pathname === page.route ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleNavigate(page.route)}
                  >
                    {page.title}
                  </Button>
                ))}
                {isAdmin && (
                  <>
                    <div className="my-2 border-t" />
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        setNavManagerOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Pages
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        setSitemapManagerOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Manage Content
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNavManagerOpen(true)}
                className="h-9 w-9"
                title="Manage Pages"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSitemapManagerOpen(true)}
                className="h-9 w-9"
                title="Manage Content"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* User Profile Dropdown */}
          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 gap-2 px-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {/* Admin Dialogs */}
      {isAdmin && (
        <>
          <NavigationManager open={navManagerOpen} onOpenChange={setNavManagerOpen} />
          <SitemapPageManager open={sitemapManagerOpen} onOpenChange={setSitemapManagerOpen} />
        </>
      )}
    </header>
  );
}
