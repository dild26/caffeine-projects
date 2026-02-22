import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetNavItems, useToggleTheme } from '../hooks/useAppQueries';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Menu, Search, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from 'next-themes';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: navItems = [] } = useGetNavItems();
  const { mutate: toggleTheme, isPending: isTogglingTheme } = useToggleTheme();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const filteredNavItems = useMemo(() => {
    if (!searchQuery.trim()) return navItems;
    const query = searchQuery.toLowerCase();
    return navItems.filter(item => 
      item.title.toLowerCase().includes(query)
    );
  }, [navItems, searchQuery]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

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
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">SECOINFI Auth</h1>
            <p className="text-xs text-muted-foreground">Secure Identity Management</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleThemeToggle}
            disabled={isTogglingTheme}
            className="rounded-full"
            title={`Current: ${getThemeLabel()}`}
          >
            <Palette className="h-5 w-5" />
          </Button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
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
                <ScrollArea className="h-[calc(100vh-200px)]">
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
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            className="rounded-full px-6"
          >
            {disabled ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>
      </div>
    </header>
  );
}
