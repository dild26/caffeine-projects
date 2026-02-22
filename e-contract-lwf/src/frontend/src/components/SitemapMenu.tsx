import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllPages, useToggleTheme, useGetCurrentTheme } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Map, Search, ExternalLink, Palette } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Theme } from '../backend';
import { toast } from 'sonner';

interface SitemapMenuProps {
  position: 'top-right' | 'bottom-left';
}

export default function SitemapMenu({ position }: SitemapMenuProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: pages = [], isLoading } = useGetAllPages();
  const { data: currentTheme } = useGetCurrentTheme();
  const toggleTheme = useToggleTheme();
  const navigate = useNavigate();

  const isVibgyorActive = currentTheme === Theme.vibgyor;

  const filteredPages = pages.filter((page) => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      page.title.toLowerCase().includes(lowerSearch) ||
      page.content.toLowerCase().includes(lowerSearch) ||
      page.path.toLowerCase().includes(lowerSearch)
    );
  });

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setOpen(false);
    setSearchTerm('');
  };

  const handleThemeToggle = async () => {
    try {
      await toggleTheme.mutateAsync();
      toast.success(
        isVibgyorActive ? 'Switched to default theme' : 'Switched to VIBGYOR theme'
      );
    } catch (error) {
      toast.error('Failed to toggle theme');
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full transition-all duration-300 ${
            isVibgyorActive ? 'rainbow-active' : 'rainbow-hover'
          }`}
          aria-label="Open sitemap"
        >
          <Map className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={position === 'top-right' ? 'right' : 'left'} className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Site Navigation
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Button
            onClick={handleThemeToggle}
            disabled={toggleTheme.isPending}
            variant={isVibgyorActive ? 'default' : 'outline'}
            className="w-full rounded-full"
          >
            {toggleTheme.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Switching...
              </>
            ) : (
              <>
                <Palette className="mr-2 h-4 w-4" />
                {isVibgyorActive ? 'Default Theme' : 'VIBGYOR Theme'}
              </>
            )}
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-16rem)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading pages...</div>
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Map className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No pages found matching your search.' : 'No pages available yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {filteredPages.map((page) => (
                  <button
                    key={page.path}
                    onClick={() => handleNavigate(page.path)}
                    className="w-full text-left rounded-lg border border-border bg-card p-4 transition-all hover:bg-accent hover:border-primary/50 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                          {page.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {page.content}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                          {page.path}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
