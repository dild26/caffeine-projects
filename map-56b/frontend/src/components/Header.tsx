import React from 'react';
import { Moon, Sun, Menu, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useMenuItems } from '../hooks/useMenuItems';
import { useNavigate } from '@tanstack/react-router';
import CompactSearchMenu from './CompactSearchMenu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const menuItems = useMenuItems();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleNavigation = (url: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setMobileMenuOpen(false);
      navigate({ to: url as any });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/moap" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/moap-logo-transparent.dim_200x200.png" alt="MOAP" className="w-8 h-8" />
            <span className="font-bold text-xl text-gradient">
              MOAP
            </span>
          </a>

          {/* Desktop Search */}
          <div className="hidden md:block">
            <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Search menu...</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <CompactSearchMenu onNavigate={(url) => {
                  setSearchOpen(false);
                  handleNavigation(url);
                }} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <div className="md:hidden">
            <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <CompactSearchMenu onNavigate={(url) => {
                  setSearchOpen(false);
                  handleNavigation(url);
                }} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Theme Toggle - Always visible */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu - Always visible */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <div className="font-semibold text-lg mb-2">Navigation</div>
                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation(item.url, item.isExternal)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Dropdown Menu */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[60vh] overflow-y-auto">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {menuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleNavigation(item.url, item.isExternal)}
                    className="cursor-pointer"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
