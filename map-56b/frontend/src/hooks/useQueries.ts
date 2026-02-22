import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Page, ShareSelectedResult, SecoinfiAppEntry } from '../backend';
import { validateAndResolveUrl, getCanonicalUrl } from '../lib/urlValidator';

// Local type definitions for types not yet in backend interface
export interface SelectAllStateInput {
  appId: bigint;
  isSelected: boolean;
}

export interface AppDiscoveryInput {
  appIdentifiers: string[];
}

export interface AppDiscoveryResult {
  appIdentifier: string;
  discoveredPages: string[];
  status: string;
  timestamp: bigint;
}

export interface SitemapDiscoveryResult {
  domain: string;
  discoveredPages: string[];
  status: string;
  timestamp: bigint;
}

// Local type for app data extracted from Pages
export interface AppData {
  appName: string;
  subdomain: string;
  canonicalUrl: string;
  status: string;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest';
      const role = await actor.getCallerUserRole();
      return role;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ============================================================================
// SECOINFI APPS ENTRIES MANAGEMENT (Backend Integration)
// ============================================================================

export function useGetAllSecoinfiAppsEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SecoinfiAppEntry[]>({
    queryKey: ['secoinfiAppsEntries'],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getAllSecoinfiAppsEntries();
      console.log(`[useQueries] Fetched ${entries.length} Secoinfi app entries from backend`);
      return entries;
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAddSecoinfiAppEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      appName: string;
      subdomain: string;
      canonicalUrl: string;
      categoryTags: string;
      status: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[useQueries] Adding Secoinfi app entry:', params);
      const id = await actor.addSecoinfiAppEntry(
        params.appName,
        params.subdomain,
        params.canonicalUrl,
        params.categoryTags,
        params.status
      );
      
      console.log('[useQueries] Successfully added entry with ID:', id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error) => {
      console.error('[useQueries] Failed to add Secoinfi app entry:', error);
    },
  });
}

export function useUpdateSecoinfiAppEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      appName: string;
      canonicalUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[useQueries] Updating Secoinfi app entry:', params);
      const success = await actor.updateSecoinfiAppEntry(
        params.id,
        params.appName,
        params.canonicalUrl
      );
      
      console.log('[useQueries] Update result:', success);
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error) => {
      console.error('[useQueries] Failed to update Secoinfi app entry:', error);
    },
  });
}

export function useDeleteSecoinfiAppEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[useQueries] Deleting Secoinfi app entry:', id);
      const success = await actor.deleteSecoinfiAppEntry(id);
      
      console.log('[useQueries] Delete result:', success);
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error) => {
      console.error('[useQueries] Failed to delete Secoinfi app entry:', error);
    },
  });
}

export function useBulkDeleteSecoinfiAppEntries() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: bigint[]) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[useQueries] Bulk deleting Secoinfi app entries:', ids);
      await actor.bulkDeleteSecoinfiAppEntries(ids);
      
      console.log('[useQueries] Bulk delete completed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error) => {
      console.error('[useQueries] Failed to bulk delete Secoinfi app entries:', error);
    },
  });
}

// ============================================================================
// PAGES REGISTRY FUNCTIONS (using available backend methods)
// ============================================================================

