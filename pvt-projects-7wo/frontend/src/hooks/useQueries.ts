import { useActor } from './useActor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Task, UserProfile, Column, SchemaChangeLog } from '../backend';
import { validateUserProfile, validateTask, TaskInput } from '../lib/validation';

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
      
      // Frontend schema validation
      const validation = validateUserProfile(profile);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['userTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TaskInput) => {
      if (!actor) throw new Error('Actor not available');
      
      // Frontend schema validation
      const validation = validateTask(params);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      return actor.createTask(params.title, params.description, params.column);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
    },
  });
}

export function useUpdateTaskColumn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { taskId: bigint; newColumn: Column }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Validate column value
      if (![Column.toDo, Column.inProgress, Column.done].includes(params.newColumn)) {
        throw new Error('Invalid column value');
      }

      return actor.updateTaskColumn(params.taskId, params.newColumn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
    },
  });
}

// Schema Change Logs (Admin only)
export function useGetSchemaChangeLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<SchemaChangeLog[]>({
    queryKey: ['schemaChangeLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSchemaChangeLogs();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

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
