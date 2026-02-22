import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { TrendingUp, Shield, Menu, Search, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from './LoginButton';

const siteMapItems = [
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
  { label: 'Pros', path: '/pros' },
  { label: 'What', path: '/what' },
  { label: 'Why', path: '/why' },
  { label: 'How', path: '/how' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Terms', path: '/terms' },
  { label: 'Referral', path: '/referral' },
  { label: 'Trust', path: '/trust' },
  { label: 'Leaderboard', path: '/leader' },
];

export default function Header() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!identity;

  const filteredItems = siteMapItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="relative">
            <TrendingUp className="h-7 w-7 text-primary" />
            <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            latestTrends
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="hidden md:flex"
          >
            Catalog
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/leader' })}
            className="hidden md:flex gap-2"
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>
          {isAuthenticated && isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/admin' })}
              className="hidden md:flex gap-2"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          )}

          <LoginButton />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Site Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    <div className="mb-4">
                      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Main</h3>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavigate('/')}
                        >
                          Catalog
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavigate('/leader')}
                        >
                          Leaderboard
                        </Button>
                        {isAuthenticated && isAdmin && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleNavigate('/admin')}
                          >
                            Admin
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Pages</h3>
                      <div className="space-y-1">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <Button
                              key={item.path}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleNavigate(item.path)}
                            >
                              {item.label}
                            </Button>
                          ))
                        ) : (
                          <p className="py-4 text-center text-sm text-muted-foreground">
                            No pages found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
