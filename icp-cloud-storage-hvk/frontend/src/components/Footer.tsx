import { Heart, Menu as MenuIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import MenuManager from './MenuManager';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface MenuItem {
  id: string;
  name: string;
  link: string;
  isAdminCreated: boolean;
}

const DEFAULT_PAGES = [
  { name: 'Dashboard', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Features', link: '/features' },
  { name: 'FAQ', link: '/faq' },
  { name: 'Contact', link: '/contact' },
  { name: 'Compare', link: '/compare' },
  { name: 'Pros', link: '/pros' },
  { name: 'Terms', link: '/terms' },
  { name: 'Sitemap', link: '/sitemap' },
];

export default function Footer() {
  const navigate = useNavigate();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      const items = JSON.parse(stored);
      // Check if pros and terms are missing and add them
      const hasPros = items.some((item: MenuItem) => item.link === '/pros');
      const hasTerms = items.some((item: MenuItem) => item.link === '/terms');
      
      if (!hasPros || !hasTerms) {
        const updatedItems = [...items];
        if (!hasPros) {
          updatedItems.push({
            id: 'default-pros',
            name: 'Pros',
            link: '/pros',
            isAdminCreated: false,
          });
        }
        if (!hasTerms) {
          updatedItems.push({
            id: 'default-terms',
            name: 'Terms',
            link: '/terms',
            isAdminCreated: false,
          });
        }
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        return updatedItems;
      }
      return items;
    }
    return DEFAULT_PAGES.map((page, index) => ({
      id: `default-${index}`,
      name: page.name,
      link: page.link,
      isAdminCreated: false,
    }));
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem('menuItems');
      if (updated) {
        setMenuItems(JSON.parse(updated));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('menuItemsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuItemsUpdated', handleStorageChange);
    };
  }, []);

  const handleNavigate = useCallback((to: string) => {
    setSheetOpen(false);
    navigate({ to });
  }, [navigate]);

  const handleLinkClick = useCallback((link: string) => {
    navigate({ to: link });
  }, [navigate]);

  const duplicatedMenuItems = useMemo(() => {
    return [...menuItems, ...menuItems];
  }, [menuItems]);

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © 2025. Built with{' '}
          <Heart className="inline h-4 w-4 text-red-500 fill-red-500" />{' '}
          using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
      
      {/* Bottom navbar with marquee and static menu icon */}
      <div className="relative border-t border-border/40 bg-background/98 backdrop-blur">
        <div className="flex items-center h-10">
          {/* Static Menu Icon on the left */}
          <div className="absolute left-4 z-10 bg-background/95 pr-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <MenuManager isAdmin={isAdmin} onNavigate={handleNavigate} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Horizontal Marquee */}
          <div className="flex-1 overflow-hidden pl-16">
            <div className="marquee-container">
              <div className="marquee-content">
                {duplicatedMenuItems.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleLinkClick(item.link)}
                    className="inline-flex items-center px-4 text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {item.name}
                    <span className="mx-2 text-border">•</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
