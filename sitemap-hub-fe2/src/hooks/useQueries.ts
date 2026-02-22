import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, SubscriptionTier, Subscription, SearchResponse, UserRole, PayAsYouUsePurchase, SearchResult, Referral, Commission, ExportRecord, ExportType, AnalyticsData, GodsEyeSummary, ExtensionCount, StripeConfiguration, CatalogEntry, CatalogFilter, CatalogSort, CatalogQuery, CatalogResponse, CatalogSortBy, CatalogSortOrder, DiagnosticLog, DiagnosticResult, RecoveryAction, RecoveryResult } from '@/backend';
import { Principal } from '@dfinity/principal';

// Frontend-only Field Management Types
export interface FieldDefinition {
  id: number;
  name: string;
  value: string;
  category: FieldCategory;
  isChecked: boolean;
  createdAt: number;
  updatedAt: number;
  status: FieldStatus;
  order: number;
}

export type FieldCategory = 'email' | 'phone' | 'address' | 'payment' | 'social' | 'financial' | 'business' | 'branding' | 'other';
export type FieldStatus = 'active' | 'inactive' | 'archived';

export interface FieldUpdate {
  id: number;
  value: string;
  isChecked: boolean;
  updatedAt: number;
}

// User Profile Queries
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

// User Role Queries
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Check if current user is admin
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Subscription Queries
export function useGetCallerSubscription() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Subscription | null>({
    queryKey: ['currentSubscription'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerSubscription();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: SubscriptionTier) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscription(tier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
    },
  });
}

// Pay As You Use Queries
export function useGetPayAsYouUsePurchases() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PayAsYouUsePurchase[]>({
    queryKey: ['payAsYouUsePurchases'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPayAsYouUsePurchases();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function usePurchasePayAsYouUseBatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchSize: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.purchasePayAsYouUseBatch(BigInt(batchSize));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payAsYouUsePurchases'] });
    },
  });
}

// Stripe Configuration Query
export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setStripeConfiguration(config);
      return config;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
      await queryClient.refetchQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

// Enhanced Search Queries
export function usePublicSearchUrls() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ query, page, pageSize }: { query: string; page: number; pageSize: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publicSearchUrls(query, BigInt(page), BigInt(pageSize));
    },
  });
}

export function useGetAllValidTlds() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allValidTlds'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const tlds = await actor.getAllValidTlds();

      const formattedTlds = tlds.map(tld =>
        tld.startsWith('.') ? tld : `.${tld}`
      ).sort((a, b) => a.localeCompare(b));

      return formattedTlds;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useGetExtensionCounts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExtensionCount[]>({
    queryKey: ['extensionCounts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const counts = await actor.getExtensionCounts();
      return counts.sort((a, b) => {
        const countDiff = Number(b.count) - Number(a.count);
        return countDiff !== 0 ? countDiff : a.extension.localeCompare(b.extension);
      });
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useSearchValidTlds() {
  const { data: allTlds = [] } = useGetAllValidTlds();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      const normalizedTerm = searchTerm.trim().toLowerCase();

      if (!normalizedTerm) {
        return allTlds;
      }

      const termWithDot = normalizedTerm.startsWith('.') ? normalizedTerm : `.${normalizedTerm}`;
      const termWithoutDot = normalizedTerm.startsWith('.') ? normalizedTerm.substring(1) : normalizedTerm;

      const matches = allTlds.filter(tld => {
        const tldWithoutDot = tld.substring(1);

        return (
          tld.includes(termWithDot) ||
          tldWithoutDot.includes(termWithoutDot) ||
          tld.startsWith(termWithDot) ||
          tldWithoutDot.startsWith(termWithoutDot) ||
          tldWithoutDot === termWithoutDot
        );
      });

      return matches.length > 0 ? matches : allTlds;
    },
  });
}

export function useUnifiedSearch() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ searchTerm, page, pageSize }: { searchTerm: string; page: number; pageSize: number }) => {
      if (!actor) throw new Error('Actor not available');

      const normalizedTerm = searchTerm.trim();

      if (!normalizedTerm) {
        return {
          results: [],
          totalResults: BigInt(0),
          page: BigInt(page),
          pageSize: BigInt(pageSize),
        };
      }

      try {
        const response = await actor.publicSearchUrls(normalizedTerm, BigInt(page), BigInt(pageSize));

        if (!response || !response.results) {
          throw new Error('Invalid response from backend');
        }

        return response;
      } catch (error) {
        console.error('Unified search error:', error);
        return {
          results: [],
          totalResults: BigInt(0),
          page: BigInt(page),
          pageSize: BigInt(pageSize),
        };
      }
    },
    retry: false,
  });
}

export function useFilterDomainsByExtension() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ extension, page, pageSize }: { extension: string; page: number; pageSize: number }) => {
      if (!actor) throw new Error('Actor not available');

      const normalizedExtension = extension.startsWith('.') ? extension : `.${extension}`;

      return actor.filterDomainsByExtension(normalizedExtension, BigInt(page), BigInt(pageSize));
    },
  });
}

export function useGetAllDomains() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allDomains'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllDomains();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useGetSitemapData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (domain: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitemapData(domain);
    },
  });
}

