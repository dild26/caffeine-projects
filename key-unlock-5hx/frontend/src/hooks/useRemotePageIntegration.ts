import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Local type definitions for types not yet in backend interface
export interface ContactInfo {
  ceoName: string;
  email: string;
  phone: string;
  whatsapp: string;
  businessAddress: string;
  paypal: string;
  upi: string;
  eth: string;
  socialMedia: {
    facebook: string;
    linkedin: string;
    telegram: string;
    discord: string;
    blogspot: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export interface AppManagementEntry {
  id: bigint;
  subdomain: string;
  url: string;
  name: string;
  description: string;
  status: string;
  progressPercentage: bigint;
  lastUpdated: bigint;
  createdBy: string;
}

export interface RemotePageData {
  id: bigint;
  subdomain: string;
  url: string;
  contactInfo: ContactInfo | null;
  fetchedAt: bigint;
  status: string;
  error: string | null;
}

export interface ComparisonAnalysis {
  id: bigint;
  appId: bigint;
  features: string[];
  functionalities: string[];
  accuracyScore: bigint;
  comparisonData: string;
  analyzedAt: bigint;
}

export function useGetAllAppManagementEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppManagementEntry[]>({
    queryKey: ['appManagementEntries'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented
      console.warn('Backend getAllAppManagementEntries method not yet implemented');
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAppManagementEntry(entryId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppManagementEntry | null>({
    queryKey: ['appManagementEntry', entryId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not yet implemented
      console.warn('Backend getAppManagementEntry method not yet implemented');
      return null;
    },
    enabled: !!actor && !actorFetching && entryId > 0n,
  });
}

export function useCreateAppManagementEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<AppManagementEntry, 'id' | 'lastUpdated' | 'createdBy'>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend createAppManagementEntry method not yet implemented');
      return BigInt(Date.now());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appManagementEntries'] });
    },
  });
}

export function useUpdateAppManagementEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppManagementEntry) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend updateAppManagementEntry method not yet implemented');
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appManagementEntries'] });
      queryClient.invalidateQueries({ queryKey: ['appManagementEntry', variables.id.toString()] });
    },
  });
}

export function useDeleteAppManagementEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend deleteAppManagementEntry method not yet implemented');
      return entryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appManagementEntries'] });
    },
  });
}

export function useGetAllRemotePageData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RemotePageData[]>({
    queryKey: ['remotePageData'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented
      console.warn('Backend getAllRemotePageData method not yet implemented');
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRemotePageData(dataId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RemotePageData | null>({
    queryKey: ['remotePageDataItem', dataId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not yet implemented
      console.warn('Backend getRemotePageData method not yet implemented');
      return null;
    },
    enabled: !!actor && !actorFetching && dataId > 0n,
  });
}

export function useFetchRemotePageData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { subdomain: string; url: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented - simulate fetch
      console.warn('Backend storeRemotePageData method not yet implemented');
      
      // Simulate fetching remote data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: BigInt(Date.now()),
        subdomain: data.subdomain,
        url: data.url,
        contactInfo: null,
        fetchedAt: BigInt(Date.now()),
        status: 'success',
        error: null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remotePageData'] });
    },
  });
}

export function useGetAllComparisonAnalyses() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ComparisonAnalysis[]>({
    queryKey: ['comparisonAnalyses'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented
      console.warn('Backend getAllComparisonAnalyses method not yet implemented');
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetComparisonAnalysis(analysisId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ComparisonAnalysis | null>({
    queryKey: ['comparisonAnalysis', analysisId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not yet implemented
      console.warn('Backend getComparisonAnalysis method not yet implemented');
      return null;
    },
    enabled: !!actor && !actorFetching && analysisId > 0n,
  });
}

export function useCreateComparisonAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ComparisonAnalysis, 'id' | 'analyzedAt'>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend createComparisonAnalysis method not yet implemented');
      return BigInt(Date.now());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comparisonAnalyses'] });
    },
  });
}
