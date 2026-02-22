import { useEffect, useState, useCallback } from 'react';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import type { NavigationItem, Theme } from '../backend';
import { toast } from 'sonner';

const MAX_SEED_ATTEMPTS = 3;
const SEED_RETRY_DELAY = 2000;
const VALIDATION_INTERVAL = 5000; // Check every 5 seconds

export default function DataSeeder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);
  const [hasSeeded, setHasSeeded] = useState(false);
  const [seedAttempts, setSeedAttempts] = useState(0);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);

  // Runtime validation and self-healing (frontend-side)
  const validateAndHeal = useCallback(async () => {
    if (!actor || isSeeding) return false;

    try {
      console.log('🔍 Running runtime validation...');
      
      // Fetch current data
      const [themes, navItems] = await Promise.all([
        actor.getThemes().catch(() => []),
        actor.getNavigationItems().catch(() => []),
      ]);
      
      // Validate on frontend
      const hasVibgyor = themes.some(t => t.id.toLowerCase() === 'vibgyor');
      const hasDark = themes.some(t => t.id.toLowerCase() === 'dark');
      const hasLight = themes.some(t => t.id.toLowerCase() === 'light');
      const hasPublicNavItems = navItems.some(n => n.isPublic);
      
      const isValid = hasVibgyor && hasDark && hasLight && hasPublicNavItems;
      
      if (isValid) {
        console.log('✅ Runtime validation passed');
        return true;
      } else {
        console.warn('⚠️ Runtime validation detected issues');
        console.log('Missing:', {
          vibgyor: !hasVibgyor,
          dark: !hasDark,
          light: !hasLight,
          publicNav: !hasPublicNavItems,
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Runtime validation failed:', error);
      return false;
    }
  }, [actor, isSeeding]);

  // Periodic validation to ensure data integrity
  useEffect(() => {
    if (!actor || !hasSeeded) return;

    const interval = setInterval(async () => {
      const now = new Date();
      if (lastValidation && (now.getTime() - lastValidation.getTime()) < VALIDATION_INTERVAL) {
        return;
      }

      setLastValidation(now);
      await validateAndHeal();
    }, VALIDATION_INTERVAL);

    return () => clearInterval(interval);
  }, [actor, hasSeeded, lastValidation, validateAndHeal]);

  // Initial data seeding
  useEffect(() => {
    const seedData = async () => {
      if (!actor || isSeeding || hasSeeded || seedAttempts >= MAX_SEED_ATTEMPTS) return;

      try {
        setIsSeeding(true);
        setSeedAttempts(prev => prev + 1);
        console.log(`🌱 DataSeeder: Starting data validation and seeding (attempt ${seedAttempts + 1}/${MAX_SEED_ATTEMPTS})...`);

        // Check if data already exists
        const [existingThemes, existingNavItems] = await Promise.all([
          actor.getThemes().catch(() => []),
          actor.getNavigationItems().catch(() => []),
        ]);

        console.log('📊 Current data:', {
          themes: existingThemes.length,
          navItems: existingNavItems.length,
        });

        // Run validation
        console.log('🔧 Running runtime validation...');
        const isValid = await validateAndHeal();

        // Re-fetch after validation
        const [themesAfterValidation, navItemsAfterValidation] = await Promise.all([
          actor.getThemes().catch(() => []),
          actor.getNavigationItems().catch(() => []),
        ]);

        // Check if we have minimum required data
        const hasMinimumData = themesAfterValidation.length >= 3 && navItemsAfterValidation.length > 0;

        if (hasMinimumData && isValid) {
          console.log('✅ Data already seeded, refreshing queries...');
          await queryClient.invalidateQueries();
          setHasSeeded(true);
          setIsSeeding(false);
          toast.success('Platform data loaded successfully', { duration: 3000 });
          return;
        }

        console.log('🌱 Seeding initial data...');

        // Seed themes if missing
        if (themesAfterValidation.length < 3) {
          console.log('📝 Seeding themes...');
          const themes: Theme[] = [
            {
              id: 'vibgyor',
              name: 'VIBGYOR',
              primaryColor: 'oklch(0.45 0.20 280)',
              secondaryColor: 'oklch(0.75 0.10 320)',
              backgroundColor: 'oklch(0.98 0.01 300)',
              textColor: 'oklch(0.20 0.08 280)',
              accentColor: 'oklch(0.55 0.18 200)',
            },
            {
              id: 'dark',
              name: 'Dark',
              primaryColor: 'oklch(0.98 0 0)',
              secondaryColor: 'oklch(0.25 0 0)',
              backgroundColor: 'oklch(0.15 0 0)',
              textColor: 'oklch(0.98 0 0)',
              accentColor: 'oklch(0.30 0 0)',
            },
            {
              id: 'light',
              name: 'Light',
              primaryColor: 'oklch(0.20 0 0)',
              secondaryColor: 'oklch(0.96 0 0)',
              backgroundColor: 'oklch(1 0 0)',
              textColor: 'oklch(0.15 0 0)',
              accentColor: 'oklch(0.96 0 0)',
            },
          ];

          for (const theme of themes) {
            try {
              await actor.addTheme(theme);
            } catch (error) {
              console.error(`Failed to add theme ${theme.name}:`, error);
            }
          }
          console.log('✅ Themes seeded:', themes.length);
        }

        // Seed navigation items if missing
        if (navItemsAfterValidation.length === 0) {
          console.log('📝 Seeding navigation items...');
          const navigationItems: NavigationItem[] = [
            { id: 'home', navLabel: 'Home', url: '/', parentId: undefined, order: 0n, type: 'menu', children: [], isPublic: true },
            { id: 'dashboard', navLabel: 'Dashboard', url: '/dashboard', parentId: undefined, order: 1n, type: 'menu', children: [], isPublic: true },
            { id: 'explore', navLabel: 'Explore', url: '/explore', parentId: undefined, order: 2n, type: 'menu', children: [], isPublic: true },
            { id: 'resources', navLabel: 'Resources', url: '/resources', parentId: undefined, order: 3n, type: 'menu', children: [], isPublic: true },
            { id: 'instructors', navLabel: 'Instructors', url: '/instructors', parentId: undefined, order: 4n, type: 'menu', children: [], isPublic: true },
            { id: 'appointments', navLabel: 'Appointments', url: '/appointments', parentId: undefined, order: 5n, type: 'menu', children: [], isPublic: true },
            { id: 'about', navLabel: 'About', url: '/about', parentId: undefined, order: 6n, type: 'sitemap', children: [], isPublic: true },
            { id: 'features', navLabel: 'Features', url: '/features', parentId: undefined, order: 7n, type: 'sitemap', children: [], isPublic: true },
            { id: 'contact', navLabel: 'Contact', url: '/contact', parentId: undefined, order: 8n, type: 'sitemap', children: [], isPublic: true },
            { id: 'faq', navLabel: 'FAQ', url: '/faq', parentId: undefined, order: 9n, type: 'sitemap', children: [], isPublic: true },
            { id: 'blogs', navLabel: 'Blog', url: '/blogs', parentId: undefined, order: 10n, type: 'sitemap', children: [], isPublic: true },
            { id: 'join-us', navLabel: 'Join Us', url: '/join-us', parentId: undefined, order: 11n, type: 'sitemap', children: [], isPublic: true },
            { id: 'values', navLabel: 'Values', url: '/values', parentId: undefined, order: 12n, type: 'sitemap', children: [], isPublic: true },
            { id: 'info', navLabel: 'Info', url: '/info', parentId: undefined, order: 13n, type: 'sitemap', children: [], isPublic: true },
            { id: 'keywords', navLabel: 'Keywords', url: '/keywords', parentId: undefined, order: 14n, type: 'sitemap', children: [], isPublic: true },
            { id: 'locations', navLabel: 'Locations', url: '/locations', parentId: undefined, order: 15n, type: 'sitemap', children: [], isPublic: true },
            { id: 'maps', navLabel: 'Maps', url: '/maps', parentId: undefined, order: 16n, type: 'sitemap', children: [], isPublic: true },
            { id: 'geo-map', navLabel: 'Geo Map', url: '/geo-map', parentId: undefined, order: 17n, type: 'sitemap', children: [], isPublic: true },
            { id: 'navigation', navLabel: 'Navigation', url: '/navigation', parentId: undefined, order: 18n, type: 'sitemap', children: [], isPublic: true },
            { id: 'sitemap', navLabel: 'Sitemap', url: '/sitemap', parentId: undefined, order: 19n, type: 'sitemap', children: [], isPublic: true },
            { id: 'design', navLabel: 'Design', url: '/design', parentId: undefined, order: 20n, type: 'sitemap', children: [], isPublic: true },
            { id: 'permissions', navLabel: 'Permissions', url: '/permissions', parentId: undefined, order: 21n, type: 'sitemap', children: [], isPublic: true },
            { id: 'queries', navLabel: 'Queries', url: '/queries', parentId: undefined, order: 22n, type: 'sitemap', children: [], isPublic: true },
            { id: 'responsive-design', navLabel: 'Responsive Design', url: '/responsive-design', parentId: undefined, order: 23n, type: 'sitemap', children: [], isPublic: true },
            { id: 'timestamp', navLabel: 'Timestamp', url: '/timestamp', parentId: undefined, order: 24n, type: 'sitemap', children: [], isPublic: true },
            { id: 'ui-ux', navLabel: 'UI/UX', url: '/ui-ux', parentId: undefined, order: 25n, type: 'sitemap', children: [], isPublic: true },
            { id: 'what-why', navLabel: '5W Framework', url: '/what-why-when-where-who', parentId: undefined, order: 26n, type: 'sitemap', children: [], isPublic: true },
            { id: 'admin', navLabel: 'Admin', url: '/admin', parentId: undefined, order: 27n, type: 'menu', children: [], isPublic: false },
          ];

          for (const item of navigationItems) {
            try {
              await actor.addNavigationItem(item);
            } catch (error) {
              console.error(`Failed to add navigation item ${item.navLabel}:`, error);
            }
          }
          console.log('✅ Navigation items seeded:', navigationItems.length);
        }

        // Invalidate all queries to refresh data
        console.log('🔄 Invalidating queries to refresh data...');
        await queryClient.invalidateQueries();

        console.log('✅ Data seeding complete');
        setHasSeeded(true);
        toast.success('Platform initialized successfully', { duration: 3000 });
      } catch (error) {
        console.error('❌ Failed to seed data:', error);
        
        // Retry logic
        if (seedAttempts < MAX_SEED_ATTEMPTS - 1) {
          toast.error('Initializing platform data... Retrying...', { duration: 2000 });
          setTimeout(() => {
            setIsSeeding(false);
          }, SEED_RETRY_DELAY);
        } else {
          toast.error('Failed to initialize platform. Please refresh the page.', { duration: 5000 });
        }
      } finally {
        if (seedAttempts >= MAX_SEED_ATTEMPTS - 1 || hasSeeded) {
          setIsSeeding(false);
        }
      }
    };

    seedData();
  }, [actor, isSeeding, hasSeeded, seedAttempts, queryClient, validateAndHeal]);

  return null;
}
