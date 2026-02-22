import { useState } from 'react';
import { useGetSitemapPages, useCreateSitemapPage, useUpdateSitemapPage, useDeleteSitemapPage, useIsCallerAdmin } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { SitemapPage } from '../backend';

interface SitemapPageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SitemapPageManager({ open, onOpenChange }: SitemapPageManagerProps) {
  const { data: sitemapPages = [], isLoading } = useGetSitemapPages();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const createMutation = useCreateSitemapPage();
  const updateMutation = useUpdateSitemapPage();
  const deleteMutation = useDeleteSitemapPage();

  const [editingPage, setEditingPage] = useState<SitemapPage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    route: '',
    title: '',
    metadata: '',
    navOrder: '0',
    visibility: true,
    content: '',
  });

  if (!isAdmin) {
    return null;
  }

  const handleAdd = () => {
    setEditingPage(null);
    setFormData({
      id: Date.now().toString(),
      route: '',
      title: '',
      metadata: '',
      navOrder: '0',
      visibility: true,
      content: '',
    });
    setShowForm(true);
  };

  const handleEdit = (page: SitemapPage) => {
    setEditingPage(page);
    setFormData({
      id: page.id,
      route: page.route,
      title: page.title,
      metadata: page.metadata,
      navOrder: page.navOrder.toString(),
      visibility: page.visibility,
      content: page.content,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.route || !formData.title) {
      toast.error('Route and title are required');
      return;
    }

    try {
      if (editingPage) {
        await updateMutation.mutateAsync({
          id: formData.id,
          route: formData.route,
          title: formData.title,
          metadata: formData.metadata,
          navOrder: BigInt(formData.navOrder),
          visibility: formData.visibility,
          content: formData.content,
        });
        toast.success('Page updated successfully');
      } else {
        await createMutation.mutateAsync({
          route: formData.route,
          title: formData.title,
          metadata: formData.metadata,
          navOrder: BigInt(formData.navOrder),
          visibility: formData.visibility,
          content: formData.content,
        });
        toast.success('Page created successfully');
      }
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to save page');
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Page deleted successfully');
    } catch (error) {
      toast.error('Failed to delete page');
      console.error('Delete error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Sitemap Pages</DialogTitle>
          <DialogDescription>
            Create and manage markdown content pages for your sitemap
          </DialogDescription>
        </DialogHeader>

        {showForm ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="route">Route *</Label>
                <Input
                  id="route"
                  placeholder="/example"
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Page Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata">Description</Label>
              <Input
                id="metadata"
                placeholder="Page description"
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="navOrder">Navigation Order</Label>
                <Input
                  id="navOrder"
                  type="number"
                  value={formData.navOrder}
                  onChange={(e) => setFormData({ ...formData, navOrder: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visibility"
                  checked={formData.visibility}
                  onCheckedChange={(checked) => setFormData({ ...formData, visibility: checked })}
                />
                <Label htmlFor="visibility">Visible</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                placeholder="Enter markdown content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add New Page
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sitemapPages.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No sitemap pages yet. Create your first page!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sitemapPages.map((page) => (
                  <Card key={page.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{page.title}</CardTitle>
                          <CardDescription>
                            {page.route} • Order: {page.navOrder.toString()} • {page.visibility ? 'Visible' : 'Hidden'}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(page)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(page.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {page.metadata && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{page.metadata}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
