import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { Search, User, LogOut, Shield, Menu, X, BarChart3, Layers, Lock, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();

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
    if (theme === 'vibgyor') {
      setTheme('light');
    } else {
      setTheme('vibgyor');
    }
  };

  const allNavLinks = [
    { to: '/catalog', label: 'Catalog', adminOnly: false },
    { to: '/blog', label: 'Blog', adminOnly: false },
    { to: '/about', label: 'About', adminOnly: false },
    { to: '/pros', label: 'Pros', adminOnly: false },
    { to: '/what-we-do', label: 'What We Do', adminOnly: false },
    { to: '/why-us', label: 'Why Us', adminOnly: false },
    { to: '/contact', label: 'Contact', adminOnly: false },
    { to: '/faq', label: 'FAQ', adminOnly: false },
    { to: '/referral', label: 'Referral', adminOnly: false },
    { to: '/trust', label: 'Trust', adminOnly: false },
    { to: '/features', label: 'Features', adminOnly: false },
    { to: '/admin', label: 'Admin', adminOnly: true },
    { to: '/dashboard', label: 'Dashboard', adminOnly: true },
  ];

  const navLinks = useMemo(() => {
    return allNavLinks.filter(link => !link.adminOnly || isAdmin);
  }, [isAdmin]);

  const filteredNavLinks = useMemo(() => {
    if (!searchTerm) return navLinks;
    const term = searchTerm.toLowerCase();
    return navLinks.filter(link => link.label.toLowerCase().includes(term));
  }, [navLinks, searchTerm]);

  const moreLinks = useMemo(() => {
    const links = filteredNavLinks.slice(5);
    return [
      ...links,
      { to: '/terms', label: 'Terms', adminOnly: false },
      { to: '/sitemap', label: 'Sitemap', adminOnly: false },
    ];
  }, [filteredNavLinks]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/generated/workflow-icon-transparent.dim_64x64.png" alt="n8n Workflows" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              n8n Workflows
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-4">
            {filteredNavLinks.slice(0, 5).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
              >
                {link.label}
                {link.adminOnly && <Lock className="h-3 w-3" />}
              </Link>
            ))}
            {moreLinks.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground">
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="px-2 py-1.5">
                    <Input
                      placeholder="Search menu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  {moreLinks.map((link) => (
                    <DropdownMenuItem key={link.to} onClick={() => navigate({ to: link.to })}>
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.adminOnly && <Lock className="h-3 w-3" />}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title="Toggle VIBGYOR Theme"
            className="hidden sm:inline-flex"
          >
            <Palette className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/catalog' })}
            className="hidden sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={profileLoading}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {userProfile?.name || 'User'}
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                      <Lock className="ml-auto h-3 w-3" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                      <Lock className="ml-auto h-3 w-3" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/features' })}>
                      <Layers className="mr-2 h-4 w-4" />
                      Features
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleAuth}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleAuth} disabled={disabled} size="sm">
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
            </Button>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    title="Toggle VIBGYOR Theme"
                  >
                    <Palette className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {filteredNavLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                      {link.adminOnly && <Lock className="h-4 w-4" />}
                    </Link>
                  ))}
                  <Link
                    to="/terms"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Terms
                  </Link>
                  <Link
                    to="/sitemap"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sitemap
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
