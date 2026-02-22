import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

// Local type definitions for table functionality (not yet in backend)
export interface TableCell {
  value: string;
  formula: string | null;
  isEditable: boolean;
  isSelected: boolean;
  comments: string[];
  emojis: string[];
  lastUpdated: number;
}

export interface TableRow {
  id: number;
  cells: TableCell[];
  isSelected: boolean;
  isArchived: boolean;
  lastUpdated: number;
}

export interface TableColumn {
  id: number;
  header: string;
  isSelected: boolean;
  isArchived: boolean;
  lastUpdated: number;
}

export interface TableConfig {
  id: number;
  name: string;
  columns: TableColumn[];
  rows: TableRow[];
  isArchived: boolean;
  lastUpdated: number;
}

export interface TableOperation {
  operation: string;
  configId: number;
  columnId?: number;
  rowId?: number;
  cellIndex?: number;
  value?: string;
  formula?: string;
  isSelected?: boolean;
  isArchived?: boolean;
  comment?: string;
  emoji?: string;
}

// Mock data for table configs until backend is implemented
const MOCK_TABLE_CONFIGS: TableConfig[] = [
  {
    id: 1,
    name: 'Features Comparison',
    columns: [
      { id: 1, header: 'Feature', isSelected: false, isArchived: false, lastUpdated: Date.now() },
      { id: 2, header: 'SECoin', isSelected: false, isArchived: false, lastUpdated: Date.now() },
      { id: 3, header: 'MOAP', isSelected: false, isArchived: false, lastUpdated: Date.now() },
      { id: 4, header: 'SiteMapAi', isSelected: false, isArchived: false, lastUpdated: Date.now() },
    ],
    rows: [
      {
        id: 1,
        cells: [
          { value: 'PayPal Integration', formula: null, isEditable: false, isSelected: false, comments: [], emojis: [], lastUpdated: Date.now() },
          { value: 'Yes', formula: null, isEditable: true, isSelected: false, comments: [], emojis: ['✅'], lastUpdated: Date.now() },
          { value: 'Yes', formula: null, isEditable: true, isSelected: false, comments: [], emojis: ['✅'], lastUpdated: Date.now() },
          { value: 'Yes', formula: null, isEditable: true, isSelected: false, comments: [], emojis: ['✅'], lastUpdated: Date.now() },
        ],
        isSelected: false,
        isArchived: false,
        lastUpdated: Date.now(),
      },
    ],
    isArchived: false,
    lastUpdated: Date.now(),
  },
];

export function useGetTableConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<TableConfig[]>({
    queryKey: ['tableConfigs'],
    queryFn: async () => {
      // Backend method not yet implemented, using mock data
      console.warn('Backend getAllTableConfigs not yet implemented. Using mock data.');
      return MOCK_TABLE_CONFIGS;
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetTableConfig(configId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TableConfig | null>({
    queryKey: ['tableConfig', configId?.toString()],
    queryFn: async () => {
      if (!configId) return null;
      // Backend method not yet implemented, using mock data
      console.warn('Backend getTableConfig not yet implemented. Using mock data.');
      const config = MOCK_TABLE_CONFIGS.find(c => c.id === Number(configId));
      return config || null;
    },
    enabled: !!actor && !isFetching && !!configId,
    retry: 1,
  });
}

export function useCreateTableConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; columns: TableColumn[]; rows: TableRow[] }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend createTableConfig not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableConfigs'] });
      toast.success('Table configuration created successfully');
    },
    onError: (error: Error) => {
      console.error('Error creating table config:', error);
      toast.error(`Failed to create table configuration: ${error.message}`);
    },
  });
}

export function useUpdateTableConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { configId: bigint; columns: TableColumn[]; rows: TableRow[] }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend updateTableConfig not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableConfigs'] });
      toast.success('Table configuration updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error updating table config:', error);
      toast.error(`Failed to update table configuration: ${error.message}`);
    },
  });
}

export function useArchiveTableConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { configId: bigint; isArchived: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend archiveTableConfig not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableConfigs'] });
      toast.success('Table configuration archived successfully');
    },
    onError: (error: Error) => {
      console.error('Error archiving table config:', error);
      toast.error(`Failed to archive table configuration: ${error.message}`);
    },
  });
}

export function useProcessTableOperation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operation: TableOperation) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend processTableOperation not yet implemented. Simulating success.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableConfigs'] });
    },
    onError: (error: Error) => {
      console.error('Error processing table operation:', error);
      toast.error(`Failed to process operation: ${error.message}`);
    },
  });
}

export function useGetAllApps() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      // Backend method not yet implemented, using local data
      console.warn('Backend getAllApps not yet implemented. Using local data from defaultApps.');
      // Import from local data file
      const { DEFAULT_APPS } = await import('../data/defaultApps');
      return DEFAULT_APPS;
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

