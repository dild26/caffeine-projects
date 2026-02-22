import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Page } from '../backend';
import { validateUrl, sanitizeUrl } from '../lib/urlValidator';

/**
 * Get all Secoinfi-Apps from backend registry (single source of truth)
 * This is the canonical registry with 26+ apps that should ALWAYS render in Sites grid
 */
export function useGetAllSecoinfiApps() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['secoinfiApps', 'all'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[useSecoinfiApps] Actor not available, returning empty array');
        return [];
      }
      
      try {
        const apps = await actor.getAllSecoinfiApps();
        console.log(`[useSecoinfiApps] Fetched ${apps.length} Secoinfi apps from backend`);
        
        // Sanitize URLs but keep ALL apps (no filtering)
        return apps.map(app => ({
          ...app,
          url: sanitizeUrl(app.url),
        }));
      } catch (error) {
        console.error('[useSecoinfiApps] Error fetching Secoinfi apps:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get safe registry state with defensive guards
 * Ensures the registry is NEVER empty when data exists
 */
export function useGetSafeRegistryState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ registry: Page[]; size: number }>({
    queryKey: ['secoinfiApps', 'safeState'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[useSecoinfiApps] Actor not available for safe state check');
        return { registry: [], size: 0 };
      }
      
      try {
        const state = await actor.getSafeRegistryState();
        console.log(`[useSecoinfiApps] Safe registry state: ${state.size} apps`);
        // Convert bigint to number for TypeScript compatibility
        return {
          registry: state.registry,
          size: Number(state.size),
        };
      } catch (error) {
        console.error('[useSecoinfiApps] Error fetching safe registry state:', error);
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
    queryKey: ['secoinfiApps', 'isInitialized'],
    queryFn: async () => {
      if (!actor) return false;
      
      try {
        return await actor.isRegistryInitialized();
      } catch (error) {
        console.error('[useSecoinfiApps] Error checking registry initialization:', error);
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
    queryKey: ['secoinfiApps', 'size'],
    queryFn: async () => {
      if (!actor) return 0;
      
      try {
        const size = await actor.getSafeRegistrySize();
        return Number(size);
      } catch (error) {
        console.error('[useSecoinfiApps] Error fetching registry size:', error);
        return 0;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
  });
}

/**
 * Validate Secoinfi app URLs
 * Returns apps with validation status
 */
export function useValidateSecoinfiApps() {
  const { data: apps = [] } = useGetAllSecoinfiApps();

  return useQuery<Array<Page & { isValidUrl: boolean; sanitizedUrl: string }>>({
    queryKey: ['secoinfiApps', 'validated', apps.length],
    queryFn: async () => {
      return apps.map(app => {
        const sanitized = sanitizeUrl(app.url);
        const isValid = validateUrl(sanitized);
        
        return {
          ...app,
          isValidUrl: isValid,
          sanitizedUrl: sanitized,
        };
      });
    },
    enabled: apps.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