export function useGetPagesRegistry() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['pagesRegistry'],
    queryFn: async () => {
      if (!actor) return [];
      // Use getAllSecoinfiApps which returns the canonical registry
      const pages = await actor.getAllSecoinfiApps();
      
      // Validate and resolve all URLs
      return pages.map(page => ({
        ...page,
        url: validateAndResolveUrl(page.url, page.name),
        topAppUrl: page.topAppUrl ? validateAndResolveUrl(page.topAppUrl, page.topApp || undefined) : undefined,
      }));
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

/**
 * Share selected pages across Overview, Compare, Sites, and Apps tabs
 */
export function useShareSelectedPages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (selectedIds: bigint[]): Promise<ShareSelectedResult> => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[ShareSelected] Sharing pages with IDs:', selectedIds);
      
      // Call backend shareSelectedPages method
      const result = await actor.shareSelectedPages(selectedIds);
      
      console.log('[ShareSelected] Backend returned:', {
        overview: result.overview.length,
        compare: result.compare.length,
        sites: result.sites.length,
        apps: result.apps.length,
        message: result.message,
      });
      
      return result;
    },
    onSuccess: (result) => {
      // Invalidate all affected tab queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['pages', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['pages', 'compare'] });
      queryClient.invalidateQueries({ queryKey: ['pages', 'secoinfiApps'] });
      queryClient.invalidateQueries({ queryKey: ['pages', 'appManagement'] });
      
      console.log('[ShareSelected] Successfully shared pages across tabs');
    },
    onError: (error) => {
      console.error('[ShareSelected] Failed to share selected pages:', error);
    },
  });
}

/**
 * Extract app data from Pages registry with URL validation
 * This provides backward compatibility for components expecting app-specific data
 */
export function useGetAppsFromPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppData[]>({
    queryKey: ['appsFromPages'],
    queryFn: async () => {
      if (!actor) return [];
      // Use getOverviewPages instead of getPagesWithTopApps (not available)
      const pages = await actor.getOverviewPages();
      
      // Extract unique apps from pages with topApp and topAppUrl
      const appsMap = new Map<string, AppData>();
      
      pages.forEach(page => {
        if (page.topApp && page.topAppUrl) {
          // Validate and resolve the URL
          const validatedUrl = validateAndResolveUrl(page.topAppUrl, page.topApp);
          
          try {
            const url = new URL(validatedUrl);
            const hostname = url.hostname;
            const parts = hostname.split('.');
            const subdomain = parts.length >= 3 ? parts[0] : hostname;
            
            if (!appsMap.has(subdomain)) {
              appsMap.set(subdomain, {
                appName: page.topApp,
                subdomain: subdomain,
                canonicalUrl: validatedUrl,
                status: 'active',
              });
            }
          } catch (error) {
            console.warn(`[useGetAppsFromPages] Failed to parse topAppUrl for page ${page.name}:`, error);
          }
        }
      });
      
      // Convert map to array and sort by appName
      return Array.from(appsMap.values()).sort((a, b) => a.appName.localeCompare(b.appName));
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ============================================================================
// SITEMAP DISCOVERY FUNCTIONS
// ============================================================================

export function useDiscoverSitemapPages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domain: string) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend HTTP outcalls not yet implemented - using mock data
      console.warn('[Discovery] Backend HTTP outcalls not yet implemented. Using mock data.');
      
      // Validate domain and construct canonical URL
      const canonicalUrl = getCanonicalUrl(domain) || `https://${domain}.caffeine.xyz/`;
      
      const mockResult: SitemapDiscoveryResult = {
        domain,
        discoveredPages: [
          `${canonicalUrl}about`,
          `${canonicalUrl}contact`,
          `${canonicalUrl}features`,
          `${canonicalUrl}faq`,
          `${canonicalUrl}pros`,
        ].map(url => validateAndResolveUrl(url)),
        status: 'success',
        timestamp: BigInt(Date.now() * 1000000),
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapData'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapByApp'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapStats'] });
    },
    onError: (error) => {
      console.error('[Discovery] Sitemap discovery error:', error);
    },
  });
}

