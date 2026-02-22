import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X, ChevronDown, Search, Loader2, Globe, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import ThemeToggle from './ThemeToggle';
import DynamicMenu from './DynamicMenu';
import { useIsCallerAdmin, useGetAllClonedPages } from '../hooks/useQueries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: clonedPages, isLoading: pagesLoading, isFetching: pagesFetching } = useGetAllClonedPages();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const groupedMobilePages = useMemo(() => {
    if (!clonedPages) return { map: [], etutorial: [], other: [] };
    const query = mobileSearchQuery.toLowerCase();
    const filtered = query
      ? clonedPages.filter(page =>
        page.id.toLowerCase().includes(query) ||
        page.url.toLowerCase().includes(query) ||
        page.source.toLowerCase().includes(query)
      )
      : clonedPages;

    return filtered.reduce((acc, page) => {
      if (page.url.includes('map-56b') || page.source.includes('map-56b')) {
        acc.map.push(page);
      } else if (page.url.includes('etutorial-lgc') || page.source.includes('etutorial-lgc')) {
        acc.etutorial.push(page);
      } else {
        acc.other.push(page);
      }
      return acc;
    }, { map: [] as typeof clonedPages, etutorial: [] as typeof clonedPages, other: [] as typeof clonedPages });
  }, [clonedPages, mobileSearchQuery]);

  const totalMobileFilteredPages = groupedMobilePages.map.length + groupedMobilePages.etutorial.length + groupedMobilePages.other.length;

  const formatRelativeTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleDateString();
  };

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
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              Op Hotels to Rest
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-sm font-semibold transition-colors hover:text-primary uppercase tracking-wider">
            Dashboard
          </Link>
          <Link to="/contact" className="text-sm font-semibold transition-colors hover:text-primary uppercase tracking-wider">
            Contact
          </Link>
          <Link to="/data-objects" className="text-sm font-semibold transition-colors hover:text-primary uppercase tracking-wider">
            Data Objects
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-primary" />}
          </button>
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            className="hidden md:flex"
          >
            {text}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container flex flex-col gap-4 py-4">
            <Link to="/" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/contact" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/data-objects" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Data Objects</Link>

            {clonedPages && clonedPages.length > 0 && (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Cloned Pages</p>
                  <Badge variant="secondary" className="text-xs">{totalMobileFilteredPages}</Badge>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-1">
                    {clonedPages.map((page) => (
                      <Link
                        key={page.id}
                        to="/pages/$pageId"
                        params={{ pageId: page.id }}
                        className="text-sm flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="truncate">{page.id.replace(/-/g, ' ')}</span>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(page.lastSynced)}</span>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium border-t border-border/40 pt-4" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            )}
            <Button
              onClick={() => { handleAuth(); setMobileMenuOpen(false); }}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="w-full mt-2"
            >
              {text}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
