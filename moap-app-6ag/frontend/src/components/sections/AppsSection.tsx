import { useState } from 'react';
import { useGetApps, useGetSecoinfiApps } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ExternalLink, CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export function AppsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const { data: apps, isLoading: appsLoading, error: appsError } = useGetApps(showArchived);
  const { data: secoinfiApps, isLoading: secoinfiLoading, error: secoinfiError } = useGetSecoinfiApps();

  const filteredApps = apps?.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app as any).category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredSecoinfiApps = secoinfiApps?.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedApps = filteredApps?.sort((a, b) => Number(a.rank - b.rank));

  const isCanonicalUrl = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('https://') && url.endsWith('.caffeine.xyz');
  };

  return (
    <div className="space-y-8">
      {/* SECOINFI Apps Registry Section */}
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <strong>Apps Registry:</strong> This section lists all registered SECOINFI applications with canonical URLs and category grouping for discovery. 
            Data is loaded from spec.yaml (priority 1), spec.json (priority 2), or defaultSpec.json (fallback).
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived" className="cursor-pointer">
              Show archived
            </Label>
          </div>
        </div>

        {appsLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading SECOINFI applications...</p>
              </div>
              <div className="space-y-4 mt-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : appsError ? (
          <Alert variant="destructive">
            <AlertTitle>Error Loading Applications</AlertTitle>
            <AlertDescription>
              Failed to load SECOINFI applications. Please check your configuration files (spec.yaml, spec.json, or defaultSpec.json).
              <br />
              <code className="text-xs mt-2 block">{String(appsError)}</code>
            </AlertDescription>
          </Alert>
        ) : sortedApps && sortedApps.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Index</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>App ID</TableHead>
                      <TableHead className="w-32 text-center">URL Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedApps.map((app) => {
                      const category = (app as any).category || 'uncategorized';
                      const urlIsCanonical = isCanonicalUrl(app.url);

                      return (
                        <TableRow key={app.id} className={app.archived ? 'opacity-60' : ''}>
                          <TableCell className="font-medium text-primary">
                            #{Number(app.rank)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <a
                                      href={app.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium hover:underline flex items-center gap-1"
                                    >
                                      {app.name}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{app.url}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {app.archived && (
                                <Badge variant="secondary" className="text-xs">
                                  Archived
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {app.id}
                            </code>
                          </TableCell>
                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-center gap-1">
                                    {urlIsCanonical ? (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                          Valid
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <span className="text-xs text-red-600 dark:text-red-400">
                                          Invalid
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {urlIsCanonical ? (
                                    <p>
                                      URL follows the canonical format:
                                      https://&lt;subdomain&gt;.caffeine.xyz
                                    </p>
                                  ) : (
                                    <p>
                                      URL does not follow the canonical format. Expected:
                                      https://&lt;subdomain&gt;.caffeine.xyz
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No applications found matching your search.'
                  : 'No applications available. Check that spec.yaml or spec.json is properly configured with the appsRegistry section.'}
              </p>
            </CardContent>
          </Card>
        )}

        {sortedApps && sortedApps.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {sortedApps.length} application{sortedApps.length !== 1 ? 's' : ''}
            {showArchived && ' (including archived)'}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Secoinfi Apps Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Secoinfi Modules</h2>
          <Alert className="bg-secondary/5 border-secondary/20">
            <Info className="h-4 w-4 text-secondary" />
            <AlertDescription className="text-sm text-foreground/80">
              <strong>Secoinfi Apps:</strong> This section lists all 26 Secoinfi modules integrated into the MoAP ecosystem for demonstration and configuration purposes. 
              The complete list is dynamically loaded from the <code className="text-xs bg-muted px-1 py-0.5 rounded">secoinfiApps</code> section in spec.yaml with proper URL validation, 
              canonicalization, and error handling to prevent blank displays.
            </AlertDescription>
          </Alert>
        </div>

        {secoinfiLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                <p className="text-muted-foreground">Loading Secoinfi modules...</p>
              </div>
              <div className="space-y-4 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : secoinfiError ? (
          <Alert variant="destructive">
            <AlertTitle>Error Loading Secoinfi Modules</AlertTitle>
            <AlertDescription>
              Failed to load Secoinfi modules. Please check that the <code className="text-xs bg-muted px-1 py-0.5 rounded">secoinfiApps</code> section exists in spec.yaml.
              <br />
              <code className="text-xs mt-2 block">{String(secoinfiError)}</code>
            </AlertDescription>
          </Alert>
        ) : filteredSecoinfiApps && filteredSecoinfiApps.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-32 text-center">URL Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSecoinfiApps.map((app, index) => {
                      const urlIsCanonical = isCanonicalUrl(app.url);

                      return (
                        <TableRow key={app.key}>
                          <TableCell className="font-medium text-secondary">
                            #{index + 1}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href={app.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline flex items-center gap-1"
                                  >
                                    {app.name}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{app.url}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{app.key}</code>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-center gap-1">
                                    {urlIsCanonical ? (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                          Valid
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <span className="text-xs text-red-600 dark:text-red-400">
                                          Invalid
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {urlIsCanonical ? (
                                    <p>
                                      URL follows the canonical format:
                                      https://&lt;subdomain&gt;.caffeine.xyz
                                    </p>
                                  ) : (
                                    <p>
                                      URL does not follow the canonical format. Expected:
                                      https://&lt;subdomain&gt;.caffeine.xyz
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No Secoinfi modules found matching your search.'
                  : 'No Secoinfi modules available. Check that the secoinfiApps section exists in spec.yaml with all 26 modules properly configured.'}
              </p>
            </CardContent>
          </Card>
        )}

        {filteredSecoinfiApps && filteredSecoinfiApps.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {filteredSecoinfiApps.length} Secoinfi module
            {filteredSecoinfiApps.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