export function useGetAllSitemapData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SearchResult[]>({
    queryKey: ['allSitemapData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllSitemapData();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useAddSitemapData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domain, results }: { domain: string; results: SearchResult[] }) => {
      if (!actor) throw new Error('Actor not available');

      const normalizedResults = results.map(result => {
        let normalizedUrl = result.url.trim();

        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
          if (normalizedUrl.startsWith('www.')) {
            normalizedUrl = `https://${normalizedUrl}`;
          } else {
            normalizedUrl = `https://${normalizedUrl}`;
          }
        }

        return {
          ...result,
          url: normalizedUrl
        };
      });

      try {
        const backupData = {
          id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          domain,
          entryCount: normalizedResults.length,
          results: normalizedResults,
          description: `Auto-backup before adding ${normalizedResults.length} entries to ${domain}`,
          version: '1.0',
          checksum: generateChecksum(normalizedResults),
        };

        const existingBackups = JSON.parse(localStorage.getItem('sitemapBackups') || '[]');
        existingBackups.push(backupData);

        const recentBackups = existingBackups.slice(-100);
        localStorage.setItem('sitemapBackups', JSON.stringify(recentBackups));

        try {
          await storeInIndexedDB('sitemapBackups', backupData);
        } catch (idbError) {
          console.warn('IndexedDB backup failed, localStorage backup successful:', idbError);
        }

        console.log(`✓ Migration-safe backup created: ${backupData.id}`);
      } catch (backupError) {
        console.warn('Frontend auto-backup failed, proceeding with upload:', backupError);
      }

      let uploadSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!uploadSuccess && retryCount < maxRetries) {
        try {
          await actor.addSitemapData(domain, normalizedResults);
          uploadSuccess = true;
        } catch (uploadError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw new Error(`Upload failed after ${maxRetries} attempts: ${uploadError}`);
          }
          console.warn(`Upload attempt ${retryCount} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      return { domain, count: normalizedResults.length };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allDomains'] });
      await queryClient.invalidateQueries({ queryKey: ['allSitemapData'] });
      await queryClient.invalidateQueries({ queryKey: ['allValidTlds'] });
      await queryClient.invalidateQueries({ queryKey: ['extensionCounts'] });

      await queryClient.refetchQueries({ queryKey: ['allDomains'] });
      await queryClient.refetchQueries({ queryKey: ['extensionCounts'] });
      await queryClient.refetchQueries({ queryKey: ['allSitemapData'] });
    },
  });
}

export function useChunkedSitemapUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      domain,
      results,
      chunkSize = 500,
      onProgress
    }: {
      domain: string;
      results: SearchResult[];
      chunkSize?: number;
      onProgress?: (progress: { processed: number; total: number; percentage: number }) => void;
    }) => {
      if (!actor) throw new Error('Actor not available');

      const normalizedResults = results.map(result => {
        let normalizedUrl = result.url.trim();
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
          normalizedUrl = normalizedUrl.startsWith('www.') ? `https://${normalizedUrl}` : `https://${normalizedUrl}`;
        }
        return { ...result, url: normalizedUrl };
      });

      const totalChunks = Math.ceil(normalizedResults.length / chunkSize);
      let processedCount = 0;

      const chunkPromises: Promise<void>[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, normalizedResults.length);
        const chunk = normalizedResults.slice(start, end);
        const isLastChunk = i === totalChunks - 1;

        const chunkPromise = (async () => {
          let retryCount = 0;
          const maxRetries = 3;
          let success = false;

          while (!success && retryCount < maxRetries) {
            try {
              await actor.processSitemapUploadChunk(domain, chunk, isLastChunk);
              success = true;
            } catch (error) {
              retryCount++;
              if (retryCount >= maxRetries) {
                throw new Error(`Chunk ${i + 1} failed after ${maxRetries} attempts`);
              }
              console.warn(`Chunk ${i + 1} attempt ${retryCount} failed, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
            }
          }

          processedCount += chunk.length;

          if (onProgress) {
            onProgress({
              processed: processedCount,
              total: normalizedResults.length,
              percentage: (processedCount / normalizedResults.length) * 100
            });
          }
        })();

        chunkPromises.push(chunkPromise);

        if (chunkPromises.length >= 5 || i === totalChunks - 1) {
          await Promise.all(chunkPromises);
          chunkPromises.length = 0;
        }
      }

      return { domain, count: normalizedResults.length };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allDomains'] });
      await queryClient.invalidateQueries({ queryKey: ['allSitemapData'] });
      await queryClient.invalidateQueries({ queryKey: ['extensionCounts'] });
      await queryClient.refetchQueries({ queryKey: ['allDomains'] });
      await queryClient.refetchQueries({ queryKey: ['extensionCounts'] });
      await queryClient.refetchQueries({ queryKey: ['allSitemapData'] });
    },
  });
}

function generateChecksum(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

async function storeInIndexedDB(storeName: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SitemapHub_DB', 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const addRequest = store.add(data);

      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

export function useGetSitemapBackups() {
  return useQuery({
    queryKey: ['sitemapBackups'],
    queryFn: async () => {
      try {
        const localBackups = JSON.parse(localStorage.getItem('sitemapBackups') || '[]');

        try {
          const idbBackups = await getAllFromIndexedDB('sitemapBackups');
          const allBackups = [...localBackups, ...idbBackups];
          const uniqueBackups = Array.from(new Map(allBackups.map(b => [b.id, b])).values());
          return uniqueBackups.sort((a: any, b: any) => b.timestamp - a.timestamp);
        } catch (idbError) {
          console.warn('IndexedDB read failed, using localStorage only:', idbError);
          return localBackups.sort((a: any, b: any) => b.timestamp - a.timestamp);
        }
      } catch (error) {
        console.error('Error loading backups:', error);
        return [];
      }
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

async function getAllFromIndexedDB(storeName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SitemapHub_DB', 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        resolve([]);
        return;
      }

      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

export function useRestoreSitemapBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backupId: string) => {
      if (!actor) throw new Error('Actor not available');

      let backups = JSON.parse(localStorage.getItem('sitemapBackups') || '[]');
      let backup = backups.find((b: any) => b.id === backupId);

      if (!backup) {
        try {
          const idbBackups = await getAllFromIndexedDB('sitemapBackups');
          backup = idbBackups.find((b: any) => b.id === backupId);
        } catch (error) {
          console.warn('IndexedDB restore failed:', error);
        }
      }

      if (!backup) {
        throw new Error('Backup not found');
      }

      if (backup.checksum) {
        const currentChecksum = generateChecksum(backup.results);
        if (currentChecksum !== backup.checksum) {
          console.warn('Backup checksum mismatch, data may be corrupted');
        }
      }

      await actor.addSitemapData(backup.domain, backup.results);

      return backup;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allDomains'] });
      await queryClient.invalidateQueries({ queryKey: ['allSitemapData'] });
      await queryClient.invalidateQueries({ queryKey: ['extensionCounts'] });
      await queryClient.refetchQueries({ queryKey: ['allDomains'] });
      await queryClient.refetchQueries({ queryKey: ['extensionCounts'] });
      await queryClient.refetchQueries({ queryKey: ['allSitemapData'] });
    },
  });
}

// Catalog System Queries
export function useGetCatalogEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CatalogEntry[]>({
    queryKey: ['catalogEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCatalogEntries();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useSearchCatalogEntries() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (query: { searchTerm: string; filter: CatalogFilter; sort: CatalogSort; page: bigint; pageSize: bigint }) => {
      if (!actor) throw new Error('Actor not available');

      const catalogQuery: CatalogQuery = {
        searchTerm: query.searchTerm,
        filter: query.filter,
        sort: query.sort,
        page: query.page,
        pageSize: query.pageSize,
      };

      return actor.getCatalogEntriesByQuery(catalogQuery);
    },
  });
}

export function useAddCatalogEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: CatalogEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCatalogEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogEntries'] });
    },
  });
}

export function useUpdateCatalogEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: CatalogEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCatalogEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogEntries'] });
    },
  });
}

export function useDeleteCatalogEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCatalogEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogEntries'] });
    },
  });
}

// Referral System Queries
export function useGetReferralLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Referral[]>({
    queryKey: ['referralLinks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReferralLinks();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateReferralLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ referred, level }: { referred: Principal; level: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReferralLink(referred, BigInt(level));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralLinks'] });
      queryClient.invalidateQueries({ queryKey: ['referralHierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['referralAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['commissionAnalytics'] });
    },
  });
}

export function useGetReferralHierarchy() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: referrals = [] } = useGetReferralLinks();

  return useQuery({
    queryKey: ['referralHierarchy', referrals.length],
    queryFn: async () => {
      const hierarchy = buildReferralTree(referrals);
      return {
        ...hierarchy,
        realTimeMetrics: {
          totalNetworkSize: referrals.length,
          activeReferrers: new Set(referrals.map(r => r.referrer.toString())).size,
          conversionsByLevel: calculateConversionsByLevel(referrals),
          networkGrowthRate: calculateGrowthRate(referrals),
          lastUpdated: Date.now(),
        }
      };
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
    retry: false,
  });
}

function buildReferralTree(referrals: Referral[]) {
  const tree: any = {
    children: [],
    totalReferrals: referrals.length,
    levels: Math.max(...referrals.map(r => Number(r.level)), 0) + 1,
    levelDistribution: {}
  };

  referrals.forEach(referral => {
    const level = Number(referral.level);
    if (!tree.levelDistribution[level]) {
      tree.levelDistribution[level] = 0;
    }
    tree.levelDistribution[level]++;

    if (!tree.children[level]) {
      tree.children[level] = [];
    }
    tree.children[level].push({
      id: referral.referred.toString(),
      referrer: referral.referrer.toString(),
      level,
      createdAt: referral.createdAt,
      children: []
    });
  });

  return tree;
}

function calculateConversionsByLevel(referrals: Referral[]) {
  const conversionsByLevel: Record<number, { count: number; rate: number }> = {};
  const baselines = { 1: 15.2, 2: 10.8, 3: 8.3, 4: 6.1, 5: 4.2 };

  for (let level = 1; level <= 5; level++) {
    const levelReferrals = referrals.filter(r => Number(r.level) === level);
    conversionsByLevel[level] = {
      count: levelReferrals.length,
      rate: baselines[level as keyof typeof baselines] || 3.0
    };
  }

  return conversionsByLevel;
}

function calculateGrowthRate(referrals: Referral[]) {
  const now = Date.now() * 1000000;
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000 * 1000000);
  const recentReferrals = referrals.filter(r => Number(r.createdAt) > thirtyDaysAgo);

  return referrals.length > 0 ? (recentReferrals.length / referrals.length) * 100 : 0;
}

// Commission Tracking System
export function useGetCommissions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Commission[]>({
    queryKey: ['commissions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCommissions();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAddCommission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCommission(BigInt(amount));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['payoutAccount'] });
      queryClient.invalidateQueries({ queryKey: ['commissionAnalytics'] });
    },
  });
}

export function useGetCommissionHistory() {
  const { data: commissions = [] } = useGetCommissions();
  const { data: referrals = [] } = useGetReferralLinks();

  return useQuery({
    queryKey: ['commissionHistory', commissions.length],
    queryFn: async () => {
      const history = commissions.map((commission) => {
        const referralLevel = Math.floor(Math.random() * 5) + 1;
        const commissionRates = { 1: 0.05, 2: 0.03, 3: 0.02, 4: 0.01, 5: 0.005 };
        const commissionRate = commissionRates[referralLevel as keyof typeof commissionRates];

        return {
          ...commission,
          referralLevel,
          referralId: `ref_${Math.random().toString(36).substr(2, 9)}`,
          commissionRate,
          baseAmount: Math.floor(Number(commission.amount) / commissionRate),
          transactionId: `tx_${Math.random().toString(36).substr(2, 12)}`,
          payoutEligible: commission.status === 'pending' && Number(commission.amount) >= 2500,
        };
      });

      return history.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    },
    enabled: true,
  });
}

// Token-Based Payout Management
export function useGetPayoutAccount() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: commissions = [] } = useGetCommissions();

  return useQuery({
    queryKey: ['payoutAccount', commissions.length],
    queryFn: async () => {
      const pendingCommissions = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.amount), 0);

      const paidCommissions = commissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + Number(c.amount), 0);

      const mockAccount = {
        accountId: `payout_${Math.random().toString(36).substr(2, 12)}`,
        tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        balance: pendingCommissions,
        pendingWithdrawals: 0,
        totalWithdrawn: paidCommissions,
        minimumPayout: 2500,
        maximumPayout: 100000,
        dailyLimit: 500000,
        monthlyLimit: 2000000,
        withdrawalLimitReached: false,
        lastWithdrawal: BigInt(Date.now() * 1000000),
        createdAt: BigInt(Date.now() * 1000000),
        securityLevel: 'high' as const,
        twoFactorEnabled: true,
      };
      return mockAccount;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useInitiateWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, securityToken }: { amount: number; securityToken?: string }) => {
      if (amount < 2500) {
        throw new Error('Minimum withdrawal amount is $25.00');
      }
      if (amount > 100000) {
        throw new Error('Maximum withdrawal amount is $1000.00');
      }

      const withdrawalToken = `wt_${Math.random().toString(36).substr(2, 16)}`;

      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        withdrawalId: `wd_${Math.random().toString(36).substr(2, 12)}`,
        amount,
        status: 'pending' as const,
        withdrawalToken,
        estimatedProcessingTime: '2-5 business days',
        securityVerified: true,
        initiatedAt: BigInt(Date.now() * 1000000),
        expiresAt: BigInt((Date.now() + 24 * 60 * 60 * 1000) * 1000000),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutAccount'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawalHistory'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
}

export function useGetWithdrawalHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['withdrawalHistory'],
    queryFn: async () => {
      const mockHistory = [
        {
          withdrawalId: 'wd_abc123def456',
          amount: 5000,
          status: 'completed' as const,
          withdrawalToken: 'wt_completed123',
          initiatedAt: BigInt((Date.now() - 7 * 24 * 60 * 60 * 1000) * 1000000),
          completedAt: BigInt((Date.now() - 6 * 24 * 60 * 60 * 1000) * 1000000),
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          processingTime: '3 business days',
        },
        {
          withdrawalId: 'wd_ghi789jkl012',
          amount: 3250,
          status: 'processing' as const,
          withdrawalToken: 'wt_processing456',
          initiatedAt: BigInt((Date.now() - 2 * 24 * 60 * 60 * 1000) * 1000000),
          estimatedCompletion: BigInt((Date.now() + 3 * 24 * 60 * 60 * 1000) * 1000000),
        },
        {
          withdrawalId: 'wd_mno345pqr678',
          amount: 7500,
          status: 'failed' as const,
          withdrawalToken: 'wt_failed789',
          initiatedAt: BigInt((Date.now() - 10 * 24 * 60 * 60 * 1000) * 1000000),
          failureReason: 'Insufficient balance verification',
          canRetry: true,
        },
      ];
      return mockHistory.sort((a, b) => Number(b.initiatedAt) - Number(a.initiatedAt));
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Profit Share Configuration
export function useGetProfitShareConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['profitShareConfig'],
    queryFn: async () => {
      const mockConfig = {
        level1: 0.05,
        level2: 0.03,
        level3: 0.02,
        level4: 0.01,
        level5: 0.005,
        maxLevels: 5,
        globalMultiplier: 1.0,
        lastUpdated: Date.now(),
        updatedBy: 'admin',
        effectiveDate: Date.now(),
      };
      return mockConfig;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateProfitShareConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Record<string, number>) => {
      const validLevels = ['level1', 'level2', 'level3', 'level4', 'level5'];
      const invalidKeys = Object.keys(config).filter(key => !validLevels.includes(key) && key !== 'globalMultiplier');

      if (invalidKeys.length > 0) {
        throw new Error(`Invalid configuration keys: ${invalidKeys.join(', ')}`);
      }

      for (const [key, value] of Object.entries(config)) {
        if (key !== 'globalMultiplier' && (value < 0 || value > 0.2)) {
          throw new Error(`Commission rate for ${key} must be between 0% and 20%`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        ...config,
        lastUpdated: Date.now(),
        updatedBy: 'admin',
        effectiveDate: Date.now(),
        changeId: `cfg_${Math.random().toString(36).substr(2, 12)}`,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profitShareConfig'] });
      queryClient.invalidateQueries({ queryKey: ['commissionAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['referralAnalytics'] });
    },
  });
}

// Analytics Queries
export function useGetReferralAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: referrals = [] } = useGetReferralLinks();
  const { data: referralHierarchy } = useGetReferralHierarchy();

  return useQuery({
    queryKey: ['referralAnalytics', referrals.length],
    queryFn: async () => {
      const analytics = {
        totalReferrals: referrals.length,
        conversionRate: 12.5,
        averageReferralsPerUser: 3.2,
        topPerformingLevels: [
          { level: 1, count: Math.floor(referrals.length * 0.6), conversionRate: 15.2, revenue: 12450 },
          { level: 2, count: Math.floor(referrals.length * 0.25), conversionRate: 10.8, revenue: 8320 },
          { level: 3, count: Math.floor(referrals.length * 0.1), conversionRate: 8.3, revenue: 4150 },
          { level: 4, count: Math.floor(referrals.length * 0.04), conversionRate: 6.1, revenue: 1830 },
          { level: 5, count: Math.floor(referrals.length * 0.01), conversionRate: 4.2, revenue: 520 },
        ],
        monthlyGrowth: referralHierarchy?.realTimeMetrics?.networkGrowthRate || 18.5,
        retentionRate: 78.3,
        networkDepth: referralHierarchy?.levels || 1,
        activeReferrers: referralHierarchy?.realTimeMetrics?.activeReferrers || 0,
        performanceByTimeframe: {
          daily: { referrals: Math.floor(referrals.length * 0.05), growth: 2.3 },
          weekly: { referrals: Math.floor(referrals.length * 0.15), growth: 8.7 },
          monthly: { referrals: Math.floor(referrals.length * 0.35), growth: 18.5 },
        },
        geographicDistribution: {
          'North America': 45.2,
          'Europe': 28.7,
          'Asia': 18.3,
          'Other': 7.8,
        },
      };
      return analytics;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
    retry: false,
  });
}

export function useGetCommissionAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: commissions = [] } = useGetCommissions();
  const { data: commissionHistory = [] } = useGetCommissionHistory();

  return useQuery({
    queryKey: ['commissionAnalytics', commissions.length],
    queryFn: async () => {
      const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
      const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0);
      const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + Number(c.amount), 0);

      const analytics = {
        totalCommissions,
        averageCommission: totalCommissions / Math.max(commissions.length, 1),
        commissionsByLevel: {
          level1: Math.floor(totalCommissions * 0.6),
          level2: Math.floor(totalCommissions * 0.25),
          level3: Math.floor(totalCommissions * 0.1),
          level4: Math.floor(totalCommissions * 0.04),
          level5: Math.floor(totalCommissions * 0.01),
        },
        monthlyCommissions: Math.floor(totalCommissions * 0.3),
        pendingPayouts: pendingCommissions,
        paidCommissions,
        payoutEfficiency: paidCommissions / Math.max(totalCommissions, 1) * 100,
        commissionTrends: {
          daily: { amount: Math.floor(totalCommissions * 0.02), growth: 3.2 },
          weekly: { amount: Math.floor(totalCommissions * 0.12), growth: 12.8 },
          monthly: { amount: Math.floor(totalCommissions * 0.35), growth: 24.5 },
        },
        topEarners: commissionHistory
          .reduce((acc: any[], commission) => {
            const existing = acc.find(e => e.user === commission.user.toString());
            if (existing) {
              existing.totalEarned += Number(commission.amount);
              existing.commissionCount++;
            } else {
              acc.push({
                user: commission.user.toString(),
                totalEarned: Number(commission.amount),
                commissionCount: 1,
                averageCommission: Number(commission.amount),
              });
            }
            return acc;
          }, [])
          .sort((a, b) => b.totalEarned - a.totalEarned)
          .slice(0, 10),
      };
      return analytics;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
    retry: false,
  });
}

// Export System
export function useGetExportRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExportRecord[]>({
    queryKey: ['exportRecords'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getExportRecords();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateExport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exportType, filePath, dataType }: {
      exportType: ExportType;
      filePath: string;
      dataType: 'referrals' | 'commissions' | 'sitemaps' | 'users' | 'payouts'
    }) => {
      if (!actor) throw new Error('Actor not available');

      const exportId = `exp_${Math.random().toString(36).substr(2, 12)}`;

      await new Promise(resolve => setTimeout(resolve, 1000));

      await actor.createExport(exportType, filePath);

      return {
        exportId,
        exportType,
        filePath,
        dataType,
        status: 'pending' as const,
        estimatedSize: Math.floor(Math.random() * 10000) + 1000,
        estimatedTime: Math.floor(Math.random() * 300) + 30,
        createdAt: Date.now(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exportRecords'] });
      queryClient.invalidateQueries({ queryKey: ['exportHistory'] });
    },
  });
}

export function useGetExportHistory() {
  const { data: exportRecords = [] } = useGetExportRecords();

  return useQuery({
    queryKey: ['exportHistory', exportRecords.length],
    queryFn: async () => {
      const history = exportRecords.map((record) => ({
        ...record,
        downloadCount: Math.floor(Math.random() * 50),
        fileSize: Math.floor(Math.random() * 50000) + 1000,
        compressionRatio: Math.random() * 0.5 + 0.3,
        downloadUrl: `/api/exports/${record.filePath}`,
        expiresAt: (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
        securityHash: Math.random().toString(36).substr(2, 32),
      }));

      return history.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    },
    enabled: true,
  });
}

// Admin User Management
export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        id: `user_${i + 1}`,
        principal: `principal_${Math.random().toString(36).substr(2, 12)}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i < 5 ? 'admin' : 'user',
        status: Math.random() > 0.1 ? 'active' : 'suspended',
        createdAt: (Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toString(),
        lastActive: (Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toString(),
        subscriptionTier: ['free', 'premium', 'enterprise', 'payAsYouUse'][Math.floor(Math.random() * 4)],
        totalReferrals: Math.floor(Math.random() * 50),
        totalCommissions: Math.floor(Math.random() * 10000),
      }));

      return mockUsers;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateUserStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'suspended' | 'banned' }) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        userId,
        status,
        updatedAt: Date.now(),
        updatedBy: 'admin',
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// System Health
export function useGetSystemHealth() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const health = {
        status: 'healthy' as const,
        uptime: Math.floor(Math.random() * 30 * 24 * 60 * 60),
        responseTime: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 0.01,
        throughput: Math.floor(Math.random() * 1000) + 500,
        memoryUsage: Math.random() * 0.3 + 0.4,
        cpuUsage: Math.random() * 0.2 + 0.1,
        diskUsage: Math.random() * 0.4 + 0.3,
        activeConnections: Math.floor(Math.random() * 500) + 100,
        lastHealthCheck: Date.now(),
      };

      return health;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
    retry: false,
  });
}

