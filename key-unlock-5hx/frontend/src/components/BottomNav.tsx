import { useGetNavItems, useToggleTheme } from '../hooks/useAppQueries';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Search, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from 'next-themes';

export default function BottomNav() {
  const navigate = useNavigate();
  const { data: navItems = [] } = useGetNavItems();
  const { mutate: toggleTheme, isPending: isTogglingTheme } = useToggleTheme();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredNavItems = useMemo(() => {
    if (!searchQuery.trim()) return navItems;
    const query = searchQuery.toLowerCase();
    return navItems.filter(item => 
      item.title.toLowerCase().includes(query)
    );
  }, [navItems, searchQuery]);

  const handleThemeToggle = () => {
    toggleTheme(undefined, {
      onSuccess: (newTheme) => {
        setTheme(newTheme);
        const themeNames = {
          light: 'Light',
          dark: 'Dark',
          vibgyor: 'VIBGYOR'
        };
        toast.success(`Theme changed to ${themeNames[newTheme]}`);
      },
      onError: () => {
        toast.error('Failed to change theme. Please try again.');
      }
    });
  };

  const handleNavClick = (path: string) => {
    navigate({ to: path });
    setIsMenuOpen(false);
  };

  const getThemeLabel = () => {
    if (!theme) return 'Theme';
    const labels: Record<string, string> = {
      light: 'Light',
      dark: 'Dark',
      vibgyor: 'VIBGYOR'
    };
    return labels[theme] || 'Theme';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm z-50 md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-around gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[calc(80vh-150px)]">
                  <div className="space-y-2">
                    {filteredNavItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pages found
                      </p>
                    ) : (
                      filteredNavItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavClick(item.path)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center justify-between group"
                        >
                          <span className="font-medium">{item.title}</span>
                          {item.adminOnly && (
                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            disabled={isTogglingTheme}
            className="rounded-full"
            title={`Current: ${getThemeLabel()}`}
          >
            <Palette className="h-5 w-5" />
            <span className="sr-only">Toggle Theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
