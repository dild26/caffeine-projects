import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  App,
  CompareMatrix,
  Leaderboards,
  OverviewCards,
  Sitemap,
  Versions,
  Migrations,
  UpdatePayload,
  Comparison,
  Feature,
  Ranking,
  OverviewCard,
  SitemapSection,
  VersionEntry,
  MigrationEntry,
} from '../backend';
import { loadSpec, getDataSource, type SecoinfiApp } from '@/lib/fallbackData';

// State to track data source
let currentDataSource: 'backend' | 'yaml' | 'json' | 'default' = 'yaml';

export function getCurrentDataSource(): 'backend' | 'yaml' | 'json' | 'default' {
  return currentDataSource;
}

// Query hook for Secoinfi apps
export function useGetSecoinfiApps() {
  return useQuery<SecoinfiApp[]>({
    queryKey: ['secoinfi-apps'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching Secoinfi apps...');
        const specData = await loadSpec();
        currentDataSource = getDataSource();
        
        const apps = specData.secoinfiApps || [];
        console.log(`✅ Loaded ${apps.length} Secoinfi apps from ${currentDataSource}`);
        
        return apps;
      } catch (error) {
        console.error('❌ Error loading Secoinfi apps:', error);
        // Return empty array instead of throwing to prevent blank page
        return [];
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Query hooks for fetching data - always try spec files first
export function useGetApps(filterArchived: boolean = false) {
  const { actor } = useActor();

  return useQuery<App[]>({
    queryKey: ['apps', filterArchived],
    queryFn: async () => {
      // Always try to load from spec files first
      try {
        console.log('🔍 Fetching apps...');
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        const apps = (specData.appsRegistry || []).map((app) => ({
          ...app,
          rank: typeof app.rank === 'bigint' ? app.rank : BigInt(app.rank || 0),
        }));

        const filteredApps = apps.filter((app) => (app.archived ? filterArchived : true));
        console.log(`✅ Loaded ${filteredApps.length} apps from ${currentDataSource}`);
        
        return filteredApps;
      } catch (error) {
        console.error('❌ Error loading from spec files:', error);

        // Fallback to backend if spec files fail
        if (actor) {
          try {
            console.log('🔄 Attempting to load from backend...');
            const apps = await actor.getApps(filterArchived);
            currentDataSource = 'backend';
            console.log(`✅ Loaded ${apps.length} apps from backend`);
            return apps;
          } catch (backendError) {
            console.error('❌ Error fetching from backend:', backendError);
          }
        }

        // Return empty array as last resort to prevent blank page
        console.warn('⚠️ Returning empty array as fallback');
        return [];
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetApp(appId: string | null) {
  const { actor } = useActor();

  return useQuery<App | null>({
    queryKey: ['app', appId],
    queryFn: async () => {
      if (!appId) return null;

      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        const app = (specData.appsRegistry || []).find((a) => a.id === appId);
        if (app) {
          return {
            ...app,
            rank: typeof app.rank === 'bigint' ? app.rank : BigInt(app.rank || 0),
          };
        }
      } catch (error) {
        console.error('Error loading app from spec files:', error);
      }

      // Fallback to backend
      if (actor) {
        try {
          const app = await actor.getApp(appId);
          currentDataSource = 'backend';
          return app;
        } catch (backendError) {
          console.error('Error fetching app from backend:', backendError);
        }
      }

      return null;
    },
    enabled: !!appId,
    staleTime: 30000,
    retry: 2,
  });
}

export function useGetCompareMatrix() {
  const { actor } = useActor();

  return useQuery<CompareMatrix>({
    queryKey: ['compare-matrix'],
    queryFn: async () => {
      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        // Handle empty or missing features/comparisons
        const features = specData.features || [];
        const appsRegistry = specData.appsRegistry || [];

        // Generate comparisons from features if available
        const comparisons: any[] = [];
        appsRegistry.forEach((app) => {
          features.forEach((feature: any) => {
            comparisons.push({
              appId: app.id,
              featureId: feature.id || feature,
              supported: app.features?.includes(feature.id || feature) || false,
            });
          });
        });

        return { comparisons };
      } catch (error) {
        console.error('Error loading compare matrix from spec files:', error);

        if (actor) {
          try {
            const matrix = await actor.getCompareMatrix();
            currentDataSource = 'backend';
            return matrix;
          } catch (backendError) {
            console.error('Error fetching compare matrix from backend:', backendError);
          }
        }

        return { comparisons: [] };
      }
    },
    staleTime: 30000,
    retry: 2,
  });
}

export function useGetLeaderboard() {
  const { actor } = useActor();

  return useQuery<Leaderboards>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        // Generate leaderboard from apps if not explicitly defined
        const rankings =
          specData.leaderboards?.rankings && specData.leaderboards.rankings.length > 0
            ? specData.leaderboards.rankings
            : (specData.appsRegistry || []).map((app) => ({
                appId: app.id,
                rank: typeof app.rank === 'bigint' ? app.rank : BigInt(app.rank || 0),
                score: typeof app.rank === 'bigint' ? app.rank : BigInt(app.rank || 0),
              }));

        return { rankings };
      } catch (error) {
        console.error('Error loading leaderboard from spec files:', error);

        if (actor) {
          try {
            const leaderboard = await actor.getLeaderboard();
            currentDataSource = 'backend';
            return leaderboard;
          } catch (backendError) {
            console.error('Error fetching leaderboard from backend:', backendError);
          }
        }

        return { rankings: [] };
      }
    },
    staleTime: 30000,
    retry: 2,
  });
}

export function useGetOverviewCards() {
  const { actor } = useActor();

  return useQuery<OverviewCards>({
    queryKey: ['overview-cards'],
    queryFn: async () => {
      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        // Generate overview cards from top apps if not explicitly defined
        const cards =
          specData.overviewCards?.cards && specData.overviewCards.cards.length > 0
            ? specData.overviewCards.cards
            : (specData.appsRegistry || []).slice(0, 6).map((app) => ({
                id: app.id,
                title: app.name,
                summary: app.description,
                rank: typeof app.rank === 'bigint' ? app.rank : BigInt(app.rank || 0),
              }));

        return { cards };
      } catch (error) {
        console.error('Error loading overview cards from spec files:', error);

        if (actor) {
          try {
            const cards = await actor.getOverviewCards();
            currentDataSource = 'backend';
            return cards;
          } catch (backendError) {
            console.error('Error fetching overview cards from backend:', backendError);
          }
        }

        return { cards: [] };
      }
    },
    staleTime: 30000,
    retry: 2,
  });
}

export function useGetSitemap() {
  const { actor } = useActor();

  return useQuery<Sitemap>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        return {
          sections: specData.sitemap?.sections || [],
        };
      } catch (error) {
        console.error('Error loading sitemap from spec files:', error);

        if (actor) {
          try {
            const sitemap = await actor.getSitemap();
            currentDataSource = 'backend';
            return sitemap;
          } catch (backendError) {
            console.error('Error fetching sitemap from backend:', backendError);
          }
        }

        return { sections: [] };
      }
    },
    staleTime: 30000,
    retry: 2,
  });
}