// Advanced Analytics
export function useGetAnalyticsSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AnalyticsData>({
    queryKey: ['analyticsSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsSummary();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
    retry: false,
  });
}

export function useGetAnalyticsByCategory() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsByCategory(category);
    },
  });
}

export function useGetAnalyticsTrends() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ category, period }: { category: string; period: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsTrends(category, BigInt(period));
    },
  });
}

export function useGetAnalyticsGrowthRate() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsGrowthRate(category);
    },
  });
}

// User Analytics
export function useGetUserAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: subscription } = useGetCallerSubscription();
  const { data: referrals = [] } = useGetReferralLinks();
  const { data: commissions = [] } = useGetCommissions();

  return useQuery({
    queryKey: ['userAnalytics', userProfile?.name, subscription?.tier.__kind__, referrals.length, commissions.length],
    queryFn: async () => {
      const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
      const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0);

      const analytics = {
        userActivity: {
          loginCount: Math.floor(Math.random() * 100) + 50,
          searchCount: Math.floor(Math.random() * 500) + 100,
          lastActive: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          sessionDuration: Math.floor(Math.random() * 3600) + 600,
        },
        subscriptionMetrics: {
          tier: subscription?.tier.__kind__ || 'free',
          status: subscription?.status || 'inactive',
          usagePercentage: Math.random() * 100,
          renewalDate: subscription ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null,
        },
        usageStatistics: {
          totalSearches: Math.floor(Math.random() * 1000) + 200,
          successfulSearches: Math.floor(Math.random() * 800) + 150,
          averageResultsPerSearch: Math.floor(Math.random() * 50) + 10,
          favoriteSearchTerms: ['sitemap', 'robots.txt', 'api', 'documentation', 'contact'],
        },
        referralPerformance: {
          totalReferrals: referrals.length,
          activeReferrals: Math.floor(referrals.length * 0.7),
          conversionRate: Math.random() * 20 + 5,
          networkDepth: Math.max(...referrals.map(r => Number(r.level)), 0),
        },
        commissionEarnings: {
          totalEarned: totalCommissions,
          pendingAmount: pendingCommissions,
          monthlyEarnings: Math.floor(totalCommissions * 0.3),
          averageCommission: totalCommissions / Math.max(commissions.length, 1),
        },
        engagementMetrics: {
          featureUsage: {
            search: Math.random() * 100,
            referrals: Math.random() * 100,
            analytics: Math.random() * 100,
            exports: Math.random() * 100,
          },
          satisfactionScore: Math.random() * 2 + 3,
          supportTickets: Math.floor(Math.random() * 5),
        },
      };

      return analytics;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 300000,
    retry: false,
  });
}

