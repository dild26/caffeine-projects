import { useEffect, useCallback } from 'react';

export interface KeyboardHandlers {
  onEscape?: () => void;
  onEnter?: () => void;
  enabled?: boolean;
  priority?: number;
}

// Global registry for keyboard handlers
const handlerRegistry: Map<string, KeyboardHandlers & { priority: number }> = new Map();

export function useGlobalKeyboard(id: string, handlers: KeyboardHandlers) {
  const { onEscape, onEnter, enabled = true, priority = 0 } = handlers;

  useEffect(() => {
    if (enabled) {
      handlerRegistry.set(id, { onEscape, onEnter, priority });
    } else {
      handlerRegistry.delete(id);
    }

    return () => {
      handlerRegistry.delete(id);
    };
  }, [id, onEscape, onEnter, enabled, priority]);
}

// Global keyboard event listener
export function initializeGlobalKeyboardHandler() {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Skip if user is typing in an input field
    const target = e.target as HTMLElement;
    const isInputField = 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable;

    // Get all registered handlers sorted by priority (higher priority first)
    const handlers = Array.from(handlerRegistry.values()).sort((a, b) => b.priority - a.priority);

    if (e.key === 'Escape') {
      e.preventDefault();
      // Execute the highest priority Escape handler
      for (const handler of handlers) {
        if (handler.onEscape) {
          handler.onEscape();
          break; // Only execute the first (highest priority) handler
        }
      }
    } else if (e.key === 'Enter' && !isInputField) {
      // Only handle Enter when not in an input field
      e.preventDefault();
      // Execute the highest priority Enter handler
      for (const handler of handlers) {
        if (handler.onEnter) {
          handler.onEnter();
          break; // Only execute the first (highest priority) handler
        }
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
