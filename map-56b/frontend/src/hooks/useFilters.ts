import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Local type definitions for filter functionality (not yet in backend)
export interface FilterOption {
  id: number;
  keyword: string;
  value: string;
  isActive: boolean;
  isArchived: boolean;
  isAiGenerated: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FilterInput {
  keyword: string;
  value: string;
  isAiGenerated: boolean;
}

export interface FilterUpdateInput {
  id: number;
  keyword: string;
  value: string;
  isActive: boolean;
  isArchived: boolean;
  isAiGenerated: boolean;
}

export interface FilterArchiveInput {
  id: number;
  isArchived: boolean;
}

export interface FilterResetInput {
  resetType: string;
}

export interface FilterBulkInput {
  filters: FilterInput[];
}

// Mock data for filters until backend is implemented
const MOCK_FILTERS: FilterOption[] = [
  {
    id: 1,
    keyword: 'clicks',
    value: 'high',
    isActive: true,
    isArchived: false,
    isAiGenerated: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    keyword: 'duration',
    value: 'long',
    isActive: true,
    isArchived: false,
    isAiGenerated: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 3,
    keyword: 'earnings',
    value: 'premium',
    isActive: true,
    isArchived: false,
    isAiGenerated: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function useFilters() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const { data: filters = [], isLoading } = useQuery<FilterOption[]>({
    queryKey: ['filters'],
    queryFn: async () => {
      // Backend method not yet implemented, using mock data
      console.warn('Backend getAllFilters not yet implemented. Using mock data.');
      return MOCK_FILTERS;
    },
    enabled: !!actor,
  });

  const { data: activeFilters = [] } = useQuery<FilterOption[]>({
    queryKey: ['activeFilters'],
    queryFn: async () => {
      // Backend method not yet implemented, using mock data
      console.warn('Backend getActiveFilters not yet implemented. Using mock data.');
      return MOCK_FILTERS.filter(f => f.isActive && !f.isArchived);
    },
    enabled: !!actor,
  });

  const { data: archivedFilters = [] } = useQuery<FilterOption[]>({
    queryKey: ['archivedFilters'],
    queryFn: async () => {
      // Backend method not yet implemented, using mock data
      console.warn('Backend getArchivedFilters not yet implemented. Using mock data.');
      return MOCK_FILTERS.filter(f => f.isArchived);
    },
    enabled: !!actor,
  });

  const { data: aiGeneratedFilters = [] } = useQuery<FilterOption[]>({
    queryKey: ['aiGeneratedFilters'],
    queryFn: async () => {
      // Backend method not yet implemented, using mock data
      console.warn('Backend getAiGeneratedFilters not yet implemented. Using mock data.');
      return MOCK_FILTERS.filter(f => f.isAiGenerated);
    },
    enabled: !!actor,
  });

  const addFilterMutation = useMutation({
    mutationFn: async (input: FilterInput) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend addFilter not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      queryClient.invalidateQueries({ queryKey: ['activeFilters'] });
    },
  });

  const updateFilterMutation = useMutation({
    mutationFn: async (input: FilterUpdateInput) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend updateFilter not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      queryClient.invalidateQueries({ queryKey: ['activeFilters'] });
    },
  });

  const archiveFilterMutation = useMutation({
    mutationFn: async (input: FilterArchiveInput) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend archiveFilter not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      queryClient.invalidateQueries({ queryKey: ['activeFilters'] });
      queryClient.invalidateQueries({ queryKey: ['archivedFilters'] });
    },
  });

  const resetFiltersMutation = useMutation({
    mutationFn: async (input: FilterResetInput) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend resetFilters not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      queryClient.invalidateQueries({ queryKey: ['activeFilters'] });
      queryClient.invalidateQueries({ queryKey: ['archivedFilters'] });
    },
  });

  const bulkAddFiltersMutation = useMutation({
    mutationFn: async (input: FilterBulkInput) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend bulkAddFilters not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filters'] });
      queryClient.invalidateQueries({ queryKey: ['activeFilters'] });
      queryClient.invalidateQueries({ queryKey: ['aiGeneratedFilters'] });
    },
  });

  return {
    filters,
    activeFilters,
    archivedFilters,
    aiGeneratedFilters,
    isLoading,
    addFilter: addFilterMutation.mutateAsync,
    updateFilter: updateFilterMutation.mutateAsync,
    archiveFilter: archiveFilterMutation.mutateAsync,
    resetFilters: resetFiltersMutation.mutateAsync,
    bulkAddFilters: bulkAddFiltersMutation.mutateAsync,
  };
}

