import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useGetManualPages, useAddManualPage, useGetControlledRoutes, useAddControlledRoute } from '../../hooks/useQueries';
import { Plus, FileText, Route, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ManualPageManagement() {
  const [newPage, setNewPage] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [appId, setAppId] = useState('');

  const { data: manualPages = [], isLoading: pagesLoading } = useGetManualPages();
  const { data: controlledRoutes = [], isLoading: routesLoading } = useGetControlledRoutes();
  const addManualPage = useAddManualPage();
  const addControlledRoute = useAddControlledRoute();

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.trim()) return;

    await addManualPage.mutateAsync(newPage.trim());
    setNewPage('');
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute || !appId.trim()) return;

    await addControlledRoute.mutateAsync({ route: selectedRoute, appId: appId.trim() });
    setSelectedRoute('');
    setAppId('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manual Page Management
          </CardTitle>
          <CardDescription>
            Add custom page slugs to the sitemap. Pages are stored in order of priority and must be unique, lowercase, and not duplicate existing sitemap entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddPage} className="flex gap-2">
            <Input
              placeholder="Enter page slug (e.g., about, contact)"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
              disabled={addManualPage.isPending}
              className="flex-1"
            />
            <Button type="submit" disabled={addManualPage.isPending || !newPage.trim()}>
              {addManualPage.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </>
              )}
            </Button>
          </form>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Existing Manual Pages ({manualPages.length})</h3>
            {pagesLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading pages...
              </div>
            ) : manualPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No manual pages added yet
              </div>
            ) : (
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                <div className="space-y-2">
                  {manualPages.map((page, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">/{page}</span>
                      </div>
                      <Badge variant="secondary">Read-only</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Controlled Routes
          </CardTitle>
          <CardDescription>
            Map special routes (/broadcast, /remote, /live) to whitelisted Secoinfi-Apps. These routes have restricted write access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddRoute} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Route</label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/broadcast">/broadcast</SelectItem>
                    <SelectItem value="/remote">/remote</SelectItem>
                    <SelectItem value="/live">/live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">App ID</label>
                <Input
                  placeholder="Enter Secoinfi-App ID"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  disabled={addControlledRoute.isPending}
                />
              </div>
            </div>
            <Button type="submit" disabled={addControlledRoute.isPending || !selectedRoute || !appId.trim()}>
              {addControlledRoute.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </>
              )}
            </Button>
          </form>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Configured Routes ({controlledRoutes.length})</h3>
            {routesLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading routes...
              </div>
            ) : controlledRoutes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No controlled routes configured yet
              </div>
            ) : (
              <ScrollArea className="h-[200px] border rounded-lg p-4">
                <div className="space-y-2">
                  {controlledRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{route.route}</Badge>
                        <span className="text-sm text-muted-foreground">→</span>
                        <span className="font-medium font-mono text-sm">{route.appId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