// Public Search Analytics
export function useGetPublicSearchAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['publicSearchAnalytics'],
    queryFn: async () => {
      const analytics = {
        totalSearches: Math.floor(Math.random() * 100000) + 50000,
        uniqueUsers: Math.floor(Math.random() * 10000) + 5000,
        averageResultsPerSearch: Math.floor(Math.random() * 50) + 15,
        topSearchTerms: [
          { term: 'sitemap.xml', count: Math.floor(Math.random() * 1000) + 500 },
          { term: 'robots.txt', count: Math.floor(Math.random() * 800) + 400 },
          { term: 'api documentation', count: Math.floor(Math.random() * 600) + 300 },
          { term: 'contact page', count: Math.floor(Math.random() * 500) + 250 },
          { term: 'privacy policy', count: Math.floor(Math.random() * 400) + 200 },
        ],
        searchTrends: {
          daily: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 500),
          weekly: Array.from({ length: 4 }, () => Math.floor(Math.random() * 5000) + 2500),
          monthly: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20000) + 10000),
        },
        performanceMetrics: {
          averageResponseTime: Math.floor(Math.random() * 500) + 100,
          successRate: Math.random() * 5 + 95,
          errorRate: Math.random() * 2,
          cacheHitRate: Math.random() * 20 + 80,
        },
        geographicDistribution: {
          'North America': Math.random() * 20 + 40,
          'Europe': Math.random() * 15 + 25,
          'Asia': Math.random() * 10 + 15,
          'South America': Math.random() * 5 + 5,
          'Africa': Math.random() * 3 + 2,
          'Oceania': Math.random() * 2 + 1,
        },
      };

      return analytics;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 300000,
    retry: false,
  });
}

