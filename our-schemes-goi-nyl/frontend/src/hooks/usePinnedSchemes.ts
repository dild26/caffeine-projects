import { useState, useEffect } from 'react';
import type { Scheme } from '@/backend';

const STORAGE_KEY = 'ourschemes_pinned';

export function usePinnedSchemes() {
  const [pinnedSchemes, setPinnedSchemes] = useState<Scheme[]>([]);

  // Load pinned schemes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPinnedSchemes(parsed);
      }
    } catch (error) {
      console.error('Failed to load pinned schemes:', error);
    }
  }, []);

  // Save to localStorage whenever pinnedSchemes changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedSchemes));
    } catch (error) {
      console.error('Failed to save pinned schemes:', error);
    }
  }, [pinnedSchemes]);

  const isPinned = (schemeId: number) => {
    return pinnedSchemes.some((s) => Number(s.id) === schemeId);
  };

  const togglePin = (scheme: Scheme) => {
    setPinnedSchemes((prev) => {
      const schemeId = Number(scheme.id);
      const exists = prev.some((s) => Number(s.id) === schemeId);
      
      if (exists) {
        return prev.filter((s) => Number(s.id) !== schemeId);
      } else {
        return [...prev, scheme];
      }
    });
  };

  const clearAll = () => {
    setPinnedSchemes([]);
  };

  return {
    pinnedSchemes,
    isPinned,
    togglePin,
    clearAll,
  };
}
