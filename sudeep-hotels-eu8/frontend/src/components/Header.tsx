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

  // Group pages by source and filter based on search query
  const groupedPages = useMemo(() => {
    if (!clonedPages) return { map: [], etutorial: [], other: [] };

    const query = searchQuery.toLowerCase();
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
  }, [clonedPages, searchQuery]);

  // Group pages for mobile menu
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

  const totalFilteredPages = groupedPages.map.length + groupedPages.etutorial.length + groupedPages.other.length;
  const totalMobileFilteredPages = groupedMobilePages.map.length + groupedMobilePages.etutorial.length + groupedMobilePages.other.length;

  // Get the most recent sync time for each group
  const getLatestSyncTime = (pages: typeof clonedPages) => {
    if (!pages || pages.length === 0) return null;
    const latest = pages.reduce((max, page) =>
      page.lastSynced > max ? page.lastSynced : max,
      pages[0].lastSynced
    );
    return latest;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatTimestamp(timestamp);
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
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const mapLatestSync = getLatestSyncTime(groupedPages.map);
  const etutorialLatestSync = getLatestSyncTime(groupedPages.etutorial);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.ico" alt="Sudeep Hotels Logo" className="h-10 w-10" />
            <span className="text-2xl font-serif font-bold text-primary">
              Sudeep Hotels
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-sm font-semibold transition-colors hover:text-primary uppercase tracking-wider">
            Home
          </Link>
          <a href="#" className="text-sm font-semibold transition-colors hover:text-primary uppercase tracking-wider">
            The Menu
          </a>
          <a href="#" className="text-sm font-semibold transition-colors hover:text-primary uppercase tracking-wider">
            Heritage
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
            Visit Us
          </Button>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-primary" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container flex flex-col gap-4 py-4">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/data-objects"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Data Objects
            </Link>
            {clonedPages && clonedPages.length > 0 && (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Cloned Pages
                    {pagesFetching && <Loader2 className="inline h-3 w-3 ml-2 animate-spin" />}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {totalMobileFilteredPages}
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[400px]">
                  {pagesLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : totalMobileFilteredPages > 0 ? (
                    <div className="space-y-4 pr-4">
                      {groupedMobilePages.map.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between px-2 py-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs font-semibold">Map Pages</Badge>
                              <span className="text-xs text-muted-foreground">({groupedMobilePages.map.length})</span>
                            </div>
                            {mapLatestSync && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(mapLatestSync)}
                              </div>
                            )}
                          </div>
                          <div className="pl-4 space-y-1">
                            {groupedMobilePages.map.sort((a, b) => a.id.localeCompare(b.id)).map((page) => (
                              <Link
                                key={page.id}
                                to="/pages/$pageId"
                                params={{ pageId: page.id }}
                                className="text-sm transition-colors hover:text-primary capitalize flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent/50"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileSearchQuery('');
                                }}
                              >
                                <span className="flex items-center gap-2 flex-1 min-w-0">
                                  <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{page.id.replace(/-/g, ' ')}</span>
                                </span>
                                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                  {formatRelativeTime(page.lastSynced)}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {groupedMobilePages.etutorial.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between px-2 py-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs font-semibold">e‑Tutorial Pages</Badge>
                              <span className="text-xs text-muted-foreground">({groupedMobilePages.etutorial.length})</span>
                            </div>
                            {etutorialLatestSync && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(etutorialLatestSync)}
                              </div>
                            )}
                          </div>
                          <div className="pl-4 space-y-1">
                            {groupedMobilePages.etutorial.sort((a, b) => a.id.localeCompare(b.id)).map((page) => (
                              <Link
                                key={page.id}
                                to="/pages/$pageId"
                                params={{ pageId: page.id }}
                                className="text-sm transition-colors hover:text-primary capitalize flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent/50"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileSearchQuery('');
                                }}
                              >
                                <span className="flex items-center gap-2 flex-1 min-w-0">
                                  <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{page.id.replace(/-/g, ' ')}</span>
                                </span>
                                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                  {formatRelativeTime(page.lastSynced)}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {groupedMobilePages.other.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 px-2 py-1">
                            <Badge variant="outline" className="text-xs font-semibold">Other Sources</Badge>
                            <span className="text-xs text-muted-foreground">({groupedMobilePages.other.length})</span>
                          </div>
                          <div className="pl-4 space-y-1">
                            {groupedMobilePages.other.sort((a, b) => a.id.localeCompare(b.id)).map((page) => (
                              <Link
                                key={page.id}
                                to="/pages/$pageId"
                                params={{ pageId: page.id }}
                                className="text-sm transition-colors hover:text-primary capitalize flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent/50"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileSearchQuery('');
                                }}
                              >
                                <span className="flex items-center gap-2 flex-1 min-w-0">
                                  <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{page.id.replace(/-/g, ' ')}</span>
                                </span>
                                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                  {formatRelativeTime(page.lastSynced)}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground px-4">
                      {mobileSearchQuery ? (
                        <div className="space-y-1">
                          <p className="font-medium">No pages found</p>
                          <p className="text-xs">Try a different search term</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-medium">No pages available</p>
                          <p className="text-xs">Pages will appear after sync</p>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
            {pagesLoading && !clonedPages && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border/40 pt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading pages...
              </div>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium transition-colors hover:text-primary border-t border-border/40 pt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <Button
              onClick={() => {
                handleAuth();
                setMobileMenuOpen(false);
              }}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="border-t border-border/40 pt-4"
            >
              {text}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
