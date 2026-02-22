import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { blockDefinitions } from '../blockDefinitions';

interface BlockLibraryProps {
  onClose: () => void;
}

export default function BlockLibrary({ onClose }: BlockLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    inputs: { label: 'Inputs', color: 'from-blue-500 to-blue-600' },
    logic: { label: 'Logic', color: 'from-purple-500 to-purple-600' },
    conversion: { label: 'Conversion Tools', color: 'from-cyan-500 to-cyan-600' },
    cryptographic: { label: 'Cryptographic', color: 'from-pink-500 to-pink-600' },
    ethereum: { label: 'Ethereum Ecosystem', color: 'from-indigo-500 to-indigo-600' },
    blockchain: { label: 'Blockchain', color: 'from-emerald-500 to-emerald-600' },
    display: { label: 'Display', color: 'from-orange-500 to-orange-600' }
  };

  const filteredBlocks = blockDefinitions.filter(block =>
    block.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Block Library</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categoryBlocks = filteredBlocks.filter(
              block => block.category === categoryKey
            );

            if (categoryBlocks.length === 0) return null;

            return (
              <div key={categoryKey}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  {categoryInfo.label}
                </h3>
                <div className="space-y-2">
                  {categoryBlocks.map(block => (
                    <div
                      key={block.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block.type)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 cursor-move transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center shrink-0`}>
                        <img src={block.icon} alt="" className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{block.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {block.inputs.length} in • {block.outputs.length} out
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
