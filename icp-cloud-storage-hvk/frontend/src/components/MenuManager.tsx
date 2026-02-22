import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Trash2, Edit2, Search, Check, X } from 'lucide-react';
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
} from './ui/alert-dialog';

interface MenuItem {
  id: string;
  name: string;
  link: string;
  isAdminCreated: boolean;
}

const DEFAULT_PAGES = [
  { name: 'Dashboard', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Features', link: '/features' },
  { name: 'FAQ', link: '/faq' },
  { name: 'Contact', link: '/contact' },
  { name: 'Compare', link: '/compare' },
  { name: 'Pros', link: '/pros' },
  { name: 'Terms', link: '/terms' },
  { name: 'Sitemap', link: '/sitemap' },
];

interface MenuManagerProps {
  isAdmin: boolean;
  onNavigate: (link: string) => void;
}

export default function MenuManager({ isAdmin, onNavigate }: MenuManagerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      const items = JSON.parse(stored);
      // Check if pros and terms are missing and add them
      const hasPros = items.some((item: MenuItem) => item.link === '/pros');
      const hasTerms = items.some((item: MenuItem) => item.link === '/terms');

      if (!hasPros || !hasTerms) {
        const updatedItems = [...items];
        if (!hasPros) {
          updatedItems.push({
            id: 'default-pros',
            name: 'Pros',
            link: '/pros',
            isAdminCreated: false,
          });
        }
        if (!hasTerms) {
          updatedItems.push({
            id: 'default-terms',
            name: 'Terms',
            link: '/terms',
            isAdminCreated: false,
          });
        }
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        return updatedItems;
      }
      return items;
    }
    return DEFAULT_PAGES.map((page, index) => ({
      id: `default-${index}`,
      name: page.name,
      link: page.link,
      isAdminCreated: false,
    }));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLink, setEditLink] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageLink, setNewPageLink] = useState('');

  const saveMenuItems = useCallback((items: MenuItem[]) => {
    setMenuItems(items);
    localStorage.setItem('menuItems', JSON.stringify(items));
    window.dispatchEvent(new Event('menuItemsUpdated'));
  }, []);

  const handleAddPage = useCallback(() => {
    if (!newPageName.trim() || !newPageLink.trim()) {
      toast.error('Please enter both name and link');
      return;
    }

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: newPageName.trim(),
      link: newPageLink.trim(),
      isAdminCreated: true,
    };

    const updatedItems = [...menuItems, newItem];
    saveMenuItems(updatedItems);
    setNewPageName('');
    setNewPageLink('');
    setShowAddForm(false);
    toast.success('Page added successfully');
  }, [newPageName, newPageLink, menuItems, saveMenuItems]);

  const handleStartEdit = useCallback((item: MenuItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditLink(item.link);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editName.trim() || !editLink.trim()) {
      toast.error('Name and link cannot be empty');
      return;
    }

    const updatedItems = menuItems.map(item =>
      item.id === editingId
        ? { ...item, name: editName.trim(), link: editLink.trim() }
        : item
    );
    saveMenuItems(updatedItems);
    setEditingId(null);
    setEditName('');
    setEditLink('');
    toast.success('Page updated successfully');
  }, [editName, editLink, editingId, menuItems, saveMenuItems]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName('');
    setEditLink('');
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteId) return;

    const updatedItems = menuItems.filter(item => item.id !== deleteId);
    saveMenuItems(updatedItems);
    setDeleteId(null);
    toast.success('Page deleted successfully');
  }, [deleteId, menuItems, saveMenuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menuItems, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent/50"
            >
              {editingId === item.id ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Page name"
                    className="h-8"
                  />
                  <Input
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    placeholder="Page link"
                    className="h-8"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} className="h-7">
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7">
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate(item.link)}
                    className="flex-1 text-left font-medium hover:text-primary"
                  >
                    {item.name}
                  </button>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(item)}
                        className="h-7 w-7"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      {item.isAdminCreated && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(item.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {isAdmin && (
        <div className="space-y-3 pt-3 border-t">
          {showAddForm ? (
            <div className="space-y-2">
              <Input
                placeholder="Page name"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
              />
              <Input
                placeholder="Page link (e.g., /new-page)"
                value={newPageLink}
                onChange={(e) => setNewPageLink(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddPage} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          )}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