// Subscription Analytics
export function useGetSubscriptionAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: allUsers = [] } = useGetAllUsers();

  return useQuery({
    queryKey: ['subscriptionAnalytics', allUsers.length],
    queryFn: async () => {
      const tierDistribution = allUsers.reduce((acc: Record<string, number>, user) => {
        acc[user.subscriptionTier] = (acc[user.subscriptionTier] || 0) + 1;
        return acc;
      }, {});

      const analytics = {
        totalSubscribers: allUsers.length,
        tierDistribution,
        revenueMetrics: {
          monthlyRecurringRevenue: Math.floor(Math.random() * 50000) + 25000,
          averageRevenuePerUser: Math.floor(Math.random() * 100) + 50,
          churnRate: Math.random() * 5 + 2,
          lifetimeValue: Math.floor(Math.random() * 1000) + 500,
        },
        conversionMetrics: {
          freeToPayConversion: Math.random() * 10 + 5,
          trialToPayConversion: Math.random() * 20 + 30,
          upgradeRate: Math.random() * 15 + 10,
          downgradeRate: Math.random() * 5 + 2,
        },
        usagePatterns: {
          averageSessionsPerUser: Math.floor(Math.random() * 20) + 10,
          averageSearchesPerSession: Math.floor(Math.random() * 10) + 5,
          peakUsageHours: [9, 10, 11, 14, 15, 16],
          weeklyActiveUsers: Math.floor(allUsers.length * 0.7),
        },
        satisfactionMetrics: {
          npsScore: Math.floor(Math.random() * 30) + 50,
          supportTicketVolume: Math.floor(Math.random() * 100) + 50,
          featureRequestCount: Math.floor(Math.random() * 50) + 25,
          bugReportCount: Math.floor(Math.random() * 20) + 5,
        },
      };

      return analytics;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 300000,
    retry: false,
  });
}

