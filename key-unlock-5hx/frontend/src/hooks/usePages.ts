import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Page } from '../backend';
import { sanitizeUrl } from '../lib/urlValidator';

// Helper type for processed pages with number rank
interface ProcessedPage {
  url: string;
  name: string;
  rank: number | null;
  topAppUrl?: string;
  topApp?: string;
  category: string;
}

/**
 * Deduplicate pages by canonical URL
 */
function deduplicatePagesByUrl(pages: ProcessedPage[]): ProcessedPage[] {
  const seen = new Set<string>();
  const result: ProcessedPage[] = [];
  
  for (const page of pages) {
    const normalizedUrl = page.url.toLowerCase().trim();
    if (!seen.has(normalizedUrl)) {
      seen.add(normalizedUrl);
      result.push(page);
    }
  }
  
  return result;
}

/**
 * Get Overview pages with append-only Secoinfi-Apps integration
 * Original pages + appended Secoinfi registry (deduplicated)
 */
export function useGetOverviewPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProcessedPage[]>({
    queryKey: ['pages', 'overview'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[usePages] Actor not available for overview pages');
        return [];
      }
      try {
        const pages = await actor.getOverviewPages();
        console.log(`[usePages] Fetched ${pages.length} overview pages (with appended Secoinfi apps)`);
        
        // Sanitize URLs and convert rank to number
        const processedPages = pages.map(page => ({
          ...page,
          url: sanitizeUrl(page.url),
          rank: page.rank !== undefined && page.rank !== null ? Number(page.rank) : null,
        }));
        
        // Deduplicate by canonical URL
        const deduplicated = deduplicatePagesByUrl(processedPages);
        
        // Sort: original pages first (no rank), then appended Secoinfi apps by rank
        return deduplicated.sort((a, b) => {
          if (a.rank === null && b.rank === null) return a.name.localeCompare(b.name);
          if (a.rank === null) return -1; // Original pages first
          if (b.rank === null) return 1;
          return a.rank - b.rank;
        });
      } catch (error) {
        console.error('[usePages] Error fetching overview pages:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get Compare pages with append-only Secoinfi-Apps integration
 * Original pages + appended Secoinfi registry (deduplicated)
 */
export function useGetComparePages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProcessedPage[]>({
    queryKey: ['pages', 'compare'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[usePages] Actor not available for compare pages');
        return [];
      }
      try {
        const pages = await actor.getComparisonPages();
        console.log(`[usePages] Fetched ${pages.length} compare pages (with appended Secoinfi apps)`);
        
        // Sanitize URLs and convert rank to number
        const processedPages = pages.map(page => ({
          ...page,
          url: sanitizeUrl(page.url),
          rank: page.rank !== undefined && page.rank !== null ? Number(page.rank) : null,
        }));
        
        // Deduplicate by canonical URL
        const deduplicated = deduplicatePagesByUrl(processedPages);
        
        // Sort: original pages first (no rank), then appended Secoinfi apps by rank
        return deduplicated.sort((a, b) => {
          if (a.rank === null && b.rank === null) return a.name.localeCompare(b.name);
          if (a.rank === null) return -1; // Original pages first
          if (b.rank === null) return 1;
          return a.rank - b.rank;
        });
      } catch (error) {
        console.error('[usePages] Error fetching compare pages:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get App Management pages with append-only Secoinfi-Apps integration
 * Original pages + appended Secoinfi registry (deduplicated)
 */
export function useGetAppManagementPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProcessedPage[]>({
    queryKey: ['pages', 'appManagement'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[usePages] Actor not available for app management pages');
        return [];
      }
      try {
        const pages = await actor.getAppManagementPages();
        console.log(`[usePages] Fetched ${pages.length} app management pages (with appended Secoinfi apps)`);
        
        // Sanitize URLs and convert rank to number
        const processedPages = pages.map(page => ({
          ...page,
          url: sanitizeUrl(page.url),
          rank: page.rank !== undefined && page.rank !== null ? Number(page.rank) : null,
        }));
        
        // Deduplicate by canonical URL
        const deduplicated = deduplicatePagesByUrl(processedPages);
        
        // Sort: original pages first (no rank), then appended Secoinfi apps by rank
        return deduplicated.sort((a, b) => {
          if (a.rank === null && b.rank === null) return a.name.localeCompare(b.name);
          if (a.rank === null) return -1; // Original pages first
          if (b.rank === null) return 1;
          return a.rank - b.rank;
        });
      } catch (error) {
        console.error('[usePages] Error fetching app management pages:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get all Secoinfi-Apps from backend registry (for Sites tab only)
 * This is the canonical registry with 26+ apps
 */
export function useGetAllSecoinfiApps() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProcessedPage[]>({
    queryKey: ['pages', 'secoinfiApps'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[usePages] Actor not available for Secoinfi apps');
        return [];
      }
      try {
        const apps = await actor.getAllSecoinfiApps();
        console.log(`[usePages] Fetched ${apps.length} Secoinfi apps from registry`);
        
        // Sanitize URLs and convert rank to number, then sort
        return apps
          .map(app => ({
            ...app,
            url: sanitizeUrl(app.url),
            rank: app.rank !== undefined && app.rank !== null ? Number(app.rank) : null,
          }))
          .sort((a, b) => {
            if (a.rank === null && b.rank === null) return a.name.localeCompare(b.name);
            if (a.rank === null) return 1;
            if (b.rank === null) return -1;
            return a.rank - b.rank;
          });
      } catch (error) {
        console.error('[usePages] Error fetching Secoinfi apps:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get safe registry state with defensive guards
 */
export function useGetSafeRegistryState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ registry: ProcessedPage[]; size: number }>({
    queryKey: ['pages', 'safeRegistryState'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[usePages] Actor not available for safe registry state');
        return { registry: [], size: 0 };
      }
      try {
        const state = await actor.getSafeRegistryState();
        console.log(`[usePages] Safe registry state: ${state.size} apps`);
        return {
          registry: state.registry.map(app => ({
            ...app,
            url: sanitizeUrl(app.url),
            rank: app.rank !== undefined && app.rank !== null ? Number(app.rank) : null,
          })),
          size: Number(state.size),
        };
      } catch (error) {
        console.error('[usePages] Error fetching safe registry state:', error);
        return { registry: [], size: 0 };
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Check if registry is initialized
 */
export function useIsRegistryInitialized() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['pages', 'isRegistryInitialized'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isRegistryInitialized();
      } catch (error) {
        console.error('[usePages] Error checking registry initialization:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
  });
}

/**
 * Get registry size
 */
export function useGetRegistrySize() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['pages', 'registrySize'],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        const size = await actor.getSafeRegistrySize();
        return Number(size);
      } catch (error) {
        console.error('[usePages] Error fetching registry size:', error);
        return 0;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
  });
}
