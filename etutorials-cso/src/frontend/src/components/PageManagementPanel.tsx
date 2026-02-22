import { useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import type { NavigationItem } from '../backend';
import { toast } from 'sonner';

interface PageManagementPanelProps {
  pages: NavigationItem[];
}

export default function PageManagementPanel({ pages }: PageManagementPanelProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<NavigationItem | null>(null);
  const [newPage, setNewPage] = useState({
    navLabel: '',
    url: '',
    type: 'menu',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const handleAddPage = async () => {
    if (!actor || !newPage.navLabel || !newPage.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const pageId = newPage.url.replace(/\//g, '-').replace(/^-/, '') || 'page-' + Date.now();
      const navigationItem: NavigationItem = {
        id: pageId,
        navLabel: newPage.navLabel,
        url: newPage.url.startsWith('/') ? newPage.url : `/${newPage.url}`,
        parentId: undefined,
        order: BigInt(pages.length),
        type: newPage.type,
        children: [],
        isPublic: true,
      };

      await actor.addNavigationItem(navigationItem);

      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });

      toast.success(`Page "${newPage.navLabel}" added successfully`);
      setNewPage({ navLabel: '', url: '', type: 'menu' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add page:', error);
      toast.error('Failed to add page');
    }
  };

  const handleUpdatePage = async (page: NavigationItem) => {
    if (!actor || !editingPage) return;

    try {
      await actor.updateNavigationItem(editingPage);

      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });

      toast.success(`Page "${editingPage.navLabel}" updated successfully`);
      setEditingPage(null);
    } catch (error) {
      console.error('Failed to update page:', error);
      toast.error('Failed to update page');
    }
  };

  const handleDeletePage = async (page: NavigationItem) => {
    if (!actor) return;

    if (!confirm(`Are you sure you want to delete "${page.navLabel}"?`)) {
      return;
    }

    try {
      await actor.deleteNavigationItem(page.id);

      toast.success(`Page "${page.navLabel}" deleted successfully`);
      
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    } catch (error) {
      console.error('Failed to delete page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handleGenerateAIPages = async () => {
    if (!actor) return;

    setIsGenerating(true);
    try {
      const commonPages = [
        { navLabel: 'About', url: '/about', type: 'sitemap', description: 'Learn about our educational platform' },
        { navLabel: 'Blog', url: '/blogs', type: 'sitemap', description: 'Latest news and educational insights' },
        { navLabel: 'Contact', url: '/contact', type: 'sitemap', description: 'Get in touch with our team' },
        { navLabel: 'FAQ', url: '/faq', type: 'sitemap', description: 'Frequently asked questions' },
        { navLabel: 'Features', url: '/features', type: 'sitemap', description: 'Platform features and capabilities' },
        { navLabel: 'Pros', url: '/pros', type: 'sitemap', description: 'Benefits of using E-Tutorial' },
        { navLabel: 'Referral', url: '/referral', type: 'sitemap', description: 'Refer friends and earn rewards' },
        { navLabel: 'Terms', url: '/terms', type: 'sitemap', description: 'Terms of service and policies' },
        { navLabel: 'Who', url: '/who', type: 'sitemap', description: 'Who we serve and our community' },
        { navLabel: 'What', url: '/what', type: 'sitemap', description: 'What we offer and provide' },
        { navLabel: 'Why', url: '/why', type: 'sitemap', description: 'Why choose E-Tutorial platform' },
      ];

      let addedCount = 0;
      for (const page of commonPages) {
        const exists = pages.some(p => p.url === page.url);
        if (!exists) {
          const pageId = page.url.replace(/\//g, '-').replace(/^-/, '');
          const navigationItem: NavigationItem = {
            id: pageId,
            navLabel: page.navLabel,
            url: page.url,
            parentId: undefined,
            order: BigInt(pages.length + addedCount),
            type: page.type,
            children: [],
            isPublic: true,
          };

          await actor.addNavigationItem(navigationItem);
          addedCount++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });

      toast.success(`AI generated ${addedCount} new pages`);
    } catch (error) {
      console.error('Failed to generate AI pages:', error);
      toast.error('Failed to generate AI pages');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Page Management</CardTitle>
            <CardDescription>
              Add, edit, or remove pages dynamically
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateAIPages}
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Page</DialogTitle>
                  <DialogDescription>
                    Create a new page link in the navigation system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="navLabel">Page Label</Label>
                    <Input
                      id="navLabel"
                      placeholder="e.g., About Us"
                      value={newPage.navLabel}
                      onChange={(e) => setNewPage({ ...newPage, navLabel: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL Path</Label>
                    <Input
                      id="url"
                      placeholder="e.g., /about-us"
                      value={newPage.url}
                      onChange={(e) => setNewPage({ ...newPage, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Page Type</Label>
                    <select
                      id="type"
                      className="w-full p-2 border rounded-md"
                      value={newPage.type}
                      onChange={(e) => setNewPage({ ...newPage, type: e.target.value })}
                    >
                      <option value="menu">Menu</option>
                      <option value="sitemap">Sitemap</option>
                      <option value="footer">Footer</option>
                    </select>
                  </div>
                  <Button onClick={handleAddPage} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                {editingPage?.id === page.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editingPage.navLabel}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, navLabel: e.target.value })
                      }
                      className="h-8"
                    />
                    <Input
                      value={editingPage.url}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, url: e.target.value })
                      }
                      className="h-8"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdatePage(page)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingPage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{page.navLabel}</p>
                        <Badge variant="outline" className="text-xs">
                          {page.type}
                        </Badge>
                        {page.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{page.url}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPage(page)}
                        title="Edit page"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePage(page)}
                        title="Delete page"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
