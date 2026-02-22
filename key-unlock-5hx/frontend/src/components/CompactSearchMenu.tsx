import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMenuItems } from '../hooks/useMenuItems';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CompactSearchMenuProps {
  onNavigate: (url: string) => void;
}

export default function CompactSearchMenu({ onNavigate }: CompactSearchMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const menuItems = useMenuItems();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems;
    }

    const query = searchQuery.toLowerCase();
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query)
    );
  }, [searchQuery, menuItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof menuItems> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="space-y-4 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No results found for "{searchQuery}"
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground px-2">{category}</div>
                <div className="space-y-1">
                  {items.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onNavigate(item.url)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