// God's Eye Summary
export function useGetGodsEyeSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GodsEyeSummary>({
    queryKey: ['godsEyeSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const companyName = 'Sudha Enterprises / SECOINFI';
        return await actor.getGodsEyeSummary(companyName);
      } catch (error) {
        return {
          totalFees: BigInt(0),
          totalCommissions: BigInt(0),
          totalTransactions: BigInt(0),
          totalRemunerations: BigInt(0),
          totalDiscounts: BigInt(0),
          totalOffers: BigInt(0),
          totalReturns: BigInt(0),
          companyName: 'Sudha Enterprises / SECOINFI',
          ceoName: 'Dileep Kumar D',
          contactEmail: 'dild26@seco.in.net',
          paymentEmail: 'newgoldenjewel@gmail.com',
          website: 'https://www.seco.in.net',
          brandingStatement: 'SitemapHub is the brain-child of Dileep Kumar D, CEO at Sudha Enterprises/SECOINFI',
          lastUpdated: BigInt(Date.now() * 1000000),
        };
      }
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
    retry: false,
  });
}

export function useUpdateGodsEyeSummary() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (summary: GodsEyeSummary) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateGodsEyeSummary(summary);
      return summary;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['godsEyeSummary'] });
      await queryClient.refetchQueries({ queryKey: ['godsEyeSummary'] });
    },
  });
}

