import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  StripeConfiguration,
  ShoppingItem,
  Role,
  TranscodingJob,
  TranscodingConfig,
  VideoMetadata,
  MediaDiagnostics,
  VideoCodec,
  VideoFormat,
  FileId,
} from '../backend';
import type {
  Tenant,
  FileMetadata,
  FolderMetadata,
  BillingRecord,
  Policy,
  ReplicationTask,
  MenuItem,
  SystemLog,
  FeatureStatus,
  ThemePreference,
  CompareProvider,
  BackupSession,
  MerkleBlock,
  UploadBatch,
  SharingLink,
  MonetizationRecord,
} from '../types';
import { Principal } from '@icp-sdk/core/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null, Error>({
    queryKey: ['currentUserProfile'],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getCallerUserProfile();
      return result?.[0] ?? null;
    },
    enabled: !!actor,
    retry: false,
    staleTime: 60000,
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
  const { actor } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor,
    staleTime: 60000,
  });
}

// File Storage with IndexedDB
const fileMetadataStore = new Map<string, FileMetadata>();
// @ts-ignore
const _fileBlobStore = new Map<string, Uint8Array>();
const folderMetadataStore = new Map<string, FolderMetadata>();

// IndexedDB helper for large file storage
const DB_NAME = 'FileStorageDB';
const DB_VERSION = 1;
const FILE_STORE = 'files';

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE);
      }
    };
  });
}

