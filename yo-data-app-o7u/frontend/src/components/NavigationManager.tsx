import { useState } from 'react';
import {
  useGetNavigationPages,
  useCreateNavigationPage,
  useUpdateNavigationPage,
  useDeleteNavigationPage,
} from '../hooks/useQueries';
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
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NavigationManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NavigationManager({ open, onOpenChange }: NavigationManagerProps) {
  const { data: pages = [], isLoading } = useGetNavigationPages();
  const addPage = useCreateNavigationPage();
  const updatePage = useUpdateNavigationPage();
  const deletePage = useDeleteNavigationPage();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<{ id: string; route: string; title: string } | null>(null);
  const [deleteConfirmPage, setDeleteConfirmPage] = useState<string | null>(null);

  const [newRoute, setNewRoute] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleAddPage = async () => {
    if (!newRoute || !newTitle) {
      toast.error('Please fill in all fields');
      return;
    }

    const route = newRoute.startsWith('/') ? newRoute : `/${newRoute}`;

    try {
      await addPage.mutateAsync({
        route,
        title: newTitle,
        metadata: '',
      });
      toast.success('Page added successfully');
      setAddDialogOpen(false);
      setNewRoute('');
      setNewTitle('');
    } catch (error) {
      toast.error('Failed to add page');
      console.error(error);
    }
  };

  const handleUpdatePage = async () => {
    if (!editingPage) return;

    try {
      await updatePage.mutateAsync({
        id: editingPage.id,
        route: editingPage.route,
        title: editingPage.title,
        metadata: '',
      });
      toast.success('Page updated successfully');
      setEditingPage(null);
    } catch (error) {
      toast.error('Failed to update page');
      console.error(error);
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage.mutateAsync(id);
      toast.success('Page deleted successfully');
      setDeleteConfirmPage(null);
    } catch (error) {
      toast.error('Failed to delete page');
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Navigation Pages</DialogTitle>
            <DialogDescription>Add, edit, or remove navigation pages from the menu</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button onClick={() => setAddDialogOpen(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : pages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No custom pages yet. Click "Add Page" to create one.
              </div>
            ) : (
              <div className="space-y-2">
                {pages.map((page) => (
                  <Card key={page.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-muted-foreground">{page.route}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setEditingPage({
                              id: page.id,
                              route: page.route,
                              title: page.title,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmPage(page.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Page Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
            <DialogDescription>Create a new navigation page</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="route">Route</Label>
              <Input
                id="route"
                placeholder="/about"
                value={newRoute}
                onChange={(e) => setNewRoute(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="About"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPage} disabled={addPage.isPending}>
              {addPage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>Update page details</DialogDescription>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-route">Route</Label>
                <Input
                  id="edit-route"
                  value={editingPage.route}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, route: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingPage.title}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, title: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPage(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePage} disabled={updatePage.isPending}>
              {updatePage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmPage} onOpenChange={(open) => !open && setDeleteConfirmPage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page from the navigation menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmPage && handleDeletePage(deleteConfirmPage)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
