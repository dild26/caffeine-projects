import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Pros', path: '/pros' },
    { label: 'What We Do', path: '/what-we-do' },
    { label: 'Why Us', path: '/why-us' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Features', path: '/features' },
    { label: 'Referral', path: '/referral' },
  ];

  const protectedNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Lock },
    { label: 'Subscribers', path: '/subscribers', icon: Lock },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
          <img src="/assets/generated/n8n-logo-transparent.dim_200x200.png" alt="n8n Logo" className="h-8 w-8" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            n8n Workflows Store
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          {publicNavItems.slice(0, 6).map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
          {isAuthenticated && protectedNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <item.icon className="h-3 w-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LoginButton />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Public Pages
                </div>
                {publicNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                {isAuthenticated && (
                  <>
                    <div className="text-xs font-semibold text-muted-foreground uppercase mt-4 mb-2">
                      Protected Pages
                    </div>
                    {protectedNavItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
