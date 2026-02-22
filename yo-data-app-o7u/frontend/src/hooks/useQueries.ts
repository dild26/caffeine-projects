import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Dataset, Project, UserProfile, NavigationPage, ContactInfo, ContactInfoVersion, SitemapEntry, SitemapPage, ArchiveCollection, ArchiveContent, FeatureProgress, Blob } from '../backend';

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

// Dataset Queries
export function useGetUserDatasets() {
  const { actor, isFetching } = useActor();

  return useQuery<Dataset[]>({
    queryKey: ['userDatasets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserDatasets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDataset(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Dataset | null>({
    queryKey: ['dataset', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getDataset(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetPublicDatasetByCID(cid: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Dataset | null>({
    queryKey: ['publicDataset', cid],
    queryFn: async () => {
      if (!actor || !cid) return null;
      return actor.getPublicDatasetByCID(cid);
    },
    enabled: !!actor && !isFetching && !!cid,
    retry: false,
  });
}

export function useCreateDataset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      format,
      schema,
      blob,
      isPublic,
    }: {
      name: string;
      format: string;
      schema: string;
      blob: Blob;
      isPublic: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDataset(name, format, schema, blob, isPublic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDatasets'] });
    },
  });
}

export function useUpdateDataset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      schema,
      isPublic,
    }: {
      id: string;
      name: string;
      schema: string;
      isPublic: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDataset(id, name, schema, isPublic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDatasets'] });
      queryClient.invalidateQueries({ queryKey: ['dataset'] });
    },
  });
}

// Project Queries
export function useGetUserProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['userProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDatasetsSorted() {
  const { actor, isFetching } = useActor();

  return useQuery<Dataset[]>({
    queryKey: ['allDatasetsSorted'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDatasetsSorted();
    },
    enabled: !!actor && !isFetching,
  });
}

// Navigation Pages Queries
export function useGetNavigationPages() {
  const { actor, isFetching } = useActor();

  return useQuery<NavigationPage[]>({
    queryKey: ['navigationPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNavigationPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNavigationPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ route, title, metadata }: { route: string; title: string; metadata: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNavigationPage(route, title, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapEntries'] });
    },
  });
}

export function useUpdateNavigationPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, route, title, metadata }: { id: string; route: string; title: string; metadata: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNavigationPage(id, route, title, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapEntries'] });
    },
  });
}

export function useDeleteNavigationPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNavigationPage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapEntries'] });
    },
  });
}

// Contact Information Queries
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getContactInfo();
      } catch (error) {
        console.error('[useGetContactInfo] Backend query error:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: ContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
      queryClient.invalidateQueries({ queryKey: ['contactInfoHistory'] });
    },
  });
}

export function useGetContactInfoHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfoVersion[]>({
    queryKey: ['contactInfoHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactInfoHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// Sitemap Queries
export function useGetAllSitemapEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemapEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSitemapEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

// Sitemap Pages (Markdown Content) Queries
export function useGetSitemapPages() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapPage[]>({
    queryKey: ['sitemapPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSitemapPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSitemapPage(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapPage | null>({
    queryKey: ['sitemapPage', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getSitemapPage(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateSitemapPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      route,
      title,
      metadata,
      navOrder,
      visibility,
      content,
    }: {
      route: string;
      title: string;
      metadata: string;
      navOrder: bigint;
      visibility: boolean;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSitemapPage(route, title, metadata, navOrder, visibility, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapPage'] });
    },
  });
}

export function useUpdateSitemapPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      route,
      title,
      metadata,
      navOrder,
      visibility,
      content,
    }: {
      id: string;
      route: string;
      title: string;
      metadata: string;
      navOrder: bigint;
      visibility: boolean;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSitemapPage(id, route, title, metadata, navOrder, visibility, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapPage'] });
    },
  });
}

export function useDeleteSitemapPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSitemapPage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapPage'] });
    },
  });
}

// Archive Collections Queries
export function useGetArchiveCollections() {
  const { actor, isFetching } = useActor();

  return useQuery<ArchiveCollection[], Error>({
    queryKey: ['archiveCollections'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetArchiveCollections] Fetching archive collections from backend...');
      try {
        const collections = await actor.getArchiveCollections();
        console.log('[useGetArchiveCollections] Successfully fetched collections:', collections.length);
        
        // Log parse errors if any exist
        collections.forEach((collection) => {
          if (collection.fileParseErrors && collection.fileParseErrors.length > 0) {
            console.warn(`[useGetArchiveCollections] Parse errors in collection "${collection.name}":`, collection.fileParseErrors);
          }
        });
        
        return collections;
      } catch (error) {
        console.error('[useGetArchiveCollections] Failed to fetch collections:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useGetArchiveCollection(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ArchiveCollection | null>({
    queryKey: ['archiveCollection', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getArchiveCollection(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateArchiveCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      zipFileName,
      pages,
      fileParseErrors = [],
    }: {
      name: string;
      zipFileName: string;
      pages: ArchiveContent[];
      fileParseErrors?: Array<[string, string]>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useCreateArchiveCollection] Creating collection:', name);
      return actor.createArchiveCollection(name, zipFileName, pages, fileParseErrors);
    },
    onSuccess: (data) => {
      console.log('[useCreateArchiveCollection] Successfully created collection:', data.name);
      queryClient.invalidateQueries({ queryKey: ['archiveCollections'] });
    },
    onError: (error) => {
      console.error('[useCreateArchiveCollection] Failed to create collection:', error);
    },
  });
}

export function useUpdateArchiveCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      zipFileName,
      pages,
      fileParseErrors = [],
    }: {
      id: string;
      name: string;
      zipFileName: string;
      pages: ArchiveContent[];
      fileParseErrors?: Array<[string, string]>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArchiveCollection(id, name, zipFileName, pages, fileParseErrors);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveCollections'] });
      queryClient.invalidateQueries({ queryKey: ['archiveCollection'] });
    },
  });
}

export function useDeleteArchiveCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteArchiveCollection(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveCollections'] });
    },
  });
}

// Feature Progress Queries
export function useGetAllFeatures() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureProgress[]>({
    queryKey: ['allFeatures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeatures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicFeatures() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureProgress[]>({
    queryKey: ['publicFeatures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicFeatures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeatureById(featureId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureProgress | null>({
    queryKey: ['feature', featureId],
    queryFn: async () => {
      if (!actor || !featureId) return null;
      return actor.getFeatureById(featureId);
    },
    enabled: !!actor && !isFetching && !!featureId,
  });
}

export function useUpdateFeatureStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      featureId,
      validationStatus,
      completion,
    }: {
      featureId: string;
      validationStatus: boolean | null;
      completion: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeatureStatus(featureId, validationStatus, completion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['publicFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['feature'] });
    },
  });
}

export function useUpdateMultipleFeatureStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (statuses: Array<[string, boolean | null, bigint | null]>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMultipleFeatureStatus(statuses);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['publicFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['feature'] });
    },
  });
}
