import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsAdmin } from '@/hooks/useQueries';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Globe, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  const NavigationLinks = () => (
    <>
      <Link to="/">
        <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
          Home
        </Button>
      </Link>
      {isAuthenticated && userProfile && (
        <Link to="/dashboard">
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            Dashboard
          </Button>
        </Link>
      )}
      {isAdmin && (
        <Link to="/admin">
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            Admin
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SitemapHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavigationLinks />
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LoginButton />
            
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavigationLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
