import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGetSitemapState, useGetAllPages, useAddManualPage } from '../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Map } from 'lucide-react';

export default function SitemapManagementPanel() {
  const { data: sitemapState } = useGetSitemapState();
  const { data: allPages = [] } = useGetAllPages();
  const addManualPage = useAddManualPage();
  const [newPageSlug, setNewPageSlug] = useState('');

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageSlug.trim()) {
      toast.error('Please enter a page slug');
      return;
    }

    try {
      await addManualPage.mutateAsync(newPageSlug.toLowerCase().trim());
      toast.success(`Page "${newPageSlug}" added successfully`);
      setNewPageSlug('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
      console.error(error);
    }
  };

  const manualPages = allPages.filter(p => p.pageType === 'manual');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Map className="mr-2 h-5 w-5" />
          Sitemap Management
        </CardTitle>
        <CardDescription>Add and manage custom pages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Page Form */}
        <form onSubmit={handleAddPage} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminPageSlug">New Page Slug</Label>
            <div className="flex space-x-2">
              <Input
                id="adminPageSlug"
                type="text"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                placeholder="e.g., angel-vc, dex, e-com"
                className="flex-1"
                pattern="[a-z0-9-]+"
                title="Only lowercase letters, numbers, and hyphens allowed"
              />
              <Button type="submit" disabled={addManualPage.isPending || !newPageSlug.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                {addManualPage.isPending ? 'Adding...' : 'Add'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must be lowercase, unique, and contain only letters, numbers, and hyphens
            </p>
          </div>
        </form>

        {/* Current Manual Pages */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Manual Pages ({manualPages.length})</h4>
          {manualPages.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
              No manual pages added yet
            </div>
          ) : (
            <div className="space-y-2">
              {manualPages.map((page) => (
                <div key={page.slug} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-mono text-sm">/{page.slug}</span>
                  <Badge variant="secondary">Manual</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sitemap Info */}
        {sitemapState && (
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Version: {Number(sitemapState.version)}</div>
              <div>Total Pages: {allPages.length}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
