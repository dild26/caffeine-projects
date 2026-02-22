import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Workflow, LogEntry, Referral, Backup, ParsingError, Fixture, Dashboard, SpecFile, ManifestLog, DeduplicationLog, Page, SecoinfiApp, SitemapAuditLog } from '../backend';
import { Principal } from '@dfinity/principal';

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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicWorkflows() {
  const { actor, isFetching } = useActor();

  return useQuery<Workflow[]>({
    queryKey: ['publicWorkflows'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicWorkflows();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkflows() {
  const { actor, isFetching } = useActor();

  return useQuery<Workflow[]>({
    queryKey: ['allWorkflows'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkflows();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWorkflow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: Workflow) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addWorkflow(workflow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicWorkflows'] });
      queryClient.invalidateQueries({ queryKey: ['allWorkflows'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useGetLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<LogEntry[]>({
    queryKey: ['logs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferrals() {
  const { actor, isFetching } = useActor();

  return useQuery<Referral[]>({
    queryKey: ['referrals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferrals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetParsingErrors() {
  const { actor, isFetching } = useActor();

  return useQuery<ParsingError[]>({
    queryKey: ['parsingErrors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getParsingErrors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogParsingError() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (error: ParsingError) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logParsingError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parsingErrors'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useApplySuggestedFix() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileName, fix }: { fileName: string; fix: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applySuggestedFix(fileName, fix);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parsingErrors'] });
    },
  });
}

export function useGetFixtures() {
  const { actor, isFetching } = useActor();

  return useQuery<Fixture[]>({
    queryKey: ['fixtures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFixtures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fixture: Fixture) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFixture(fixture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useUpdateFixtureStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fixtureId, status }: { fixtureId: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFixtureStatus(fixtureId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useGetAdminDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<Dashboard>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminDashboard();
    },
    enabled: !!actor && !isFetching,
  });
}

// Specification Management Hooks
export function useGetSpecFiles() {
  const { actor, isFetching } = useActor();

  return useQuery<SpecFile[]>({
    queryKey: ['specFiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSpecFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSpecFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specFile: SpecFile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSpecFile(specFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
      queryClient.invalidateQueries({ queryKey: ['deduplicationStatistics'] });
    },
  });
}

export function useUpdateSpecFileStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ specFileId, status, conversionLog }: { specFileId: string; status: string; conversionLog: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSpecFileStatus(specFileId, status, conversionLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

export function useConvertSpecMdToMl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specFileId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.convertSpecMdToMl(specFileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

export function useValidateSpecFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specFileId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateSpecFile(specFileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

export function usePromoteSpecFileToLeaderboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specFileId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.promoteSpecFileToLeaderboard(specFileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

export function useProcessSpecFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specFileId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.processSpecFile(specFileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

// Manifest Log Hooks
export function useGetManifestLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<ManifestLog[]>({
    queryKey: ['manifestLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getManifestLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddManifestLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (manifestLog: ManifestLog) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManifestLog(manifestLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

export function useUpdateManifestLogStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      manifestLogId,
      status,
      errors,
      schemaCompliance,
      conversionLog
    }: {
      manifestLogId: string;
      status: string;
      errors: string;
      schemaCompliance: string;
      conversionLog: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateManifestLogStatus(manifestLogId, status, errors, schemaCompliance, conversionLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

// Deduplication Hooks
export function useGetDeduplicationLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<DeduplicationLog[]>({
    queryKey: ['deduplicationLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDeduplicationLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRunDeduplicationCheck() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.runDeduplicationCheck();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deduplicationLogs'] });
      queryClient.invalidateQueries({ queryKey: ['deduplicationStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
    },
  });
}

export function useDeduplicateSpecFiles() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: string[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deduplicateSpecFiles(fileIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deduplicationLogs'] });
      queryClient.invalidateQueries({ queryKey: ['deduplicationStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
    },
  });
}

export function useGetDeduplicationStatistics() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalSpecFiles: bigint;
    duplicateGroups: bigint;
    normalizedFiles: bigint;
    pendingDeduplication: bigint;
  }>({
    queryKey: ['deduplicationStatistics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDeduplicationStatistics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCompareSchemaRevisions() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ fileId1, fileId2 }: { fileId1: string; fileId2: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.compareSchemaRevisions(fileId1, fileId2);
    },
  });
}

export function useNormalizeSpecFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specFileId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.normalizeSpecFile(specFileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFiles'] });
      queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
      queryClient.invalidateQueries({ queryKey: ['deduplicationStatistics'] });
    },
  });
}

// Sitemap Management Hooks
export function useGetPages() {
  const { actor, isFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSitemap() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    autoRoutes: string[];
    adminPages: Page[];
    appRoutes: string[];
  }>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitemap();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, title, description, priority }: { slug: string; title: string; description: string; priority: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPage(slug, title, description, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useGetSecoinfiApps() {
  const { actor, isFetching } = useActor();

  return useQuery<SecoinfiApp[]>({
    queryKey: ['secoinfiApps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSecoinfiApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSecoinfiApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (app: SecoinfiApp) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSecoinfiApp(app);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiApps'] });
    },
  });
}

export function useAssignRoutesToApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appSlug, routes }: { appSlug: string; routes: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignRoutesToApp(appSlug, routes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiApps'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useGetSitemapAuditLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapAuditLog[]>({
    queryKey: ['sitemapAuditLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSitemapAuditLogs();
    },
    enabled: !!actor && !isFetching,
  });
}
