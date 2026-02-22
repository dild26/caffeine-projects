import { useState, useEffect, useCallback } from 'react';
import {
  useGetAllMenuItems,
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from '../hooks/useQueries';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import type { MenuItem } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Menu, Edit, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

type SyncStatus = 'idle' | 'pending' | 'syncing' | 'saved' | 'failed';

const CATEGORIES = ['navigation', 'user', 'modules', 'resources', 'system', 'actions'];

export default function MenuItemsTab() {
  const { data: menuItems = [], isLoading } = useGetAllMenuItems();
  const { mutate: addMenuItem, isPending: isAdding } = useAddMenuItem();
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();
  const { mutate: deleteMenuItem, isPending: isDeleting } = useDeleteMenuItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ id: '', name: '', category: 'navigation' });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [originalMenuItem, setOriginalMenuItem] = useState<MenuItem | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isUpdating) {
      setSyncStatus('syncing');
    }
  }, [isUpdating]);

  const handleSave = useCallback((item: MenuItem) => {
    updateMenuItem(item, {
      onSuccess: () => {
        setSyncStatus('saved');
        setOriginalMenuItem(item);
        setTimeout(() => setSyncStatus('idle'), 2000);
      },
      onError: (error) => {
        setSyncStatus('failed');
        toast.error(`Failed to update menu item: ${error.message}`);
        setTimeout(() => setSyncStatus('idle'), 3000);
      },
    });
  }, [updateMenuItem]);

  useDebouncedSave(editingMenuItem, (value) => {
    if (value && originalMenuItem && JSON.stringify(value) !== JSON.stringify(originalMenuItem)) {
      setSyncStatus('pending');
      handleSave(value);
    }
  }, 3000);

  const handleAdd = () => {
    if (!newMenuItem.id || !newMenuItem.name || !newMenuItem.category) {
      toast.error('Please fill in all fields');
      return;
    }

    addMenuItem(newMenuItem, {
      onSuccess: () => {
        toast.success('Menu item added successfully');
        setNewMenuItem({ id: '', name: '', category: 'navigation' });
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to add menu item: ${error.message}`);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete menu item "${name}"?`)) return;

    deleteMenuItem(id, {
      onSuccess: () => {
        toast.success('Menu item deleted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to delete menu item: ${error.message}`);
      },
    });
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingMenuItem(item);
    setOriginalMenuItem(item);
    setIsEditDialogOpen(true);
    setSyncStatus('idle');
  };

  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'syncing':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'saved':
        return <Badge variant="default"><Check className="h-3 w-3 mr-1" />Saved</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Items Management</CardTitle>
              <CardDescription>
                Manage menu items with 3-second debounced auto-save and live search
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>Create a new menu item with category</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="menu-id">Menu Item ID</Label>
                    <Input
                      id="menu-id"
                      value={newMenuItem.id}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, id: e.target.value })}
                      placeholder="e.g., custom-action"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menu-name">Menu Item Name</Label>
                    <Input
                      id="menu-name"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                      placeholder="e.g., Custom Action"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menu-category">Category</Label>
                    <Select
                      value={newMenuItem.category}
                      onValueChange={(value) => setNewMenuItem({ ...newMenuItem, category: value })}
                    >
                      <SelectTrigger id="menu-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} disabled={isAdding}>
                    {isAdding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Menu Item'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search-menu">Search Menu Items</Label>
            <Input
              id="search-menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, category, or ID..."
              className="max-w-md"
            />
          </div>

          {Object.keys(groupedItems).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <Menu className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                {searchTerm ? 'No menu items match your search.' : 'No menu items yet. Add your first menu item to get started.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
                    {category}
                    <Badge variant="secondary">{items.length}</Badge>
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => openEditDialog(item)}
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.id, item.name)}
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Edit Menu Item</DialogTitle>
                <DialogDescription>Update menu item details</DialogDescription>
              </div>
              {getSyncBadge()}
            </div>
          </DialogHeader>
          {editingMenuItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-menu-id">Menu Item ID</Label>
                <Input
                  id="edit-menu-id"
                  value={editingMenuItem.id}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-menu-name">Menu Item Name</Label>
                <Input
                  id="edit-menu-name"
                  value={editingMenuItem.name}
                  onChange={(e) => {
                    setEditingMenuItem({ ...editingMenuItem, name: e.target.value });
                    setSyncStatus('pending');
                  }}
                  placeholder="Menu item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-menu-category">Category</Label>
                <Select
                  value={editingMenuItem.category}
                  onValueChange={(value) => {
                    setEditingMenuItem({ ...editingMenuItem, category: value });
                    setSyncStatus('pending');
                  }}
                >
                  <SelectTrigger id="edit-menu-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Auto-Save:</strong> Changes are automatically saved 3 seconds after you stop typing.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingMenuItem(null);
                setOriginalMenuItem(null);
                setSyncStatus('idle');
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
