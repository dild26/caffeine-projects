import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, FileText, Map, Info, Settings, BookOpen, Home, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useGetAllNavigationItemsSorted, useValidateMenuAndThemeData } from '../hooks/useQueries';

interface MenuItem {
  to: string;
  label: string;
  description: string;
  category: string;
  keywords: string[];
  isPublic: boolean;
}

export default function SearchMenu() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { data: allNavItems, isLoading: navLoading } = useGetAllNavigationItemsSorted();
  const { data: isValid } = useValidateMenuAndThemeData();

  const defaultMenuItems: MenuItem[] = [
    // Main Platform - Public
    { to: '/', label: 'Home', description: 'Platform homepage and overview', category: 'Main', keywords: ['home', 'start', 'main', 'index'], isPublic: true },
    { to: '/dashboard', label: 'Dashboard', description: 'Personal learning dashboard', category: 'Main', keywords: ['dashboard', 'overview', 'personal', 'my'], isPublic: true },
    { to: '/explore', label: 'Explore', description: 'Discover resources and instructors', category: 'Main', keywords: ['explore', 'discover', 'browse', 'find'], isPublic: true },
    
    // Learning Resources - Public
    { to: '/resources', label: 'Resources', description: 'Browse educational materials', category: 'Learning', keywords: ['resources', 'materials', 'content', 'courses'], isPublic: true },
    { to: '/instructors', label: 'Instructors', description: 'Find and connect with instructors', category: 'Learning', keywords: ['instructors', 'teachers', 'tutors', 'mentors'], isPublic: true },
    { to: '/appointments', label: 'Appointments', description: 'Manage your bookings', category: 'Learning', keywords: ['appointments', 'bookings', 'schedule', 'calendar'], isPublic: true },
    
    // Information Pages - Public
    { to: '/about', label: 'About', description: 'Learn about our platform', category: 'Info', keywords: ['about', 'mission', 'vision', 'us'], isPublic: true },
    { to: '/features', label: 'Features', description: 'Platform capabilities', category: 'Info', keywords: ['features', 'capabilities', 'functions', 'tools'], isPublic: true },
    { to: '/faq', label: 'FAQ', description: 'Frequently asked questions', category: 'Info', keywords: ['faq', 'questions', 'help', 'support'], isPublic: true },
    { to: '/blogs', label: 'Blog', description: 'News and updates', category: 'Info', keywords: ['blog', 'news', 'updates', 'articles'], isPublic: true },
    { to: '/contact', label: 'Contact', description: 'Get in touch', category: 'Info', keywords: ['contact', 'support', 'help', 'email'], isPublic: true },
    { to: '/join-us', label: 'Join Us', description: 'Become part of our community', category: 'Info', keywords: ['join', 'community', 'signup', 'register'], isPublic: true },
    { to: '/values', label: 'Values', description: 'Our core principles', category: 'Info', keywords: ['values', 'principles', 'mission', 'ethics'], isPublic: true },
    
    // Documentation - Public
    { to: '/info', label: 'Info', description: 'Platform information', category: 'Docs', keywords: ['info', 'information', 'details', 'documentation'], isPublic: true },
    { to: '/keywords', label: 'Keywords', description: 'Hashtag system guide', category: 'Docs', keywords: ['keywords', 'hashtags', 'tags', 'search'], isPublic: true },
    { to: '/locations', label: 'Locations', description: 'Global accessibility', category: 'Docs', keywords: ['locations', 'global', 'regions', 'countries'], isPublic: true },
    { to: '/maps', label: 'Maps', description: 'Platform structure', category: 'Docs', keywords: ['maps', 'structure', 'layout', 'navigation'], isPublic: true },
    { to: '/geo-map', label: 'Geo Map', description: 'Geographic locations', category: 'Docs', keywords: ['geo', 'geography', 'map', 'world'], isPublic: true },
    { to: '/navigation', label: 'Navigation', description: 'Navigation guide', category: 'Docs', keywords: ['navigation', 'menu', 'guide', 'sitemap'], isPublic: true },
    { to: '/sitemap', label: 'Sitemap', description: 'Complete site structure', category: 'Docs', keywords: ['sitemap', 'structure', 'pages', 'all'], isPublic: true },
    
    // Technical - Public
    { to: '/design', label: 'Design', description: 'Design system and guidelines', category: 'Technical', keywords: ['design', 'ui', 'style', 'theme'], isPublic: true },
    { to: '/permissions', label: 'Permissions', description: 'Access control system', category: 'Technical', keywords: ['permissions', 'access', 'security', 'roles'], isPublic: true },
    { to: '/queries', label: 'Queries', description: 'Search capabilities', category: 'Technical', keywords: ['queries', 'search', 'filter', 'find'], isPublic: true },
    { to: '/responsive-design', label: 'Responsive Design', description: 'Multi-device support', category: 'Technical', keywords: ['responsive', 'mobile', 'device', 'adaptive'], isPublic: true },
    { to: '/timestamp', label: 'Timestamp', description: 'Time tracking', category: 'Technical', keywords: ['timestamp', 'time', 'date', 'tracking'], isPublic: true },
    { to: '/ui-ux', label: 'UI/UX', description: 'Design principles', category: 'Technical', keywords: ['ui', 'ux', 'design', 'interface', 'experience'], isPublic: true },
    { to: '/what-why-when-where-who', label: '5W Framework', description: 'What, Why, When, Where, Who', category: 'Technical', keywords: ['what', 'why', 'when', 'where', 'who', 'framework', '5w'], isPublic: true },
    
    // Admin - Restricted
    { to: '/admin', label: 'Admin', description: 'Administration panel (restricted)', category: 'Admin', keywords: ['admin', 'administration', 'management', 'settings'], isPublic: false },
  ];

  const allMenuItems = useMemo(() => {
    const items = [...defaultMenuItems];
    
    // Add items from backend (only public items)
    if (allNavItems && allNavItems.length > 0) {
      console.log('✅ Loading public navigation items from backend:', allNavItems.filter(n => n.isPublic).length);
      allNavItems.forEach(navItem => {
        if (!navItem.isPublic) return; // Skip non-public items
        
        const exists = items.some(item => item.to === navItem.url);
        if (!exists) {
          const category = navItem.type === 'menu' ? 'Main' : navItem.type === 'sitemap' ? 'Info' : 'Technical';
          items.push({
            to: navItem.url,
            label: navItem.navLabel,
            description: `${navItem.type} page`,
            category,
            keywords: [navItem.navLabel.toLowerCase(), navItem.type, navItem.url.replace('/', '')],
            isPublic: navItem.isPublic,
          });
        }
      });
    }
    
    // Filter to only show public items
    return items.filter(item => item.isPublic).sort((a, b) => a.label.localeCompare(b.label));
  }, [allNavItems]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return allMenuItems;
    
    const term = searchTerm.toLowerCase();
    return allMenuItems.filter(item => 
      item.label.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.keywords.some(keyword => keyword.includes(term))
    );
  }, [searchTerm, allMenuItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleItemClick = (to: string) => {
    setOpen(false);
    setSearchTerm('');
    navigate({ to });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Main': return <Home className="h-4 w-4" />;
      case 'Learning': return <BookOpen className="h-4 w-4" />;
      case 'Info': return <Info className="h-4 w-4" />;
      case 'Docs': return <FileText className="h-4 w-4" />;
      case 'Technical': return <Settings className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    if (isValid === false) {
      console.warn('⚠️ Menu and theme validation failed. Some items may be missing.');
    } else if (isValid === true) {
      console.log('✅ Menu and theme validation passed');
    }
  }, [isValid]);

  const publicItemsCount = allNavItems?.filter(n => n.isPublic).length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" title="Search pages">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search menu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Navigation</DialogTitle>
          <DialogDescription>
            Search across all public pages and sections ({allMenuItems.length} items available)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isValid === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some navigation items or themes may be missing. Data is being synchronized.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages, features, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {navLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading navigation items...</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              {Object.keys(groupedItems).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No results found for "{searchTerm}"</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        {getCategoryIcon(category)}
                        <h3 className="font-semibold text-sm">{category}</h3>
                        <Badge variant="secondary" className="ml-auto">
                          {items.length}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <button
                            key={item.to}
                            onClick={() => handleItemClick(item.to)}
                            className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.to}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}

          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            {filteredItems.length} of {allMenuItems.length} public pages
            {publicItemsCount > 0 && (
              <span className="ml-2">• {publicItemsCount} from backend</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
