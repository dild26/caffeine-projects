import { useEffect } from 'react';
import { useMenuItems } from './useMenuItems';

export function useSeedMenuItems() {
  const menuItems = useMenuItems();

  useEffect(() => {
    console.warn('Menu item seeding skipped: Backend methods not yet implemented');
  }, [menuItems]);

  return { isSeeding: false, isSeeded: false };
}
