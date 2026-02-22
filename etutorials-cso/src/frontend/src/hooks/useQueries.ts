import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  NavigationItem,
  Theme,
  Resource,
  Instructor,
  Learner,
  Appointment,
  UserProfile
} from '../backend';

const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// Navigation Items - using getNavigationItems() and sorting on frontend
export function useGetAllNavigationItemsSorted() {
  const { actor, isFetching } = useActor();

  return useQuery<NavigationItem[]>({
    queryKey: ['navigationItems', 'sorted'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getNavigationItems();
      // Sort by order on frontend
      return items.sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: 2,
  });
}

export function useAddNavigationItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: NavigationItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNavigationItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
}

export function useUpdateNavigationItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: NavigationItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNavigationItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
}

export function useDeleteNavigationItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNavigationItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationItems'] });
    },
  });
}

// Sitemap items - filter navigation items with type 'sitemap' on frontend
export function useGetSitemapItems() {
  const { actor, isFetching } = useActor();

  return useQuery<NavigationItem[]>({
    queryKey: ['navigationItems', 'sitemap'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getNavigationItems();
      // Filter sitemap items on frontend
      return items.filter(item => item.type === 'sitemap').sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: 2,
  });
}

// Themes - using getThemes() for all theme queries
export function useGetDefaultThemes() {
  const { actor, isFetching } = useActor();

  return useQuery<Theme[]>({
    queryKey: ['themes', 'default'],
    queryFn: async () => {
      if (!actor) return [];
      const themes = await actor.getThemes();
      // Filter default themes (VIBGYOR, Dark, Light) on frontend
      return themes.filter(t => ['vibgyor', 'dark', 'light'].includes(t.id.toLowerCase()));
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: 2,
  });
}

export function useGetAllThemes() {
  const { actor, isFetching } = useActor();

  return useQuery<Theme[]>({
    queryKey: ['themes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThemes();
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: 2,
  });
}

export function useAddTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: Theme) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTheme(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });
}

// Validation - implemented on frontend side
export function useValidateMenuAndThemeData() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['validation', 'menuAndTheme'],
    queryFn: async () => {
      if (!actor) return false;

      try {
        // Fetch themes and navigation items with timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Validation timeout')), 10000);
        });

        const dataPromise = Promise.all([
          actor.getThemes(),
          actor.getNavigationItems(),
        ]);

        const [themes, navItems] = await Promise.race([dataPromise, timeoutPromise]);

        // Validate on frontend
        const hasVibgyor = themes.some(t => t.id.toLowerCase() === 'vibgyor');
        const hasDark = themes.some(t => t.id.toLowerCase() === 'dark');
        const hasLight = themes.some(t => t.id.toLowerCase() === 'light');
        const hasPublicNavItems = navItems.some(n => n.isPublic);

        return hasVibgyor && hasDark && hasLight && hasPublicNavItems;
      } catch (error) {
        console.error('Validation error:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: 1,
  });
}

export function useValidateNavigationAndThemes() {
  // Reuse the same validation logic
  return useValidateMenuAndThemeData();
}

// Resources
export function useGetResources() {
  const { actor, isFetching } = useActor();

  return useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getResources();
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
  });
}

export function useSearchResourcesByHashtag() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (hashtag: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchResourcesByHashtag(hashtag);
    },
  });
}

export function useGetResourceMatrixByCategory() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getResourceMatrixByCategory(category);
    },
  });
}

export function useAddResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resource: Resource) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addResource(resource);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useVerifyResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyResource(resourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// Instructors
export function useGetInstructors() {
  const { actor, isFetching } = useActor();

  return useQuery<Instructor[]>({
    queryKey: ['instructors'],
    queryFn: async () => {
      if (!actor) return [];
      const instructors = await actor.getInstructors();
      // Adapter: Add missing fields (topics, availability) using mock data or derived values
      return instructors.map(inst => ({
        ...inst,
        topics: inst.hashtags || ['General', 'Computer Science'],
        availability: ['Today, 2:00 PM', 'Tomorrow, 10:00 AM'],
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
  });
}

export function useSearchInstructorsByHashtag() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (hashtag: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchInstructorsByHashtag(hashtag);
    },
  });
}

export function useAddInstructor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instructor: Instructor) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addInstructor(instructor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
}

// Learners
export function useGetLearners() {
  const { actor, isFetching } = useActor();

  return useQuery<Learner[]>({
    queryKey: ['learners'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLearners();
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
  });
}

export function useAddLearner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (learner: Learner) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLearner(learner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learners'] });
    },
  });
}

// Appointments
export function useGetAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!actor) return [];
      const appointments = await actor.getAppointments();
      // Adapter: Map time -> timeSlot, add missing status/resourceId
      return appointments.map(apt => ({
        ...apt,
        timeSlot: (apt as any).time || new Date().toISOString(),
        status: 'confirmed',
        resourceId: 'Resource-1'
      })) as Appointment[];
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookAppointment(appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// User Profile
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
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
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

// Theme Preference
export function useUpdateCallerThemePreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (themeId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCallerThemePreference(themeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Contact Page Sync
export function useSyncContactPage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.syncContactPage();
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: 1,
  });
}
