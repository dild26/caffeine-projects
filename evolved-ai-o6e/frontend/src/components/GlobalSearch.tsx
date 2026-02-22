import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllMenuItems, useSearchMenuItems } from '../hooks/useQueries';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: allMenuItems = [] } = useGetAllMenuItems();
  const { data: searchResults = [] } = useSearchMenuItems(search);

  const displayItems = search.trim() ? searchResults : allMenuItems;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (itemId: string) => {
    setOpen(false);
    setSearch('');
    
    // Map menu items to routes
    const routeMap: Record<string, string> = {
      'home': '/main',
      'dashboard': '/admin',
      'search': '/main',
      'profile': '/main',
      'payments': '/main',
      'integrations': '/main',
      'moderation': '/main',
      'localization': '/main',
      'docs': '/main',
      'api': '/admin',
      'status': '/admin',
      'user-actions': '/main',
      'contextual-actions': '/main',
      'shortcuts': '/main',
      'help-support': '/main',
      'marketing': '/main',
      'legal': '/main',
      'developer': '/admin',
    };

    const route = routeMap[itemId] || '/main';
    navigate({ to: route });
  };

  const groupedItems = displayItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof displayItems>);

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search menu...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search menu items..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedItems).map(([category, items]) => (
            <CommandGroup key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleSelect(item.id)}
                >
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
