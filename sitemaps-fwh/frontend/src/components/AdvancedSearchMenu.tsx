import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Info,
  Phone,
  LayoutDashboard,
  Globe,
  CreditCard,
  Users,
  Shield,
  Eye,
  BarChart3,
  Download,
  Monitor,
  Database,
  CheckSquare,
  Wrench,
  FolderOpen,
  PackagePlus,
  Search,
  Command,
  Plus,
  TrendingUp,
  Clock,
} from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel' | 'feature-checklist' | 'catalogs' | 'diagnostics' | 'catalog-builder';

interface MenuItem {
  id: Page;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'public' | 'user' | 'admin';
  keywords: string[];
}

interface AdvancedSearchMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

interface RecentSearch {
  page: Page;
  timestamp: number;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', description: 'Main landing page', icon: Home, category: 'public', keywords: ['home', 'main', 'start', 'landing'] },
  { id: 'about', label: 'About Us', description: 'Company information', icon: Info, category: 'public', keywords: ['about', 'company', 'info', 'information'] },
  { id: 'contact', label: 'Contact Us', description: 'Get in touch', icon: Phone, category: 'public', keywords: ['contact', 'phone', 'email', 'support'] },
  { id: 'sitemaps', label: 'Sitemaps', description: 'Browse sitemaps', icon: Globe, category: 'public', keywords: ['sitemap', 'browse', 'search', 'urls'] },
  { id: 'subscription', label: 'Subscription', description: 'View pricing plans', icon: CreditCard, category: 'public', keywords: ['subscription', 'pricing', 'plans', 'payment'] },
  { id: 'gods-eye', label: "God's Eye Summary", description: 'Platform overview', icon: Eye, category: 'public', keywords: ['summary', 'overview', 'stats', 'gods eye'] },
  { id: 'catalogs', label: 'Catalogs', description: 'Browse catalog entries', icon: FolderOpen, category: 'public', keywords: ['catalog', 'browse', 'files', 'documents'] },
  { id: 'dashboard', label: 'Dashboard', description: 'User dashboard', icon: LayoutDashboard, category: 'user', keywords: ['dashboard', 'user', 'profile', 'account'] },
  { id: 'referrals', label: 'Referrals', description: 'Referral program', icon: Users, category: 'user', keywords: ['referral', 'invite', 'commission', 'earn'] },
  { id: 'analytics', label: 'Analytics', description: 'View analytics', icon: BarChart3, category: 'admin', keywords: ['analytics', 'stats', 'metrics', 'data'] },
  { id: 'exports', label: 'Exports', description: 'Export data', icon: Download, category: 'admin', keywords: ['export', 'download', 'data', 'backup'] },
  { id: 'monitoring', label: 'Monitoring', description: 'System monitoring', icon: Monitor, category: 'admin', keywords: ['monitoring', 'system', 'health', 'status'] },
  { id: 'diagnostics', label: 'Diagnostics', description: 'Run diagnostics', icon: Wrench, category: 'admin', keywords: ['diagnostics', 'debug', 'troubleshoot', 'fix'] },
  { id: 'catalog-builder', label: 'Catalog Builder', description: 'Build catalogs', icon: PackagePlus, category: 'admin', keywords: ['catalog', 'builder', 'create', 'build'] },
  { id: 'admin-panel', label: 'Admin Panel', description: 'Admin settings', icon: Database, category: 'admin', keywords: ['admin', 'settings', 'config', 'manage'] },
  { id: 'feature-checklist', label: 'Feature Checklist', description: 'Feature tracking', icon: CheckSquare, category: 'admin', keywords: ['features', 'checklist', 'progress', 'tracking'] },
  { id: 'admin', label: 'Admin', description: 'Admin tools', icon: Shield, category: 'admin', keywords: ['admin', 'tools', 'management', 'control'] },
];

export default function AdvancedSearchMenu({ open, onClose, onNavigate }: AdvancedSearchMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, [open]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return menuItems;
    }

    const term = searchTerm.toLowerCase();
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.keywords.some(keyword => keyword.includes(term))
    ).sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.label.toLowerCase() === term;
      const bExact = b.label.toLowerCase() === term;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then prioritize label matches over keyword matches
      const aLabelMatch = a.label.toLowerCase().includes(term);
      const bLabelMatch = b.label.toLowerCase().includes(term);
      if (aLabelMatch && !bLabelMatch) return -1;
      if (!aLabelMatch && bLabelMatch) return 1;
      
      return 0;
    });
  }, [searchTerm]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {
      public: [],
      user: [],
      admin: [],
    };

    filteredItems.forEach(item => {
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  const recentItems = useMemo(() => {
    return recentSearches
      .slice(0, 5)
      .map(search => menuItems.find(item => item.id === search.page))
      .filter(Boolean) as MenuItem[];
  }, [recentSearches]);

  const handleSelect = (page: Page) => {
    // Update recent searches
    const newRecent: RecentSearch = { page, timestamp: Date.now() };
    const updated = [newRecent, ...recentSearches.filter(s => s.page !== page)].slice(0, 10);
    setRecentSearches(updated);
    
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }

    onNavigate(page);
    onClose();
    setSearchTerm('');
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex].id);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) {
          // Open menu logic would be handled by parent
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Advanced Search Menu
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages, features, and modules..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="h-[400px] px-6 pb-6">
          <div className="space-y-6">
            {!searchTerm && recentItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent
                  </h3>
                </div>
                <div className="space-y-1">
                  {recentItems.map((item, index) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start h-auto py-3 px-3 ${
                        index === selectedIndex && !searchTerm ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelect(item.id)}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {groupedItems.public.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Public Pages
                </h3>
                <div className="space-y-1">
                  {groupedItems.public.map((item, index) => {
                    const globalIndex = filteredItems.indexOf(item);
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto py-3 px-3 ${
                          globalIndex === selectedIndex ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleSelect(item.id)}
                      >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {groupedItems.user.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  User Features
                </h3>
                <div className="space-y-1">
                  {groupedItems.user.map((item) => {
                    const globalIndex = filteredItems.indexOf(item);
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto py-3 px-3 ${
                          globalIndex === selectedIndex ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleSelect(item.id)}
                      >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                        <Badge variant="secondary" className="ml-2">User</Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {groupedItems.admin.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Admin Tools
                </h3>
                <div className="space-y-1">
                  {groupedItems.admin.map((item) => {
                    const globalIndex = filteredItems.indexOf(item);
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto py-3 px-3 ${
                          globalIndex === selectedIndex ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleSelect(item.id)}
                      >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                        <Badge variant="secondary" className="ml-2">Admin</Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No results found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between text-xs text-muted-foreground px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">Esc</kbd>
              Close
            </span>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
