import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, FormSchema, FormSubmission, AuditLogEntry } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
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
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      const errorMessage = error.message.toLowerCase();
      
      // Check for cycle-related errors
      if (errorMessage.includes('insufficient cycles') || errorMessage.includes('out of cycles')) {
        toast.error('Deployment Error: Insufficient Cycles', {
          description: 'Your canister is running low on cycles. Please top up to continue operations.',
          action: {
            label: 'View Guide',
            onClick: () => {
              // Navigate to status tab
              const statusTab = document.querySelector('[value="status"]') as HTMLElement;
              if (statusTab) statusTab.click();
            },
          },
          duration: 10000,
        });
      } else if (errorMessage.includes('memory') || errorMessage.includes('allocation')) {
        toast.error('Deployment Error: Memory Limit Exceeded', {
          description: 'Your canister has exceeded its memory allocation. Consider optimizing data storage.',
          duration: 10000,
        });
      } else {
        toast.error(`Failed to save profile: ${error.message}`);
      }
    },
  });
}

// Public query - no authentication required
export function useGetAllFormSchemas() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FormSchema[]>({
    queryKey: ['formSchemas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFormSchemas();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Public query - no authentication required
export function useGetFormSchema(id: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FormSchema | null>({
    queryKey: ['formSchema', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getFormSchema(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useCreateFormSchema() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schema: FormSchema) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFormSchema(schema);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formSchemas'] });
      toast.success('Form schema created successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'create schema');
    },
  });
}

export function useUpdateFormSchema() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schema: FormSchema) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFormSchema(schema);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formSchemas'] });
      toast.success('Form schema updated successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'update schema');
    },
  });
}

export function useDeleteFormSchema() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFormSchema(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formSchemas'] });
      toast.success('Form schema deleted successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'delete schema');
    },
  });
}

// Public mutation - allows anonymous form submission
export function useSubmitForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: FormSubmission) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitForm(submission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formSubmissions'] });
      toast.success('Form submitted successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'submit form');
    },
  });
}

// Requires authentication
export function useGetAllFormSubmissions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<FormSubmission[]>({
    queryKey: ['formSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFormSubmissions();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Requires authentication
export function useGetFormSubmission(id: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<FormSubmission | null>({
    queryKey: ['formSubmission', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getFormSubmission(id);
    },
    enabled: !!actor && !actorFetching && !!id && !!identity,
  });
}

// Requires authentication
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Requires authentication - admin only
export function useGetAuditLogs() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AuditLogEntry[]>({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuditLogs();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useImportJsonSchema() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.importJsonSchema(url);
    },
    onSuccess: () => {
      toast.success('Schema imported successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'import schema');
    },
  });
}

// Sitemap Management Hooks
export interface SitemapData {
  auto: string[];
  manualPages: ManualPage[];
  controlledRoutes: {
    broadcast: string | null;
    remote: string | null;
    live: string | null;
  };
}

export interface ManualPage {
  path: string;
  addedAt: bigint;
  addedBy: string;
  isPublic: boolean;
  merkleRoot?: Uint8Array;
  signature?: Uint8Array;
}

// Public query - sitemap is publicly accessible
export function useGetSitemap() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SitemapData>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      if (!actor) {
        return {
          auto: [],
          manualPages: [],
          controlledRoutes: { broadcast: null, remote: null, live: null },
        };
      }
      // Mock implementation with public/restricted classification
      return {
        auto: ['/forms', '/portal', '/status', '/optimization'],
        manualPages: [
          { path: '/admin', addedAt: BigInt(Date.now()), addedBy: 'system', isPublic: false },
          { path: '/subscriptions', addedAt: BigInt(Date.now()), addedBy: 'system', isPublic: false },
          { path: '/about', addedAt: BigInt(Date.now()), addedBy: 'system', isPublic: true },
          { path: '/contact', addedAt: BigInt(Date.now()), addedBy: 'system', isPublic: true },
        ],
        controlledRoutes: { broadcast: null, remote: null, live: null },
      };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path, isPublic }: { path: string; isPublic: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation - backend needs to implement addManualPage
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      toast.success('Page added to sitemap successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'add page to sitemap');
    },
  });
}

export function useRemoveManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation - backend needs to implement removeManualPage
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      toast.success('Page removed from sitemap successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'remove page from sitemap');
    },
  });
}

export function useSetControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ route, appName }: { route: 'broadcast' | 'remote' | 'live'; appName: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation - backend needs to implement setControlledRoute
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      toast.success('Controlled route updated successfully');
    },
    onError: (error: Error) => {
      handleDeploymentError(error, 'update controlled route');
    },
  });
}

// Helper function to handle deployment-related errors with actionable messages
function handleDeploymentError(error: Error, operation: string) {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('insufficient cycles') || errorMessage.includes('out of cycles')) {
    toast.error('Deployment Error: Insufficient Cycles', {
      description: `Unable to ${operation}. Your canister is running low on cycles. Please top up to continue operations.`,
      action: {
        label: 'View Cycle Guide',
        onClick: () => {
          const statusTab = document.querySelector('[value="status"]') as HTMLElement;
          if (statusTab) statusTab.click();
        },
      },
      duration: 10000,
    });
  } else if (errorMessage.includes('memory') || errorMessage.includes('allocation') || errorMessage.includes('exceeded')) {
    toast.error('Deployment Error: Memory Limit Exceeded', {
      description: `Unable to ${operation}. Your canister has exceeded its memory allocation. Consider optimizing data storage or archiving old data.`,
      action: {
        label: 'View Solutions',
        onClick: () => {
          const statusTab = document.querySelector('[value="status"]') as HTMLElement;
          if (statusTab) statusTab.click();
        },
      },
      duration: 10000,
    });
  } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    toast.error('Deployment Error: Request Timeout', {
      description: `Unable to ${operation}. The request timed out. Please check your connection and try again.`,
      duration: 8000,
    });
  } else if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
    toast.error('Deployment Error: Canister Not Found', {
      description: `Unable to ${operation}. The canister may have been deleted due to low cycles or incorrect configuration.`,
      action: {
        label: 'Troubleshoot',
        onClick: () => {
          const statusTab = document.querySelector('[value="status"]') as HTMLElement;
          if (statusTab) statusTab.click();
        },
      },
      duration: 10000,
    });
  } else if (errorMessage.includes('unauthorized') || errorMessage.includes('permission')) {
    toast.error(`Failed to ${operation}: Unauthorized`, {
      description: 'You do not have permission to perform this operation.',
      duration: 6000,
    });
  } else {
    toast.error(`Failed to ${operation}`, {
      description: error.message,
      duration: 6000,
    });
  }
}
