/**
 * Frontend type definitions for types not exported by backend
 * These types mirror the backend structure but are defined locally
 */

import type { Principal } from "@icp-sdk/core/principal";
import type { Role, TenantId, Time } from '../backend';

export interface Tenant {
  id: TenantId;
  name: string;
  createdAt: Time;
  owner: Principal;
  storageQuota: bigint;
  usedStorage: bigint;
  billingPlan: string;
  status: string;
  customMetadata: Array<[string, string]>;
}

export interface FileMetadata {
  id: string;
  tenantId: TenantId;
  name: string;
  size: bigint;
  createdAt: Time;
  updatedAt: Time;
  owner: Principal;
  permissions: Role[];
  storageClass: string;
  version: bigint;
  checksum: string;
  isEncrypted: boolean;
  tags: string[];
  path: string;
  contentType: string;
  status: string;
  replicationStatus: string;
  billingStatus: string;
  retentionPolicy: string;
  lifecyclePolicy: string;
  accessCount: bigint;
  lastAccessed: Time;
  expiration?: Time;
  customMetadata: Array<[string, string]>;
  price?: bigint;
}

export interface FolderMetadata {
  id: string;
  tenantId: TenantId;
  name: string;
  size: bigint;
  createdAt: Time;
  updatedAt: Time;
  owner: Principal;
  permissions: Role[];
  path: string;
  parentId?: string;
  status: string;
  operationHistory: FolderOperation[];
  customMetadata: Array<[string, string]>;
  price?: bigint;
}

export interface FolderOperation {
  operationType: string;
  timestamp: Time;
  user: Principal;
  details: string;
}

export interface BillingRecord {
  id: string;
  tenantId: TenantId;
  amount: bigint;
  currency: string;
  periodStart: Time;
  periodEnd: Time;
  status: string;
  createdAt: Time;
  updatedAt: Time;
  paymentMethod: string;
  invoiceId: string;
  description: string;
  customMetadata: Array<[string, string]>;
}

export interface ReplicationTask {
  id: string;
  fileId: string;
  sourceCanister: string;
  targetCanisters: string[];
  status: string;
  createdAt: Time;
  updatedAt: Time;
  priority: bigint;
  retryCount: bigint;
  lastAttempt: Time;
  customMetadata: Array<[string, string]>;
}

export interface Policy {
  id: string;
  name: string;
  type_: string;
  rules: Array<[string, string]>;
  createdAt: Time;
  updatedAt: Time;
  status: string;
  description: string;
  customMetadata: Array<[string, string]>;
}

export interface MenuItem {
  id: string;
  name: string;
  link: string;
  order: bigint;
  isAdminCreated: boolean;
  createdAt: Time;
  updatedAt: Time;
  status: string;
  customMetadata: Array<[string, string]>;
}

export interface SystemLog {
  id: string;
  timestamp: Time;
  eventType: string;
  message: string;
  details: string;
  status: string;
  customMetadata: Array<[string, string]>;
}

export interface FeatureStatus {
  id: string;
  name: string;
  aiDetectedComplete: boolean;
  adminVerified: boolean;
  createdAt: Time;
  updatedAt: Time;
  status: string;
  customMetadata: Array<[string, string]>;
}

export interface ThemePreference {
  userId: Principal;
  theme: string;
  updatedAt: Time;
}

export interface CompareProvider {
  rank: bigint;
  provider: string;
  pricePerGB: string;
  providerType: string;
  notes: string;
}

export interface BackupSession {
  nonce: string;
  user: Principal;
  createdAt: Time;
  merkleRoot: string;
  size: bigint;
  version: bigint;
  status: string;
  metadata: Array<[string, string]>;
}

export interface MerkleBlock {
  id: string;
  sessionNonce: string;
  data: Uint8Array;
  checksum: string;
  encrypted: boolean;
  createdAt: Time;
  size: bigint;
}

export interface UploadBatch {
  id: string;
  tenantId: TenantId;
  user: Principal;
  files: FileMetadata[];
  status: string;
  createdAt: Time;
  updatedAt: Time;
  progress: bigint;
  totalSize: bigint;
  completedSize: bigint;
  metadata: Array<[string, string]>;
}

export interface SharingLink {
  id: string;
  targetId: string;
  targetType: string;
  owner: Principal;
  permissions: Role[];
  createdAt: Time;
  updatedAt: Time;
  status: string;
  expiration?: Time;
  embedCode: string;
  customMetadata: Array<[string, string]>;
}

export interface MonetizationRecord {
  id: string;
  merkleRoot: string;
  nonce: string;
  owner: Principal;
  rewardAmount: bigint;
  status: string;
  createdAt: Time;
  updatedAt: Time;
  customMetadata: Array<[string, string]>;
}

export interface BackupManifest {
  id: string;
  timestamp: Time;
  type: 'incremental' | 'full';
  size: bigint;
  checksum: string;
  version: bigint;
  fileCount: bigint;
  compressed: boolean;
  encrypted: boolean;
  replicaCount: number;
  status: 'pending' | 'completed' | 'failed';
  metadata: Array<[string, string]>;
}

export interface BackupSchedule {
  id: string;
  type: 'incremental' | 'full';
  frequency: 'hourly' | 'daily' | 'weekly';
  enabled: boolean;
  lastRun?: Time;
  nextRun: Time;
  retentionDays: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  replicaCount: number;
}

export interface StorageReplica {
  id: string;
  fileId: string;
  location: 'indexeddb' | 'localstorage' | 'server';
  checksum: string;
  size: bigint;
  status: 'healthy' | 'corrupted' | 'missing';
  lastVerified: Time;
  createdAt: Time;
}

export interface IntegrityCheckResult {
  id: string;
  timestamp: Time;
  totalFiles: number;
  verifiedFiles: number;
  corruptedFiles: number;
  missingFiles: number;
  healedFiles: number;
  issues: IntegrityIssue[];
  duration: number;
  status: 'completed' | 'failed' | 'running';
}

export interface IntegrityIssue {
  fileId: string;
  fileName: string;
  issueType: 'missing' | 'corrupted' | 'checksum_mismatch' | 'replica_missing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  autoHealed: boolean;
  timestamp: Time;
}

export interface PostWriteVerificationResult {
  id: string;
  fileId: string;
  fileName: string;
  timestamp: Time;
  checksumMatch: boolean;
  originalChecksum: string;
  computedChecksum: string;
  size: bigint;
  status: 'verified' | 'quarantined' | 'pending';
  errorMessage?: string;
}

export interface QuarantinedFile {
  id: string;
  fileId: string;
  fileName: string;
  quarantinedAt: Time;
  reason: string;
  originalChecksum: string;
  computedChecksum: string;
  size: bigint;
  canRecover: boolean;
}

export interface IPFSBackupManifest {
  id: string;
  timestamp: Time;
  nonce: string;
  merkleRoot: string;
  previousMerkleRoot?: string;
  type: 'incremental' | 'full';
  fileCount: bigint;
  size: bigint;
  ipfsHashes: string[];
  pinStatus: 'pending' | 'pinned' | 'failed';
  verificationStatus: 'pending' | 'verified' | 'failed';
  metadata: Array<[string, string]>;
}

export interface IPFSNode {
  id: string;
  address: string;
  status: 'online' | 'offline' | 'degraded';
  lastHealthCheck: Time;
  pinnedCount: bigint;
  availableSpace: bigint;
  responseTime: number;
}

export interface IPFSBackupJob {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Time;
  completedAt?: Time;
  filesProcessed: bigint;
  totalFiles: bigint;
  bytesUploaded: bigint;
  totalBytes: bigint;
  errorMessage?: string;
}
