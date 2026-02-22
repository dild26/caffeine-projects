import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Terminal, History, Bookmark, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import { blockDefinitions } from '../blockDefinitions';
import { validateConnection, getConnectionTooltip } from '../lib/aiConnectivityRules';
import { Block, Connection } from '../types';

interface CLIInterfaceProps {
  blocks: Block[];
  connections: Connection[];
  onExecuteChain: (chain: string) => void;
  onClose?: () => void;
}

interface CommandHistoryItem {
  command: string;
  timestamp: number;
  success: boolean;
}

interface AutocompleteSuggestion {
  text: string;
  confidence: number;
  description: string;
}

export default function CLIInterface({ blocks, connections, onExecuteChain, onClose }: CLIInterfaceProps) {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load command history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('cli-command-history');
    if (savedHistory) {
      try {
        setCommandHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load command history:', error);
      }
    }
  }, []);

  // Save command history to localStorage
  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem('cli-command-history', JSON.stringify(commandHistory.slice(-50)));
    }
  }, [commandHistory]);

  // Parse command and generate suggestions
  useEffect(() => {
    if (!command.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setValidationError(null);
      return;
    }

    const parts = command.split('>').map(p => p.trim());
    const currentPart = parts[parts.length - 1];

    if (!currentPart) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Generate autocomplete suggestions
    const matchingBlocks = blockDefinitions
      .filter(def => 
        def.type.toLowerCase().includes(currentPart.toLowerCase()) ||
        def.label.toLowerCase().includes(currentPart.toLowerCase())
      )
      .map(def => ({
        text: def.type,
        confidence: calculateConfidence(def, currentPart, parts.slice(0, -1)),
        description: `${def.label} (${def.category})`
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    setSuggestions(matchingBlocks);
    setShowSuggestions(matchingBlocks.length > 0);
    setSelectedSuggestionIndex(0);

    // Validate the chain
    if (parts.length > 1 && parts.every(p => p)) {
      const validation = validateChain(parts);
      setValidationError(validation.error);
    } else {
      setValidationError(null);
    }
  }, [command]);

  const calculateConfidence = (def: any, input: string, previousParts: string[]): number => {
    let confidence = 0;

    // Exact match
    if (def.type === input) confidence += 0.5;
    else if (def.type.startsWith(input)) confidence += 0.3;
    else if (def.type.includes(input)) confidence += 0.2;

    // Label match
    if (def.label.toLowerCase().includes(input.toLowerCase())) confidence += 0.1;

    // Context-based scoring
    if (previousParts.length > 0) {
      const lastPart = previousParts[previousParts.length - 1];
      const lastDef = blockDefinitions.find(d => d.type === lastPart);
      
      if (lastDef && lastDef.outputs.length > 0 && def.inputs.length > 0) {
        const outputType = lastDef.outputs[0].type;
        const inputType = def.inputs[0].type;
        
        if (outputType === inputType || outputType === 'any' || inputType === 'any') {
          confidence += 0.3;
        }
      }
    }

    return Math.min(confidence, 1.0);
  };

  const validateChain = (parts: string[]): { valid: boolean; error: string | null } => {
    for (let i = 0; i < parts.length; i++) {
      const def = blockDefinitions.find(d => d.type === parts[i]);
      if (!def) {
        return { valid: false, error: `Unknown block type: ${parts[i]}` };
      }

      // Check if block can be connected in chain
      if (i > 0) {
        const prevDef = blockDefinitions.find(d => d.type === parts[i - 1]);
        if (prevDef && prevDef.outputs.length === 0) {
          return { valid: false, error: `${prevDef.label} has no outputs` };
        }
        if (def.inputs.length === 0) {
          return { valid: false, error: `${def.label} has no inputs` };
        }
      }
    }

    return { valid: true, error: null };
  };

  const handleExecute = useCallback(() => {
    if (!command.trim()) return;

    const parts = command.split('>').map(p => p.trim()).filter(p => p);
    const validation = validateChain(parts);

    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    // Add to history
    const historyItem: CommandHistoryItem = {
      command,
      timestamp: Date.now(),
      success: true
    };
    setCommandHistory(prev => [...prev, historyItem]);

    // Execute the chain
    onExecuteChain(command);

    // Clear command
    setCommand('');
    setHistoryIndex(-1);
    setValidationError(null);
    setShowSuggestions(false);
  }, [command, onExecuteChain]);

  const handleClear = useCallback(() => {
    setCommand('');
    setHistoryIndex(-1);
    setValidationError(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        // Accept suggestion
        const suggestion = suggestions[selectedSuggestionIndex];
        const parts = command.split('>');
        parts[parts.length - 1] = suggestion.text;
        setCommand(parts.join(' > ') + ' > ');
        setShowSuggestions(false);
        inputRef.current?.focus();
      } else {
        handleExecute();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        const suggestion = suggestions[selectedSuggestionIndex];
        const parts = command.split('>');
        parts[parts.length - 1] = suggestion.text;
        setCommand(parts.join(' > ') + ' > ');
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions) {
        setSelectedSuggestionIndex(prev => Math.max(0, prev - 1));
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions) {
        setSelectedSuggestionIndex(prev => Math.min(suggestions.length - 1, prev + 1));
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  // Syntax highlighting
  const renderHighlightedCommand = () => {
    if (!command) return null;

    const parts = command.split('>');
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center px-3 text-sm font-mono">
        {parts.map((part, index) => {
          const trimmed = part.trim();
          const def = blockDefinitions.find(d => d.type === trimmed);
          const isValid = !!def;
          
          return (
            <span key={index} className="flex items-center">
              <span className={isValid ? 'text-green-500' : 'text-red-500'}>
                {part}
              </span>
              {index < parts.length - 1 && (
                <span className="text-muted-foreground mx-1">{'>'}</span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  useGlobalKeyboard('cli-interface', {
    onEscape: handleClear,
    onEnter: handleExecute,
    enabled: !isMinimized,
    priority: 10
  });

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">CLI Interface (Minimized)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="h-6 w-6 p-0"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">CLI Interface</span>
          <Badge variant="outline" className="text-xs">
            Use {'>'} to chain tools
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Minimize (Esc)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {onClose && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="relative">
          <div className="relative">
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command chain (e.g., text-input > to-hex > to-hash)"
              className="font-mono text-sm pr-20 bg-background"
              autoFocus
            />
            {command && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
              >
                Clear
              </Button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.text}
                  onClick={() => {
                    const parts = command.split('>');
                    parts[parts.length - 1] = suggestion.text;
                    setCommand(parts.join(' > ') + ' > ');
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors ${
                    index === selectedSuggestionIndex ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm text-foreground">{suggestion.text}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {validationError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            <img 
              src="/assets/generated/cli-error-icon-transparent.dim_24x24.png" 
              alt="Error" 
              className="w-4 h-4"
            />
            <span>{validationError}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 bg-muted rounded border border-border">Enter</kbd>
          <span>Execute</span>
          <span className="mx-2">•</span>
          <kbd className="px-2 py-1 bg-muted rounded border border-border">Tab</kbd>
          <span>Accept suggestion</span>
          <span className="mx-2">•</span>
          <kbd className="px-2 py-1 bg-muted rounded border border-border">↑↓</kbd>
          <span>Navigate</span>
          <span className="mx-2">•</span>
          <kbd className="px-2 py-1 bg-muted rounded border border-border">Esc</kbd>
          <span>Clear</span>
        </div>
      </div>
    </div>
  );
}
