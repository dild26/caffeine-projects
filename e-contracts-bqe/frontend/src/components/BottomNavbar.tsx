import { useState, useMemo } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useGetNavigationMenu, useIsCallerAdmin } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Lock, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNavbar() {
  const navigate = useNavigate();
  const { data: menuItems } = useGetNavigationMenu();
  const { data: isAdmin } = useIsCallerAdmin();
  const routerState = useRouterState();
  const [searchQuery, setSearchQuery] = useState('');
  const [sitemapOpen, setSitemapOpen] = useState(false);

  const isActivePath = (path: string) => {
    return routerState.location.pathname === path;
  };

  const handleNavigate = (path: string, requiresAdmin: boolean) => {
    if (requiresAdmin && !isAdmin) {
      navigate({ to: '/access-denied' });
    } else {
      navigate({ to: path });
    }
    setSitemapOpen(false);
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        {/* Search Bar with Sitemap Button */}
        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>
          
          {/* Sitemap Dialog Button */}
          <Dialog open={sitemapOpen} onOpenChange={setSitemapOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
                <Map className="h-4 w-4" />
                Sitemap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Site Navigation</DialogTitle>
                <DialogDescription>
                  Browse all available pages and sections
                </DialogDescription>
              </DialogHeader>
              
              {/* Search within sitemap */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>

              {searchQuery && (
                <p className="text-xs text-muted-foreground">
                  Found {filteredMenuItems.length} page{filteredMenuItems.length !== 1 ? 's' : ''}
                </p>
              )}

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
                        No pages found matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {searchQuery && (
          <p className="mb-2 text-xs text-muted-foreground">
            Found {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Menu Items - Horizontal Scrollable */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActivePath(item.url) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavigate(item.url, item.requiresAdmin)}
                  className={cn(
                    'flex-shrink-0 gap-2 whitespace-nowrap',
                    isActivePath(item.url) && 'bg-primary text-primary-foreground'
                  )}
                >
                  <span>{item.displayName}</span>
                  {item.requiresAdmin && (
                    <Lock className="h-3 w-3 opacity-70" />
                  )}
                </Button>
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-2">
                <p className="text-sm text-muted-foreground">
                  No menu items found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
