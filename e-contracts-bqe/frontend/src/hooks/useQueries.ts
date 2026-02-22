import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Contract, ContractTemplate, UserProfile, UserPreferences, ContractStatus, ContactInfo, MenuItem, TemplateEngine, TemplateFile, TemplateImportReport, TemplateFileType, FeatureChecklistItem, FeatureStatus, TemplateDetailsTab, PaginatedResult } from '../backend';
import { Theme } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { ExternalBlob } from '../backend';

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

export function useGetAllContracts() {
  const { actor, isFetching } = useActor();

  return useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContracts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContractsByStatus(status: ContractStatus) {
  const { actor, isFetching } = useActor();

  return useQuery<Contract[]>({
    queryKey: ['contracts', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContractsByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContract(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Contract | null>({
    queryKey: ['contract', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContract(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, parties }: { title: string; content: string; parties: Principal[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createContract(title, content, parties);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useUpdateContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContract(id, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useDeleteContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContract(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useChangeContractStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContractStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.changeContractStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useGetAllTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<ContractTemplate[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTemplate(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ContractTemplate | null>({
    queryKey: ['template', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplate(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetPublicTemplateSubjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ id: string; name: string; category: string; previewImage: string }>>({
    queryKey: ['publicTemplateSubjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicTemplateSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

// Paginated Templates Queries
export function useGetPaginatedTemplates(page: number, pageSize: number) {
  const { actor, isFetching } = useActor();

  return useQuery<PaginatedResult>({
    queryKey: ['paginatedTemplates', page, pageSize],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPaginatedTemplates(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds
  });
}

export function useGetPaginatedTemplatesByCategory(category: string, page: number, pageSize: number) {
  const { actor, isFetching } = useActor();

  return useQuery<PaginatedResult>({
    queryKey: ['paginatedTemplatesByCategory', category, page, pageSize],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPaginatedTemplatesByCategory(category, BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching && category !== 'all',
    staleTime: 30000, // 30 seconds
  });
}

export function useCreateTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      fields,
      content,
      category,
      size,
      format,
      previewImage,
      fileReference,
      dynamicStructure,
    }: {
      name: string;
      fields: string[];
      content: string;
      category: string;
      size: bigint;
      format: string;
      previewImage: string;
      fileReference: ExternalBlob | null;
      dynamicStructure?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTemplate(name, fields, content, category, size, format, previewImage, fileReference, dynamicStructure || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['publicTemplateSubjects'] });
      queryClient.invalidateQueries({ queryKey: ['paginatedTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['paginatedTemplatesByCategory'] });
    },
  });
}

export function useGetDynamicTemplateStructure(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['dynamicTemplateStructure', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDynamicTemplateStructure(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// Template Engine Queries
export function useGetAllTemplateEngines() {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateEngine[]>({
    queryKey: ['templateEngines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTemplateEngines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublishedTemplateEngines() {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateEngine[]>({
    queryKey: ['publishedTemplateEngines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedTemplateEngines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTemplateEngine(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateEngine | null>({
    queryKey: ['templateEngine', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplateEngine(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateTemplateEngine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      files,
      importReports,
      previewImage,
      fileReference,
    }: {
      name: string;
      description: string;
      files: TemplateFile[];
      importReports: TemplateImportReport[];
      previewImage: string | null;
      fileReference: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTemplateEngine(name, description, files, importReports, previewImage, fileReference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateEngines'] });
      queryClient.invalidateQueries({ queryKey: ['publishedTemplateEngines'] });
    },
  });
}

export function useUpdateTemplateEngine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      files,
      importReports,
      previewImage,
      fileReference,
    }: {
      id: string;
      name: string;
      description: string;
      files: TemplateFile[];
      importReports: TemplateImportReport[];
      previewImage: string | null;
      fileReference: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTemplateEngine(id, name, description, files, importReports, previewImage, fileReference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateEngines'] });
      queryClient.invalidateQueries({ queryKey: ['publishedTemplateEngines'] });
    },
  });
}

export function usePublishTemplateEngine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishTemplateEngine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateEngines'] });
      queryClient.invalidateQueries({ queryKey: ['publishedTemplateEngines'] });
    },
  });
}

export function useDeleteTemplateEngine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTemplateEngine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateEngines'] });
      queryClient.invalidateQueries({ queryKey: ['publishedTemplateEngines'] });
    },
  });
}

// Template File Queries
export function useGetAllTemplateFiles() {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateFile[]>({
    queryKey: ['templateFiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTemplateFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTemplateFile(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateFile | null>({
    queryKey: ['templateFile', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplateFile(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateTemplateFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      fileType,
      content,
      size,
      hash,
      sourceFile,
      isValid,
      errors,
      warnings,
      extractedFields,
      codeBlocks,
      canonicalContent,
      previewImage,
      fileReference,
    }: {
      name: string;
      fileType: TemplateFileType;
      content: string;
      size: bigint;
      hash: string;
      sourceFile: string | null;
      isValid: boolean;
      errors: string[];
      warnings: string[];
      extractedFields: string[];
      codeBlocks: string[];
      canonicalContent: string;
      previewImage: string | null;
      fileReference: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTemplateFile(
        name,
        fileType,
        content,
        size,
        hash,
        sourceFile,
        isValid,
        errors,
        warnings,
        extractedFields,
        codeBlocks,
        canonicalContent,
        previewImage,
        fileReference
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateFiles'] });
    },
  });
}

// Import Report Queries
export function useGetAllImportReports() {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateImportReport[]>({
    queryKey: ['importReports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImportReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImportReport(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateImportReport | null>({
    queryKey: ['importReport', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getImportReport(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateImportReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileName,
      fileType,
      size,
      hash,
      status,
      errors,
      warnings,
      extractedFields,
      codeBlocks,
      canonicalContent,
    }: {
      fileName: string;
      fileType: TemplateFileType;
      size: bigint;
      hash: string;
      status: string;
      errors: string[];
      warnings: string[];
      extractedFields: string[];
      codeBlocks: string[];
      canonicalContent: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createImportReport(
        fileName,
        fileType,
        size,
        hash,
        status,
        errors,
        warnings,
        extractedFields,
        codeBlocks,
        canonicalContent
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importReports'] });
    },
  });
}

export function useGetPreferences() {
  const { actor, isFetching } = useActor();

  return useQuery<UserPreferences | null>({
    queryKey: ['preferences'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPreferences();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePreferences(prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(name, email, message);
    },
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNavigationMenu() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['navigationMenu'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNavigationMenu();
    },
    enabled: !!actor && !isFetching,
  });
}

// Features Checklist Queries
export function useGetAllFeatureChecklistItems() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureChecklistItem[]>({
    queryKey: ['featureChecklistItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeatureChecklistItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeatureChecklistItem(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureChecklistItem | null>({
    queryKey: ['featureChecklistItem', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFeatureChecklistItem(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateFeatureChecklistItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFeatureChecklistItem(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureChecklistItems'] });
    },
  });
}

export function useUpdateFeatureChecklistItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      status,
      isVerified,
    }: {
      id: string;
      name: string;
      description: string;
      status: FeatureStatus;
      isVerified: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeatureChecklistItem(id, name, description, status, isVerified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureChecklistItems'] });
    },
  });
}

export function useVerifyFeatureChecklistItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isVerified }: { id: string; isVerified: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyFeatureChecklistItem(id, isVerified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureChecklistItems'] });
    },
  });
}

export function useDeleteFeatureChecklistItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFeatureChecklistItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureChecklistItems'] });
    },
  });
}

export function useGetFeatureChecklistByStatus(status: FeatureStatus) {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureChecklistItem[]>({
    queryKey: ['featureChecklistItems', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeatureChecklistByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVerifiedFeatureChecklistItems() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureChecklistItem[]>({
    queryKey: ['verifiedFeatureChecklistItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVerifiedFeatureChecklistItems();
    },
    enabled: !!actor && !isFetching,
  });
}

// Template Details Tab Queries
export function useGetTemplateDetailsTabByTemplateId(templateId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TemplateDetailsTab | null>({
    queryKey: ['templateDetailsTab', templateId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplateDetailsTabByTemplateId(templateId);
    },
    enabled: !!actor && !isFetching && !!templateId,
  });
}

export function useCreateTemplateDetailsTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      markdownContent,
      previewImage,
      fileReference,
    }: {
      templateId: string;
      markdownContent: string;
      previewImage: string | null;
      fileReference: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTemplateDetailsTab(templateId, markdownContent, previewImage, fileReference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateDetailsTab'] });
    },
  });
}

// Backup and Restore Queries
export function useCreateBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBackup();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateFiles'] });
    },
  });
}

export function useRestoreFromBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backupId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.restoreFromBackup(backupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// Theme Management Queries
export function useGetTheme() {
  const { actor, isFetching } = useActor();

  return useQuery<Theme>({
    queryKey: ['theme'],
    queryFn: async () => {
      if (!actor) return Theme.normal;
      return actor.getTheme();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: Theme) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setTheme(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] });
    },
  });
}

