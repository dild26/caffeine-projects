import { useState, useMemo } from 'react';
import { useGetAllMenuItems, useIsCallerAdmin, useAddMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '../hooks/useQueries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Search, Plus, Edit2, Trash2, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { MenuItem } from '../backend';

export default function DynamicMenu() {
  const { data: menuItems, isLoading: menuLoading } = useGetAllMenuItems();
  const { data: isAdmin } = useIsCallerAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    menuLabel: '',
    url: '',
    category: 'standard',
  });

  const addMutation = useAddMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();

  // Filter and group menu items - NO ROLE-BASED FILTERING for public visibility
  const groupedMenuItems = useMemo(() => {
    if (!menuItems) return { standard: [], cloned: [], external: [] };
    
    const query = searchQuery.toLowerCase();
    const filtered = query 
      ? menuItems.filter(item => 
          item.menuLabel.toLowerCase().includes(query) ||
          item.url.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        )
      : menuItems;

    // Show all visible items regardless of authentication status
    const visible = filtered.filter(item => item.isVisible);
    
    return visible.reduce((acc, item) => {
      if (item.category === 'standard') {
        acc.standard.push(item);
      } else if (item.category === 'cloned') {
        acc.cloned.push(item);
      } else if (item.category === 'external') {
        acc.external.push(item);
      }
      return acc;
    }, { standard: [] as MenuItem[], cloned: [] as MenuItem[], external: [] as MenuItem[] });
  }, [menuItems, searchQuery]);

  const totalFilteredItems = groupedMenuItems.standard.length + groupedMenuItems.cloned.length + groupedMenuItems.external.length;

  const handleAddMenuItem = async () => {
    if (!newMenuItem.menuLabel || !newMenuItem.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const menuItem: MenuItem = {
        id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        menuLabel: newMenuItem.menuLabel,
        url: newMenuItem.url,
        category: newMenuItem.category,
        source: 'manual',
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        version: BigInt(1),
        isVisible: true,
        order: BigInt(menuItems?.length || 0),
      };

      await addMutation.mutateAsync(menuItem);
      toast.success('Menu item added successfully');
      setAddDialogOpen(false);
      setNewMenuItem({ menuLabel: '', url: '', category: 'standard' });
    } catch (error) {
      toast.error('Failed to add menu item');
      console.error('Add error:', error);
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;

    try {
      const updatedItem: MenuItem = {
        ...editingItem,
        updatedAt: BigInt(Date.now() * 1000000),
        version: editingItem.version + BigInt(1),
      };

      await updateMutation.mutateAsync(updatedItem);
      toast.success('Menu item updated successfully');
      setEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update menu item');
      console.error('Update error:', error);
    }
  };

  const handleDeleteMenuItem = async (menuItemId: string, label: string) => {
    if (!confirm(`Are you sure you want to delete "${label}"?`)) return;

    try {
      await deleteMutation.mutateAsync(menuItemId);
      toast.success('Menu item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error('Delete error:', error);
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  // Always show menu if there are items, regardless of authentication
  if (!menuItems || menuItems.length === 0) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
          <Sparkles className="h-4 w-4" />
          Menu
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[420px]">
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">AI-Assisted Menu</span>
              </div>
              {isAdmin && (
                <Button size="sm" variant="outline" onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Page
                </Button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {!searchQuery && menuItems && (
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>{menuItems.filter(item => item.isVisible).length} visible items</span>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[500px]">
            {menuLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : totalFilteredItems > 0 ? (
              <div className="pb-2">
                {groupedMenuItems.standard.length > 0 && (
                  <div className="mb-1">
                    <DropdownMenuLabel className="flex items-center justify-between py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs font-semibold">Standard Pages</Badge>
                        <span className="text-xs text-muted-foreground">({groupedMenuItems.standard.length})</span>
                      </div>
                    </DropdownMenuLabel>
                    <div className="px-1">
                      {groupedMenuItems.standard.sort((a, b) => Number(a.order) - Number(b.order)).map((item) => (
                        <div key={item.id} className="group relative">
                          <DropdownMenuItem
                            onClick={() => {
                              if (item.url.startsWith('http')) {
                                window.open(item.url, '_blank');
                              }
                            }}
                            className="cursor-pointer flex items-center justify-between py-2.5 px-3"
                          >
                            <span className="flex items-center gap-2 flex-1 min-w-0">
                              {item.url.startsWith('http') && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                              <span className="truncate">{item.menuLabel}</span>
                            </span>
                            {isAdmin && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(item);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMenuItem(item.id, item.menuLabel);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </DropdownMenuItem>
                        </div>
                      ))}
                    </div>
                    {(groupedMenuItems.cloned.length > 0 || groupedMenuItems.external.length > 0) && (
                      <DropdownMenuSeparator className="my-2" />
                    )}
                  </div>
                )}
                {groupedMenuItems.cloned.length > 0 && (
                  <div className="mb-1">
                    <DropdownMenuLabel className="flex items-center justify-between py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-semibold">Cloned Pages</Badge>
                        <span className="text-xs text-muted-foreground">({groupedMenuItems.cloned.length})</span>
                      </div>
                    </DropdownMenuLabel>
                    <div className="px-1">
                      {groupedMenuItems.cloned.sort((a, b) => Number(a.order) - Number(b.order)).map((item) => (
                        <div key={item.id} className="group relative">
                          <DropdownMenuItem
                            onClick={() => {
                              if (item.url.startsWith('http')) {
                                window.open(item.url, '_blank');
                              }
                            }}
                            className="cursor-pointer flex items-center justify-between py-2.5 px-3"
                          >
                            <span className="flex items-center gap-2 flex-1 min-w-0">
                              {item.url.startsWith('http') && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                              <span className="truncate">{item.menuLabel}</span>
                            </span>
                            {isAdmin && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(item);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMenuItem(item.id, item.menuLabel);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </DropdownMenuItem>
                        </div>
                      ))}
                    </div>
                    {groupedMenuItems.external.length > 0 && <DropdownMenuSeparator className="my-2" />}
                  </div>
                )}
                {groupedMenuItems.external.length > 0 && (
                  <div className="mb-1">
                    <DropdownMenuLabel className="flex items-center gap-2 py-3 px-3">
                      <Badge variant="outline" className="text-xs font-semibold">External Links</Badge>
                      <span className="text-xs text-muted-foreground">({groupedMenuItems.external.length})</span>
                    </DropdownMenuLabel>
                    <div className="px-1">
                      {groupedMenuItems.external.sort((a, b) => Number(a.order) - Number(b.order)).map((item) => (
                        <div key={item.id} className="group relative">
                          <DropdownMenuItem
                            onClick={() => {
                              if (item.url.startsWith('http')) {
                                window.open(item.url, '_blank');
                              }
                            }}
                            className="cursor-pointer flex items-center justify-between py-2.5 px-3"
                          >
                            <span className="flex items-center gap-2 flex-1 min-w-0">
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="truncate">{item.menuLabel}</span>
                            </span>
                            {isAdmin && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(item);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMenuItem(item.id, item.menuLabel);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </DropdownMenuItem>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground px-4">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p className="font-medium">No menu items found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">No menu items available</p>
                    <p className="text-xs">Menu items will appear here once added</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          {searchQuery && totalFilteredItems > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground text-center">
                Showing {totalFilteredItems} of {menuItems?.filter(item => item.isVisible).length || 0} items
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Menu Item Dialog - Admin Only */}
      {isAdmin && (
        <>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Create a new menu item with a custom label and URL
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="menuLabel">Menu Label *</Label>
                  <Input
                    id="menuLabel"
                    placeholder="e.g., About Us, Blog, Features"
                    value={newMenuItem.menuLabel}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, menuLabel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    placeholder="e.g., /about, https://example.com"
                    value={newMenuItem.url}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newMenuItem.category}
                    onValueChange={(value) => setNewMenuItem({ ...newMenuItem, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="cloned">Cloned</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMenuItem} disabled={addMutation.isPending}>
                  {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Menu Item Dialog - Admin Only */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Menu Item</DialogTitle>
                <DialogDescription>
                  Update the menu item label and URL
                </DialogDescription>
              </DialogHeader>
              {editingItem && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editMenuLabel">Menu Label *</Label>
                    <Input
                      id="editMenuLabel"
                      value={editingItem.menuLabel}
                      onChange={(e) => setEditingItem({ ...editingItem, menuLabel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editUrl">URL *</Label>
                    <Input
                      id="editUrl"
                      value={editingItem.url}
                      onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCategory">Category</Label>
                    <Select
                      value={editingItem.category}
                      onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                    >
                      <SelectTrigger id="editCategory">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="cloned">Cloned</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateMenuItem} disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