export function useGetVersions() {
  const { actor } = useActor();

  return useQuery<Versions>({
    queryKey: ['versions'],
    queryFn: async () => {
      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        return {
          versionHistory: specData.versions?.versionHistory || [],
        };
      } catch (error) {
        console.error('Error loading versions from spec files:', error);

        if (actor) {
          try {
            const versions = await actor.getSpecVersions();
            currentDataSource = 'backend';
            return versions;
          } catch (backendError) {
            console.error('Error fetching versions from backend:', backendError);
          }
        }

        return { versionHistory: [] };
      }
    },
    staleTime: 30000,
    retry: 2,
  });
}

export function useGetMigrations() {
  const { actor } = useActor();

  return useQuery<Migrations>({
    queryKey: ['migrations'],
    queryFn: async () => {
      try {
        const specData = await loadSpec();
        currentDataSource = getDataSource();

        return {
          migrationHistory: specData.migrations?.migrationHistory || [],
        };
      } catch (error) {
        console.error('Error loading migrations from spec files:', error);

        if (actor) {
          try {
            const migrations = await actor.getMigrations();
            currentDataSource = 'backend';
            return migrations;
          } catch (backendError) {
            console.error('Error fetching migrations from backend:', backendError);
          }
        }

        return { migrationHistory: [] };
      }
    },
    staleTime: 30000,
    retry: 2,
  });
}

// Mutation hooks for updating data
export function useInitialize() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.init();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useUpdateApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePayload) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateApp(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['app'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['overview-cards'] });
    },
  });
}

export function useApplyDiffUpdates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (diffs: UpdatePayload[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.applyDiffUpdates(diffs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['app'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['overview-cards'] });
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    },
  });
}

export function useUpdateCompareMatrix() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Comparison[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateCompareMatrix(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compare-matrix'] });
    },
  });
}

export function useUpdateFeatures() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Feature[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateFeatures(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compare-matrix'] });
    },
  });
}

export function useUpdateLeaderboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Ranking[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateLeaderboard(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

export function useUpdateOverviewCards() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: OverviewCard[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateOverviewCards(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overview-cards'] });
    },
  });
}

export function useUpdateSitemap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SitemapSection[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSitemap(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

export function useUpdateSpecVersions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: VersionEntry[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSpecVersions(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    },
  });
}

export function useUpdateMigrations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MigrationEntry[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateMigrations(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['migrations'] });
    },
  });
}
