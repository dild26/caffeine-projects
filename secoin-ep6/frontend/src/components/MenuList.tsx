import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Search, Home, Info, Briefcase, HelpCircle, FileText, Users, Shield, Map, Image, BookOpen, BarChart3, Award, Settings, Activity, FileJson, Radio, Menu as MenuIcon, Lock } from 'lucide-react';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const menuItems = [
  { title: 'Home', url: '/', icon: Home, adminOnly: false },
  { title: 'About Us', url: '/about', icon: Info, adminOnly: false },
  { title: 'Pros of SECoin', url: '/pros', icon: Award, adminOnly: false },
  { title: 'What We Do', url: '/what-we-do', icon: Briefcase, adminOnly: false },
  { title: 'Why Us', url: '/why-us', icon: Shield, adminOnly: false },
  { title: 'Contact Us', url: '/contact', icon: Users, adminOnly: false },
  { title: 'FAQ', url: '/faq', icon: HelpCircle, adminOnly: false },
  { title: 'Terms & Conditions', url: '/terms', icon: FileText, adminOnly: false },
  { title: 'Referral', url: '/referral', icon: Users, adminOnly: false },
  { title: 'Proof of Trust', url: '/proof-of-trust', icon: Shield, adminOnly: false },
  { title: 'Sitemap', url: '/sitemap', icon: Map, adminOnly: false },
  { title: 'Gallery', url: '/gallery', icon: Image, adminOnly: false },
  { title: 'Blog', url: '/blog', icon: BookOpen, adminOnly: false },
  { title: 'Features', url: '/features', icon: BarChart3, adminOnly: true },
  { title: 'Dashboard', url: '/dashboard', icon: Settings, adminOnly: true },
  { title: 'Admin', url: '/admin', icon: Shield, adminOnly: true },
  { title: 'Leaderboard', url: '/leaderboard', icon: Award, adminOnly: false },
  { title: 'System Health', url: '/system-health', icon: Activity, adminOnly: true },
  { title: 'Specification Status', url: '/specification-status', icon: FileJson, adminOnly: true },
  { title: 'Live Status', url: '/live-status', icon: Radio, adminOnly: false },
  { title: 'Menu Analysis', url: '/menu-analysis', icon: MenuIcon, adminOnly: true },
  { title: 'Bundle Optimization', url: '/bundle-optimization', icon: Settings, adminOnly: true },
];

interface MenuListProps {
  onNavigate?: () => void;
}

export default function MenuList({ onNavigate }: MenuListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Memoize filtered items to avoid recalculation on every render
  const filteredItems = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase();
    return menuItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(term);
      // Show admin-only items only to admins
      if (item.adminOnly && !isAdmin) {
        return false;
      }
      return matchesSearch;
    });
  }, [debouncedSearchTerm, isAdmin]);

  // Memoize click handler
  const handleItemClick = useCallback((url: string) => {
    try {
      navigate({ to: url });
      onNavigate?.();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = url;
    }
  }, [navigate, onNavigate]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search menu items"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {adminLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading menu...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No items found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <button
                  key={item.url}
                  onClick={() => handleItemClick(item.url)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.adminOnly && !isAdmin}
                  aria-label={`Navigate to ${item.title}`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.adminOnly && (
                    <img 
                      src="/assets/generated/admin-lock-icon-transparent.dim_16x16.png" 
                      alt="Admin only" 
                      className="h-4 w-4 flex-shrink-0 opacity-60"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
