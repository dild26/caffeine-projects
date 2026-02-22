import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetNavigationMenu, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Users, Shield, HelpCircle, Gift, Search, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SitemapPage() {
  const navigate = useNavigate();
  const { data: menuItems, isLoading } = useGetNavigationMenu();
  const { data: isAdmin } = useIsCallerAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = useMemo(() => {
    if (!menuItems) return [];

    return [
      {
        icon: FileText,
        title: 'Product',
        links: menuItems.filter(item => 
          ['home', 'features', 'dashboard', 'pros-of-e-contracts'].includes(item.id)
        ),
      },
      {
        icon: Users,
        title: 'Company',
        links: menuItems.filter(item => 
          ['about-us', 'what-we-do', 'why-us', 'blog'].includes(item.id)
        ),
      },
      {
        icon: Shield,
        title: 'Trust & Security',
        links: menuItems.filter(item => 
          ['proof-of-trust', 'terms-conditions'].includes(item.id)
        ),
      },
      {
        icon: HelpCircle,
        title: 'Support',
        links: menuItems.filter(item => 
          ['faq', 'contact-us'].includes(item.id)
        ),
      },
      {
        icon: Gift,
        title: 'Programs',
        links: menuItems.filter(item => 
          ['referral', 'sitemap'].includes(item.id)
        ),
      },
    ];
  }, [menuItems]);

  // Filter sections and links based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase();
    return sections.map(section => ({
      ...section,
      links: section.links.filter(link =>
        link.displayName.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.id.toLowerCase().includes(query)
      ),
    })).filter(section => section.links.length > 0);
  }, [sections, searchQuery]);

  // All filtered links for count display
  const allFilteredLinks = useMemo(() => {
    if (!menuItems) return [];
    if (!searchQuery.trim()) return menuItems;

    const query = searchQuery.toLowerCase();
    return menuItems.filter(item =>
      item.displayName.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  const handleNavigate = (url: string, requiresAdmin: boolean) => {
    if (requiresAdmin && !isAdmin) {
      navigate({ to: '/access-denied' });
    } else {
      navigate({ to: url });
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">Sitemap</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Navigate through all pages and sections of E-Contracts
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {allFilteredLinks.length} page{allFilteredLinks.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-10 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Sitemap Grid */}
            {filteredSections.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSections.map((section, index) => (
                  <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                        <section.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.id}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left gap-2"
                              onClick={() => handleNavigate(link.url, link.requiresAdmin)}
                            >
                              <span className="flex-1">{link.displayName}</span>
                              {link.requiresAdmin && (
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              )}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No pages found matching "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </div>
            )}

            {/* All Pages List */}
            {!searchQuery && (
              <div className="mt-16">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">All Pages</CardTitle>
                    <CardDescription>Complete list of all available pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {menuItems?.map((link) => (
                        <Button
                          key={link.id}
                          variant="outline"
                          className="justify-start gap-2"
                          onClick={() => handleNavigate(link.url, link.requiresAdmin)}
                        >
                          <span className="flex-1 text-left">{link.displayName}</span>
                          {link.requiresAdmin && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
