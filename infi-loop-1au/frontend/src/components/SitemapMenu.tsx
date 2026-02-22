import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Shield, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  path: string;
  label: string;
  description?: string;
  restricted?: boolean;
  subscription?: boolean;
}

interface SitemapMenuProps {
  onNavigate?: () => void;
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Home', description: 'Main dashboard and overview' },
  { path: '/dashboard', label: 'Dashboard', description: 'URL Generator and management tools' },
  { path: '/gods-eye-net', label: "God's Eye Net", description: 'Secure access portal', subscription: true },
  { path: '/advanced-gods-eye', label: 'Advanced Gods Eye', description: 'Enhanced secure algorithms', subscription: true },
  { path: '/IPCams-IPv4', label: 'IPCams IPv4', description: 'IP camera live streaming' },
  { path: '/IPNet/discovery-ui', label: 'IPNet Discovery', description: 'Camera discovery and registration' },
  { path: '/IPNet/ipcams', label: 'IPNet Camera Grid', description: 'Camera grid interface' },
  { path: '/features', label: 'Features', description: 'System features and status', restricted: true },
  { path: '/sitemap', label: 'Sitemap', description: 'Complete site navigation' },
  { path: '/contact', label: 'Contact', description: 'Contact information' },
  { path: '/blog', label: 'Blog', description: 'Latest updates and articles' },
  { path: '/about', label: 'About', description: 'About InfiLoop' },
  { path: '/pros', label: 'Pros', description: 'Platform advantages' },
  { path: '/what', label: 'What', description: 'What is InfiLoop' },
  { path: '/why', label: 'Why', description: 'Why choose InfiLoop' },
  { path: '/how', label: 'How', description: 'How it works' },
  { path: '/faq', label: 'FAQ', description: 'Frequently asked questions' },
  { path: '/terms', label: 'Terms', description: 'Terms of service' },
  { path: '/referral', label: 'Referral', description: 'Referral program' },
  { path: '/trust', label: 'Trust', description: 'Trust and security' },
];

export default function SitemapMenu({ onNavigate }: SitemapMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems;
    }

    const query = searchQuery.toLowerCase();
    return menuItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.path.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path });
      onNavigate?.();
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
      onNavigate?.();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="space-y-1 p-4">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No pages found matching "{searchQuery}"
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.label}</span>
                    {item.restricted && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Lock className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                    {item.subscription && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Subscription
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {searchQuery && filteredItems.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Found {filteredItems.length} {filteredItems.length === 1 ? 'page' : 'pages'}
        </p>
      )}
    </div>
  );
}
