import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ExternalLink, Search, Loader2, Grid3x3 } from 'lucide-react';
import { useGetAllSecoinfiApps } from '../hooks/useQueries';

export default function AppsPage() {
  const { data: apps = [], isLoading } = useGetAllSecoinfiApps();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = apps.filter((app) => {
    const search = searchTerm.toLowerCase();
    return (
      app.name.toLowerCase().includes(search) ||
      app.description.toLowerCase().includes(search)
    );
  });

  const appCount = apps.length;

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Grid3x3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {isLoading ? (
              'Secoinfi-Apps'
            ) : appCount > 0 ? (
              `${appCount}${appCount >= 26 ? '+' : ''} Secoinfi-Apps`
            ) : (
              'Secoinfi-Apps'
            )}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Explore the integrated applications and features of Multi-Apps-Unify
        </p>
        {!isLoading && appCount > 0 && (
          <div className="mt-4">
            <Badge variant="secondary" className="text-sm">
              {appCount} {appCount === 1 ? 'Application' : 'Applications'} Available
            </Badge>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search applications by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading applications from spec.yaml...</p>
            </div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Grid3x3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 text-lg font-semibold">
                  {searchTerm ? 'No applications found' : 'No applications available'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search terms or clear the search to see all applications.'
                    : 'Applications will appear here once they are added to spec.yaml.'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredApps.length} of {apps.length} {apps.length === 1 ? 'application' : 'applications'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app, index) => (
                <Card key={index} className="group transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground transition-colors hover:text-primary"
                          title={`Visit ${app.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {app.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {app.description}
                    </CardDescription>
                  </CardHeader>
                  {app.url && (
                    <CardContent>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        Visit Application
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Applications are dynamically loaded from spec.yaml and automatically sync in real-time.
            {appCount > 0 && ` Currently displaying ${appCount} ${appCount === 1 ? 'application' : 'applications'}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
