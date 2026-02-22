import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Home, Sparkles, MessageSquare, Trophy, Gift, BookOpen, Mail, Map, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuLink {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface SearchableMenuProps {
  position: 'top-right' | 'bottom-left';
}

export default function SearchableMenu({ position }: SearchableMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuLinks: MenuLink[] = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      description: 'Main landing page with platform overview',
    },
    {
      label: 'Features',
      path: '/features',
      icon: Sparkles,
      description: 'Detailed list of platform features and payment options',
    },
    {
      label: 'Topics',
      path: '/topics',
      icon: MessageSquare,
      description: 'Browse and create topics, vote and react',
    },
    {
      label: 'Leaderboard',
      path: '/leaderboard',
      icon: Trophy,
      description: 'Global rankings of top contributors',
    },
    {
      label: 'Referrals',
      path: '/referrals',
      icon: Gift,
      description: 'Referral program dashboard and earnings',
    },
    {
      label: 'Blog',
      path: '/blog',
      icon: BookOpen,
      description: 'Community blog posts and discussions',
    },
    {
      label: 'Contact',
      path: '/contact',
      icon: Mail,
      description: 'Contact information and social media links',
    },
    {
      label: 'Sitemap',
      path: '/sitemap',
      icon: Map,
      description: 'Complete navigation structure',
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      description: 'View and edit your profile settings',
    },
  ];

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return menuLinks;
    
    const query = searchQuery.toLowerCase();
    return menuLinks.filter(
      (link) =>
        link.label.toLowerCase().includes(query) ||
        link.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLinkClick = (path: string) => {
    navigate({ to: path });
    setOpen(false);
    setSearchQuery('');
  };

  const positionClasses = position === 'top-right' 
    ? 'fixed top-20 right-4 z-40' 
    : 'fixed bottom-4 left-4 z-40';

  return (
    <div className={positionClasses}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Search menu"
          >
            <Search className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0" 
          align={position === 'top-right' ? 'end' : 'start'}
          side={position === 'top-right' ? 'bottom' : 'top'}
        >
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-2">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium mb-0.5">{link.label}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {link.description}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pages found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