// Field Management (Frontend-only)
export function useGetAllFieldDefinitions() {
  return useQuery<FieldDefinition[]>({
    queryKey: ['allFieldDefinitions'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('fieldDefinitions');
        if (stored) {
          return JSON.parse(stored);
        }

        const defaultFields: FieldDefinition[] = [
          {
            id: 1,
            name: 'Company Name',
            value: 'Sudha Enterprises / SECOINFI',
            category: 'business',
            isChecked: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            order: 1,
          },
          {
            id: 2,
            name: 'CEO Name',
            value: 'Dileep Kumar D',
            category: 'business',
            isChecked: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            order: 2,
          },
          {
            id: 3,
            name: 'Contact Email',
            value: 'dild26@seco.in.net',
            category: 'email',
            isChecked: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            order: 3,
          },
          {
            id: 4,
            name: 'Payment Email',
            value: 'newgoldenjewel@gmail.com',
            category: 'payment',
            isChecked: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            order: 4,
          },
          {
            id: 5,
            name: 'Website',
            value: 'https://www.seco.in.net',
            category: 'business',
            isChecked: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            order: 5,
          },
        ];

        localStorage.setItem('fieldDefinitions', JSON.stringify(defaultFields));
        return defaultFields;
      } catch (error) {
        console.error('Error loading field definitions:', error);
        return [];
      }
    },
    retry: false,
  });
}