export function useDiscoverAllApps() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Get pages from backend registry using available method
      const pages = await actor.getOverviewPages();
      
      // Extract unique app identifiers from topAppUrl with validation
      const appIdentifiers = pages
        .filter(page => page.topAppUrl)
        .map(page => {
          try {
            const validatedUrl = validateAndResolveUrl(page.topAppUrl!, page.topApp || undefined);
            const url = new URL(validatedUrl);
            const hostname = url.hostname;
            const parts = hostname.split('.');
            return parts.length >= 3 ? parts[0] : hostname;
          } catch {
            return '';
          }
        })
        .filter(id => id !== '');
      
      const uniqueIdentifiers = Array.from(new Set(appIdentifiers));
      
      console.log(`[Discovery] Starting discovery for ${uniqueIdentifiers.length} apps from backend registry:`, uniqueIdentifiers);
      
      // Backend method not yet implemented - using mock data with validated URLs
      console.warn('[Discovery] Backend method not fully implemented, using mock data with URL validation');
      
      const mockResults: AppDiscoveryResult[] = uniqueIdentifiers.map((identifier: string) => {
        const canonicalUrl = getCanonicalUrl(identifier) || `https://${identifier}.caffeine.xyz/`;
        
        return {
          appIdentifier: identifier,
          discoveredPages: [
            `${canonicalUrl}about`,
            `${canonicalUrl}contact`,
            `${canonicalUrl}features`,
            `${canonicalUrl}faq`,
            `${canonicalUrl}pros`,
          ].map(url => validateAndResolveUrl(url)),
          status: 'success',
          timestamp: BigInt(Date.now() * 1000000),
        };
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return mockResults;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapData'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapByApp'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapStats'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapDiscoveryLogs'] });
    },
    onError: (error) => {
      console.error('[Discovery] Discover all apps error:', error);
    },
  });
}

export function useAddSitemapPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, url, category, parentId }: { name: string; url: string; category: string; parentId: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method addSitemapEntry not available - store in localStorage
      console.warn('[Sitemap] Backend addSitemapEntry method not available, using localStorage');
      
      const normalizedName = name.toLowerCase();
      const validatedUrl = validateAndResolveUrl(url, name);
      
      const entry = {
        id: Date.now(),
        name: normalizedName,
        url: validatedUrl,
        category,
        parentId: parentId ? Number(parentId) : null,
        children: [],
        hash: '',
        lastUpdated: Date.now(),
      };
      
      // Store in localStorage
      const stored = localStorage.getItem('sitemapEntries');
      const entries = stored ? JSON.parse(stored) : [];
      entries.push(entry);
      localStorage.setItem('sitemapEntries', JSON.stringify(entries));
      
      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapData'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapByApp'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapStats'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapEntries'] });
    },
    onError: (error) => {
      console.error('[Sitemap] Add sitemap page error:', error);
    },
  });
}

export function useDeleteSitemapPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method deleteSitemapEntry not available - remove from localStorage
      console.warn('[Sitemap] Backend deleteSitemapEntry method not available, using localStorage');
      
      const stored = localStorage.getItem('sitemapEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        const filtered = entries.filter((e: any) => e.id !== Number(entryId));
        localStorage.setItem('sitemapEntries', JSON.stringify(filtered));
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapData'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapByApp'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapStats'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapEntries'] });
    },
    onError: (error) => {
      console.error('[Sitemap] Delete sitemap page error:', error);
    },
  });
}

export function useGetSitemapDiscoveryLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SitemapDiscoveryResult[]>({
    queryKey: ['sitemapDiscoveryLogs'],
    queryFn: async () => {
      if (!actor) return [];
      
      // Backend method not yet implemented
      console.warn('[Discovery] Backend getSitemapDiscoveryLogs method not yet fully implemented');
      return [];
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetSelectAllState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SelectAllStateInput) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented - save to localStorage
      localStorage.setItem(`selectAllState_${input.appId}`, JSON.stringify(input));
      return input;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['selectAllState', Number(variables.appId)] });
      queryClient.invalidateQueries({ queryKey: ['allSelectAllStates'] });
    },
    onError: (error) => {
      console.error('[SelectAll] Set select all state error:', error);
    },
  });
}

export function useGetSelectAllState(appId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['selectAllState', appId],
    queryFn: async () => {
      if (!actor || appId === 0) return null;
      // Backend method not yet implemented - read from localStorage
      const stored = localStorage.getItem(`selectAllState_${appId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    },
    enabled: !!actor && !actorFetching && appId > 0,
    retry: false,
  });
}

export function useGetAllSelectAllStates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['allSelectAllStates'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented
      return [];
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