async function storeFileBlob(fileId: string, data: Uint8Array): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FILE_STORE], 'readwrite');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.put(data, fileId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function getFileBlob(fileId: string): Promise<Uint8Array | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FILE_STORE], 'readonly');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.get(fileId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

async function deleteFileBlob(fileId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FILE_STORE], 'readwrite');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.delete(fileId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export function useListFiles() {
  return useQuery<FileMetadata[]>({
    queryKey: ['files'],
    queryFn: async () => {
      return Array.from(fileMetadataStore.values());
    },
    staleTime: 5000,
  });
}

export function useGetFile(fileId: string | undefined) {
  return useQuery<FileMetadata | null>({
    queryKey: ['file', fileId],
    queryFn: async () => {
      if (!fileId) return null;
      return fileMetadataStore.get(fileId) || null;
    },
    enabled: !!fileId,
  });
}

export function useCreateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ metadata, blobData }: { metadata: FileMetadata; blobData: Uint8Array }) => {
      // Store metadata in memory
      fileMetadataStore.set(metadata.id, metadata);

      // Store blob data in IndexedDB
      await storeFileBlob(metadata.id, blobData);

      // Persist metadata to localStorage for recovery
      try {
        const storedFiles = JSON.parse(localStorage.getItem('fileMetadataIndex') || '[]');
        storedFiles.push({
          id: metadata.id,
          name: metadata.name,
          size: metadata.size.toString(),
          checksum: metadata.checksum,
          tenantId: metadata.tenantId,
          owner: metadata.owner.toString(),
          createdAt: metadata.createdAt.toString(),
          updatedAt: metadata.updatedAt.toString(),
          contentType: metadata.contentType,
          path: metadata.path,
          status: metadata.status,
          price: metadata.price?.toString(),
        });
        localStorage.setItem('fileMetadataIndex', JSON.stringify(storedFiles));
      } catch (e) {
        console.error('Failed to persist file metadata:', e);
      }

      return metadata.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: FileMetadata) => {
      fileMetadataStore.set(file.id, file);

      // Update localStorage
      try {
        const storedFiles = JSON.parse(localStorage.getItem('fileMetadataIndex') || '[]');
        const index = storedFiles.findIndex((f: any) => f.id === file.id);
        if (index !== -1) {
          storedFiles[index] = {
            id: file.id,
            name: file.name,
            size: file.size.toString(),
            checksum: file.checksum,
            tenantId: file.tenantId,
            owner: file.owner.toString(),
            createdAt: file.createdAt.toString(),
            updatedAt: file.updatedAt.toString(),
            contentType: file.contentType,
            path: file.path,
            status: file.status,
            price: file.price?.toString(),
          };
          localStorage.setItem('fileMetadataIndex', JSON.stringify(storedFiles));
        }
      } catch (e) {
        console.error('Failed to update file metadata:', e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      fileMetadataStore.delete(fileId);
      await deleteFileBlob(fileId);

      // Remove from localStorage
      try {
        const storedFiles = JSON.parse(localStorage.getItem('fileMetadataIndex') || '[]');
        const filtered = storedFiles.filter((f: any) => f.id !== fileId);
        localStorage.setItem('fileMetadataIndex', JSON.stringify(filtered));
      } catch (e) {
        console.error('Failed to remove file metadata:', e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useGetFileBlob(fileId: string | undefined) {
  return useQuery<Uint8Array | null>({
    queryKey: ['fileBlob', fileId],
    queryFn: async () => {
      if (!fileId) return null;
      return await getFileBlob(fileId);
    },
    enabled: !!fileId,
  });
}

// Folder Storage
export function useListFolders() {
  return useQuery<FolderMetadata[]>({
    queryKey: ['folders'],
    queryFn: async () => {
      return Array.from(folderMetadataStore.values());
    },
    staleTime: 5000,
  });
}

export function useGetFolder(folderId: string | undefined) {
  return useQuery<FolderMetadata | null>({
    queryKey: ['folder', folderId],
    queryFn: async () => {
      if (!folderId) return null;
      return folderMetadataStore.get(folderId) || null;
    },
    enabled: !!folderId,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder: FolderMetadata) => {
      folderMetadataStore.set(folder.id, folder);

      // Persist to localStorage
      try {
        const storedFolders = JSON.parse(localStorage.getItem('folderMetadataIndex') || '[]');
        storedFolders.push({
          id: folder.id,
          name: folder.name,
          size: folder.size.toString(),
          tenantId: folder.tenantId,
          owner: folder.owner.toString(),
          createdAt: folder.createdAt.toString(),
          updatedAt: folder.updatedAt.toString(),
          path: folder.path,
          status: folder.status,
          price: folder.price?.toString(),
        });
        localStorage.setItem('folderMetadataIndex', JSON.stringify(storedFolders));
      } catch (e) {
        console.error('Failed to persist folder metadata:', e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder: FolderMetadata) => {
      folderMetadataStore.set(folder.id, folder);

      // Update localStorage
      try {
        const storedFolders = JSON.parse(localStorage.getItem('folderMetadataIndex') || '[]');
        const index = storedFolders.findIndex((f: any) => f.id === folder.id);
        if (index !== -1) {
          storedFolders[index] = {
            id: folder.id,
            name: folder.name,
            size: folder.size.toString(),
            tenantId: folder.tenantId,
            owner: folder.owner.toString(),
            createdAt: folder.createdAt.toString(),
            updatedAt: folder.updatedAt.toString(),
            path: folder.path,
            status: folder.status,
            price: folder.price?.toString(),
          };
          localStorage.setItem('folderMetadataIndex', JSON.stringify(storedFolders));
        }
      } catch (e) {
        console.error('Failed to update folder metadata:', e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      folderMetadataStore.delete(folderId);

      // Remove from localStorage
      try {
        const storedFolders = JSON.parse(localStorage.getItem('folderMetadataIndex') || '[]');
        const filtered = storedFolders.filter((f: any) => f.id !== folderId);
        localStorage.setItem('folderMetadataIndex', JSON.stringify(filtered));
      } catch (e) {
        console.error('Failed to remove folder metadata:', e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

// Reindex and restore from localStorage on app load
export function useReindexStorage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      let restoredFiles = 0;
      let restoredFolders = 0;

      // Restore files
      try {
        const storedFiles = JSON.parse(localStorage.getItem('fileMetadataIndex') || '[]');
        for (const stored of storedFiles) {
          const metadata: FileMetadata = {
            id: stored.id,
            name: stored.name,
            size: BigInt(stored.size),
            checksum: stored.checksum,
            tenantId: stored.tenantId,
            owner: Principal.from(stored.owner),
            createdAt: BigInt(stored.createdAt),
            updatedAt: BigInt(stored.updatedAt),
            contentType: stored.contentType,
            path: stored.path,
            status: stored.status,
            price: stored.price ? BigInt(stored.price) : undefined,
            permissions: [],
            storageClass: 'standard',
            version: BigInt(1),
            isEncrypted: false,
            tags: [],
            replicationStatus: 'pending',
            billingStatus: 'active',
            retentionPolicy: 'standard',
            lifecyclePolicy: 'standard',
            accessCount: BigInt(0),
            lastAccessed: BigInt(Date.now() * 1000000),
            customMetadata: [],
          };
          fileMetadataStore.set(metadata.id, metadata);
          restoredFiles++;
        }
      } catch (e) {
        console.error('Failed to restore files:', e);
      }

      // Restore folders
      try {
        const storedFolders = JSON.parse(localStorage.getItem('folderMetadataIndex') || '[]');
        for (const stored of storedFolders) {
          const metadata: FolderMetadata = {
            id: stored.id,
            name: stored.name,
            size: BigInt(stored.size),
            tenantId: stored.tenantId,
            owner: Principal.from(stored.owner),
            createdAt: BigInt(stored.createdAt),
            updatedAt: BigInt(stored.updatedAt),
            path: stored.path,
            status: stored.status,
            price: stored.price ? BigInt(stored.price) : undefined,
            permissions: [],
            operationHistory: [],
            customMetadata: [],
          };
          folderMetadataStore.set(metadata.id, metadata);
          restoredFolders++;
        }
      } catch (e) {
        console.error('Failed to restore folders:', e);
      }

      return { restoredFiles, restoredFolders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

// Integrity verification
export function useVerifyStorageIntegrity() {
  return useMutation({
    mutationFn: async () => {
      const issues: string[] = [];
      let verified = 0;

      // Verify all files have blobs in IndexedDB
      for (const [fileId, metadata] of fileMetadataStore.entries()) {
        const blob = await getFileBlob(fileId);
        if (!blob) {
          issues.push(`File ${metadata.name} (${fileId}) missing blob data in IndexedDB`);
        } else {
          verified++;
        }
      }

      return {
        totalFiles: fileMetadataStore.size,
        verified,
        issues,
        healthy: issues.length === 0,
      };
    },
  });
}

// Video Transcoding Queries
export function useUploadVideoWithCodecDetection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      fileName,
      contentType,
      size,
      checksum,
      detectedCodec,
      detectedFormat,
    }: {
      fileId: FileId;
      fileName: string;
      contentType: string;
      size: bigint;
      checksum: string;
      detectedCodec: VideoCodec;
      detectedFormat: VideoFormat;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideoWithCodecDetection(
        fileId,
        fileName,
        contentType,
        size,
        checksum,
        detectedCodec,
        detectedFormat
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcodingJobs'] });
      queryClient.invalidateQueries({ queryKey: ['videoMetadata'] });
    },
  });
}

export function useGetTranscodingStatus(jobId: string | undefined) {
  const { actor } = useActor();

  return useQuery<TranscodingJob | null>({
    queryKey: ['transcodingJob', jobId],
    queryFn: async () => {
      if (!actor || !jobId) return null;
      const result = await actor.getTranscodingStatus(jobId);
      return result?.[0] ?? null;
    },
    enabled: !!actor && !!jobId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useGetMyTranscodingJobs() {
  const { actor } = useActor();

  return useQuery<TranscodingJob[]>({
    queryKey: ['myTranscodingJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTranscodingJobs();
    },
    enabled: !!actor,
    staleTime: 10000,
  });
}

export function useGetAllTranscodingJobs() {
  const { actor } = useActor();

  return useQuery<TranscodingJob[]>({
    queryKey: ['allTranscodingJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTranscodingJobs();
    },
    enabled: !!actor,
    staleTime: 10000,
  });
}

export function useGetVideoMetadata(fileId: string | undefined) {
  const { actor } = useActor();

  return useQuery<VideoMetadata | null>({
    queryKey: ['videoMetadata', fileId],
    queryFn: async () => {
      if (!actor || !fileId) return null;
      const result = await actor.getVideoMetadata(fileId);
      return result?.[0] ?? null;
    },
    enabled: !!actor && !!fileId,
  });
}

export function useGetVideoFormats(fileId: string | undefined) {
  const { actor } = useActor();

  return useQuery<Array<[VideoFormat, FileId]>>({
    queryKey: ['videoFormats', fileId],
    queryFn: async () => {
      if (!actor || !fileId) return [];
      return actor.getVideoFormats(fileId);
    },
    enabled: !!actor && !!fileId,
  });
}

export function useTriggerManualTranscode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      targetFormat,
      targetCodec,
    }: {
      fileId: FileId;
      targetFormat: VideoFormat;
      targetCodec: VideoCodec;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.triggerManualTranscode(fileId, targetFormat, targetCodec);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcodingJobs'] });
      queryClient.invalidateQueries({ queryKey: ['allTranscodingJobs'] });
    },
  });
}

export function useGetTranscodingConfig() {
  const { actor } = useActor();

  return useQuery<TranscodingConfig>({
    queryKey: ['transcodingConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTranscodingConfig();
    },
    enabled: !!actor,
    staleTime: 60000,
  });
}

export function useUpdateTranscodingConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: TranscodingConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTranscodingConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcodingConfig'] });
    },
  });
}

// Media Diagnostics Queries
export function useSubmitMediaDiagnostics() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (diagnostics: MediaDiagnostics) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitMediaDiagnostics(diagnostics);
    },
  });
}

export function useGetMediaDiagnostics(browserId: string | undefined) {
  const { actor } = useActor();

  return useQuery<MediaDiagnostics | null>({
    queryKey: ['mediaDiagnostics', browserId],
    queryFn: async () => {
      if (!actor || !browserId) return null;
      const result = await actor.getMediaDiagnostics(browserId);
      return result?.[0] ?? null;
    },
    enabled: !!actor && !!browserId,
  });
}

export function useGetAllMediaDiagnostics() {
  const { actor } = useActor();

  return useQuery<MediaDiagnostics[]>({
    queryKey: ['allMediaDiagnostics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMediaDiagnostics();
    },
    enabled: !!actor,
    staleTime: 60000,
  });
}

// Mock queries for features not yet implemented in backend
export function useListAllUsers() {
  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUsers'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useListTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetTenant(tenantId: string | undefined) {
  return useQuery<Tenant | null>({
    queryKey: ['tenant', tenantId],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_tenant: Tenant) => {
      throw new Error('Not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useAssignTenantToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user: _user, tenantId: _tenantId }: { user: Principal; tenantId: string }) => {
      throw new Error('Not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Billing Queries (mocked)
export function useListBillingRecords() {
  return useQuery<BillingRecord[]>({
    queryKey: ['billingRecords'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateBillingRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: BillingRecord) => {
      console.log('Creating billing record:', record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billingRecords'] });
    },
  });
}

// Policy Queries (mocked)
export function useListPolicies() {
  return useQuery<Policy[]>({
    queryKey: ['policies'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policy: Policy) => {
      console.log('Creating policy:', policy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
}

// Replication Queries (mocked)
export function useListReplicationTasks() {
  return useQuery<ReplicationTask[]>({
    queryKey: ['replicationTasks'],
    queryFn: async () => [],
    enabled: false,
  });
}

// Stripe Queries
export function useIsStripeConfigured() {
  const { actor } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor,
    staleTime: 60000,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[], successUrl: string, cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      return JSON.parse(result) as { id: string; url: string };
    },
  });
}

// Custom Role Management (mocked)
export function useAssignCustomRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal, role: Role }) => {
      console.log('Assigning custom role:', user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Menu Management Queries (mocked)
export function useListMenuItems() {
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MenuItem) => {
      console.log('Creating menu item:', item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MenuItem) => {
      console.log('Updating menu item:', item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      console.log('Deleting menu item:', itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

// System Log Queries (mocked)
export function useListSystemLogs() {
  return useQuery<SystemLog[]>({
    queryKey: ['systemLogs'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateSystemLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: SystemLog) => {
      console.log('Creating system log:', log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemLogs'] });
    },
  });
}

// Theme Preference Queries (mocked)
export function useGetThemePreference() {
  return useQuery<ThemePreference | null>({
    queryKey: ['themePreference'],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useSetThemePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: string) => {
      console.log('Setting theme preference:', theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themePreference'] });
    },
  });
}

// Feature Status Queries (mocked)
export function useListFeatureStatuses() {
  return useQuery<FeatureStatus[]>({
    queryKey: ['featureStatuses'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateFeatureStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: FeatureStatus) => {
      console.log('Creating feature status:', status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureStatuses'] });
    },
  });
}

export function useUpdateFeatureStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: FeatureStatus) => {
      console.log('Updating feature status:', status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureStatuses'] });
    },
  });
}

export function useDeleteFeatureStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (statusId: string) => {
      console.log('Deleting feature status:', statusId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureStatuses'] });
    },
  });
}

// Compare Provider Queries (mocked)
export function useListCompareProviders() {
  return useQuery<CompareProvider[]>({
    queryKey: ['compareProviders'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useCreateCompareProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: CompareProvider) => {
      console.log('Creating compare provider:', provider);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compareProviders'] });
    },
  });
}

export function useUpdateCompareProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: CompareProvider) => {
      console.log('Updating compare provider:', provider);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compareProviders'] });
    },
  });
}

export function useDeleteCompareProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rank: bigint) => {
      console.log('Deleting compare provider:', rank);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compareProviders'] });
    },
  });
}

// Backup and Restore Queries (mocked)
export function useListBackupSessions() {
  return useQuery<BackupSession[]>({
    queryKey: ['backupSessions'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetBackupSession(nonce: string | undefined) {
  return useQuery<BackupSession | null>({
    queryKey: ['backupSession', nonce],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useCreateBackupSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nonce, merkleRoot, size, version }: { nonce: string; merkleRoot: string; size: bigint; version: bigint }) => {
      console.log('Creating backup session:', nonce, merkleRoot, size, version);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backupSessions'] });
    },
  });
}

export function useStoreMerkleBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (block: MerkleBlock) => {
      console.log('Storing merkle block:', block);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merkleBlocks'] });
    },
  });
}

export function useListMerkleBlocksForSession(nonce: string | undefined) {
  return useQuery<MerkleBlock[]>({
    queryKey: ['merkleBlocks', nonce],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useRestoreBackupSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nonce: string) => {
      console.log('Restoring backup session:', nonce);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useSyncBackupSession() {
  return useMutation({
    mutationFn: async ({ nonce, clientMerkleRoot }: { nonce: string; clientMerkleRoot: string }) => {
      console.log('Syncing backup session:', nonce, clientMerkleRoot);
    },
  });
}

export function useVerifyBackupIntegrity() {
  return useMutation({
    mutationFn: async (nonce: string) => {
      console.log('Verifying backup integrity:', nonce);
      return true;
    },
  });
}

// Upload Batch Queries (mocked)
export function useListUploadBatches() {
  return useQuery<UploadBatch[]>({
    queryKey: ['uploadBatches'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetUploadBatch(batchId: string | undefined) {
  return useQuery<UploadBatch | null>({
    queryKey: ['uploadBatch', batchId],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useCreateUploadBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantId, files, totalSize }: { tenantId: string; files: FileMetadata[]; totalSize: bigint }) => {
      console.log('Creating upload batch:', tenantId, files.length, totalSize);
      return `batch_${Date.now()}`;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadBatches'] });
    },
  });
}

export function useUpdateUploadBatchProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId, completedSize }: { batchId: string; completedSize: bigint }) => {
      console.log('Updating upload batch progress:', batchId, completedSize);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadBatches'] });
    },
  });
}

export function useCompleteUploadBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: string) => {
      console.log('Completing upload batch:', batchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadBatches'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useCancelUploadBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: string) => {
      console.log('Cancelling upload batch:', batchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadBatches'] });
    },
  });
}