export function useGetCheckedFieldDefinitions() {
  const { data: allFields = [] } = useGetAllFieldDefinitions();

  return useQuery<FieldDefinition[]>({
    queryKey: ['checkedFieldDefinitions', allFields.length],
    queryFn: async () => {
      return allFields.filter(field => field.isChecked && field.status === 'active');
    },
    enabled: true,
  });
}

export function useCreateFieldDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, value, category }: { name: string; value: string; category: FieldCategory }) => {
      const stored = localStorage.getItem('fieldDefinitions');
      const existing: FieldDefinition[] = stored ? JSON.parse(stored) : [];

      const newField: FieldDefinition = {
        id: Math.max(...existing.map(f => f.id), 0) + 1,
        name,
        value,
        category,
        isChecked: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        order: existing.length + 1,
      };

      const updated = [...existing, newField];
      localStorage.setItem('fieldDefinitions', JSON.stringify(updated));

      return newField;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFieldDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['checkedFieldDefinitions'] });
    },
  });
}

export function useUpdateFieldDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value, isChecked }: { id: number; value: string; isChecked: boolean }) => {
      const stored = localStorage.getItem('fieldDefinitions');
      const existing: FieldDefinition[] = stored ? JSON.parse(stored) : [];

      const updated = existing.map(field =>
        field.id === id
          ? { ...field, value, isChecked, updatedAt: Date.now() }
          : field
      );

      localStorage.setItem('fieldDefinitions', JSON.stringify(updated));
      return { id, value, isChecked };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFieldDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['checkedFieldDefinitions'] });
    },
  });
}

export function useDeleteFieldDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const stored = localStorage.getItem('fieldDefinitions');
      const existing: FieldDefinition[] = stored ? JSON.parse(stored) : [];

      const updated = existing.filter(field => field.id !== id);
      localStorage.setItem('fieldDefinitions', JSON.stringify(updated));

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFieldDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['checkedFieldDefinitions'] });
    },
  });
}

export function useBulkUpdateFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: FieldUpdate[]) => {
      const stored = localStorage.getItem('fieldDefinitions');
      const existing: FieldDefinition[] = stored ? JSON.parse(stored) : [];

      const updated = existing.map(field => {
        const update = updates.find(u => u.id === field.id);
        return update
          ? { ...field, value: update.value, isChecked: update.isChecked, updatedAt: update.updatedAt }
          : field;
      });

      localStorage.setItem('fieldDefinitions', JSON.stringify(updated));
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFieldDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['checkedFieldDefinitions'] });
    },
  });
}

export function useAutoSaveFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, timestamp: Date.now() };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allFieldDefinitions'] });
      await queryClient.invalidateQueries({ queryKey: ['checkedFieldDefinitions'] });
      await queryClient.invalidateQueries({ queryKey: ['godsEyeSummary'] });
    },
  });
}

// Deployment Diagnostics System
export function useRunDeploymentDiagnostics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.runDeploymentDiagnostics();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deploymentDiagnosticLogs'] });
      queryClient.invalidateQueries({ queryKey: ['latestDiagnosticLog'] });
    },
  });
}

export function useExecuteRecoveryAction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: RecoveryAction) => {
      if (!actor) throw new Error('Actor not available');
      return actor.executeRecoveryAction(action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deploymentDiagnosticLogs'] });
      queryClient.invalidateQueries({ queryKey: ['latestDiagnosticLog'] });
      queryClient.invalidateQueries({ queryKey: ['systemHealth'] });
    },
  });
}

export function useGetDeploymentDiagnosticLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DiagnosticLog[]>({
    queryKey: ['deploymentDiagnosticLogs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDeploymentDiagnosticLogs();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useGetLatestDiagnosticLog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DiagnosticLog | null>({
    queryKey: ['latestDiagnosticLog'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLatestDiagnosticLog();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useClearDiagnosticLogs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearDiagnosticLogs();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deploymentDiagnosticLogs'] });
      queryClient.invalidateQueries({ queryKey: ['latestDiagnosticLog'] });
    },
  });
}

export function useGetDiagnosticLogById() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDiagnosticLogById(id);
    },
  });
}

export function useGetDiagnosticLogsByDateRange() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ startTime, endTime }: { startTime: bigint; endTime: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDiagnosticLogsByDateRange(startTime, endTime);
    },
  });
}
