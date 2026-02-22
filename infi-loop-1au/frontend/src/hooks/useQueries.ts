import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

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
      await actor.saveCallerUserProfile(profile);
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

export function useCanAccessAdminPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['canAccessAdminPages'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.canAccessAdminPages();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCanAccessFeaturesPage() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['canAccessFeaturesPage'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.canAccessFeaturesPage();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCheckGodsEyeNetAccess() {
  const { actor } = useActor();

  return useQuery<{ hasAccess: boolean; reason: string }>({
    queryKey: ['godsEyeNetAccess'],
    queryFn: async () => {
      if (!actor) {
        return {
          hasAccess: false,
          reason: 'Authentication required. Please log in.',
        };
      }
      return actor.checkGodsEyeNetAccess();
    },
    enabled: !!actor,
    retry: false,
  });
}

export function useCheckAdvancedGodsEyeAccess() {
  const { actor } = useActor();

  return useQuery<{ hasAccess: boolean; reason: string }>({
    queryKey: ['advancedGodsEyeAccess'],
    queryFn: async () => {
      if (!actor) {
        return {
          hasAccess: false,
          reason: 'Authentication required. Please log in.',
        };
      }
      return actor.checkAdvancedGodsEyeAccess();
    },
    enabled: !!actor,
    retry: false,
  });
}

export function useCheckIPCameraAccess() {
  const { actor } = useActor();

  return useQuery<{ hasAccess: boolean; reason: string }>({
    queryKey: ['ipCameraAccess'],
    queryFn: async () => {
      if (!actor) {
        return {
          hasAccess: false,
          reason: 'Authentication required. Please log in.',
        };
      }
      return actor.checkIPCameraAccess();
    },
    enabled: !!actor,
    retry: false,
  });
}

export function useGetThemePreference() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['themePreference'],
    queryFn: async () => {
      if (!actor) return 'light';
      return actor.getThemePreference();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetThemePreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setThemePreference(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themePreference'] });
    },
  });
}