// Sharing Link Queries
const sharingLinksStore = new Map<string, SharingLink>();

export function useListSharingLinks() {
  return useQuery<SharingLink[]>({
    queryKey: ['sharingLinks'],
    queryFn: async () => {
      return Array.from(sharingLinksStore.values());
    },
    staleTime: 5000,
  });
}

export function useGetSharingLink(linkId: string | undefined) {
  return useQuery<SharingLink | null>({
    queryKey: ['sharingLink', linkId],
    queryFn: async () => {
      if (!linkId) return null;
      return sharingLinksStore.get(linkId) || null;
    },
    enabled: !!linkId,
  });
}

export function useCreateSharingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: SharingLink) => {
      sharingLinksStore.set(link.id, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharingLinks'] });
    },
  });
}

export function useUpdateSharingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: SharingLink) => {
      sharingLinksStore.set(link.id, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharingLinks'] });
    },
  });
}

export function useDeleteSharingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      sharingLinksStore.delete(linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharingLinks'] });
    },
  });
}

// Monetization Queries (mocked)
export function useListMonetizationRecords() {
  return useQuery<MonetizationRecord[]>({
    queryKey: ['monetizationRecords'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetMonetizationRecord(recordId: string | undefined) {
  return useQuery<MonetizationRecord | null>({
    queryKey: ['monetizationRecord', recordId],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useCreateMonetizationRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: MonetizationRecord) => {
      console.log('Creating monetization record:', record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monetizationRecords'] });
    },
  });
}

export function useVerifyOwnershipByMerkleRoot() {
  return useMutation({
    mutationFn: async (merkleRoot: string) => {
      console.log('Verifying ownership by merkle root:', merkleRoot);
      return true;
    },
  });
}
