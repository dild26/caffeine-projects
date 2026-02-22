import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useResolveSitemap, useIsCallerAdmin } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Map, ExternalLink, Shield, Settings, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SitemapAdminPanel from '../components/SitemapAdminPanel';

export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: resolvedSitemap, isLoading } = useResolveSitemap();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const navigate = useNavigate();

  const autoSitemap = resolvedSitemap?.auto || [];
  const manualPages = resolvedSitemap?.manualPages || [];
  const controlledRoutes = resolvedSitemap?.controlledRoutes || [];

  const allEntries = [
    ...autoSitemap.map((entry) => ({ ...entry, type: 'auto' as const })),
    ...manualPages.map((page) => ({
      path: page.path,
      title: page.title,
      description: page.description,
      type: 'manual' as const,
      isSystem: page.isSystem,
    })),
    ...controlledRoutes.map((route) => ({
      path: route.path,
      title: route.title,
      description: `Delegated to ${route.delegatedApp}`,
      type: 'controlled' as const,
      delegatedApp: route.delegatedApp,
    })),
  ];

  const filteredEntries = allEntries.filter((entry) => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      entry.title.toLowerCase().includes(lowerSearch) ||
      entry.description.toLowerCase().includes(lowerSearch) ||
      entry.path.toLowerCase().includes(lowerSearch)
    );
  });

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  const getTypeBadge = (type: 'auto' | 'manual' | 'controlled', isSystem?: boolean) => {
    if (type === 'auto') {
      return <Badge variant="outline" className="text-xs">Auto</Badge>;
    }
    if (type === 'controlled') {
      return <Badge variant="secondary" className="text-xs flex items-center gap-1"><Settings className="h-3 w-3" />Controlled</Badge>;
    }
    if (isSystem) {
      return <Badge variant="default" className="text-xs flex items-center gap-1"><Shield className="h-3 w-3" />System</Badge>;
    }
    return <Badge variant="outline" className="text-xs flex items-center gap-1"><Globe className="h-3 w-3" />Manual</Badge>;
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <Map className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Site Navigation</h1>
            <p className="text-muted-foreground">Browse all available pages and manage sitemap</p>
          </div>
        </div>
      </div>

      {isAdmin ? (
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Sitemap</TabsTrigger>
            <TabsTrigger value="manage">Manage Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search pages by title, description, or path..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading sitemap...</div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Map className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? 'No pages found' : 'No pages available'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {searchTerm
                      ? 'Try adjusting your search terms to find what you\'re looking for.'
                      : 'The sitemap is currently empty. Pages will appear here as they are added.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'page' : 'pages'}
                  {' '}({autoSitemap.length} auto, {manualPages.length} manual, {controlledRoutes.length} controlled)
                </div>
                {filteredEntries.map((entry) => (
                  <Card
                    key={entry.path}
                    className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group"
                    onClick={() => handleNavigate(entry.path)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                              {entry.title}
                              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                            {getTypeBadge(entry.type, 'isSystem' in entry ? entry.isSystem : false)}
                          </div>
                          <CardDescription className="mt-1.5">{entry.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted px-3 py-1.5 rounded-md w-fit">
                        <span>{entry.path}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage">
            <SitemapAdminPanel />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search pages by title, description, or path..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading sitemap...</div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Map className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No pages found' : 'No pages available'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {searchTerm
                    ? 'Try adjusting your search terms to find what you\'re looking for.'
                    : 'The sitemap is currently empty. Pages will appear here as they are added.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'page' : 'pages'}
              </div>
              {filteredEntries.map((entry) => (
                <Card
                  key={entry.path}
                  className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group"
                  onClick={() => handleNavigate(entry.path)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                          {entry.title}
                          <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <CardDescription className="mt-1.5">{entry.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted px-3 py-1.5 rounded-md w-fit">
                      <span>{entry.path}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
