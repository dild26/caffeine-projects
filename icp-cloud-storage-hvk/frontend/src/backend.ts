import type { Principal } from "@icp-sdk/core/principal";

export type Time = bigint;
export type TenantId = string;
export type FileId = string;
export type ChunkId = string;
export type FolderId = string;

export type Role = { 'admin': null } | { 'user': null } | { 'billing': null } | { 'replication': null };

export interface UserProfile {
    name: string;
    email: string;
    roles: Role[];
    tenantId: [] | [TenantId];
    createdAt: Time;
    lastLogin: Time;
    status: string;
    customMetadata: Array<[string, string]>;
}

export type VideoCodec = { 'H264_AAC': null } | { 'VP8': null } | { 'VP9': null } | { 'OGG': null } | { 'UNKNOWN': null };
export type VideoFormat = { 'MP4': null } | { 'WEBM': null } | { 'OGG': null };

export interface TranscodingJob {
    id: string;
    fileId: FileId;
    owner: Principal;
    sourceFormat: VideoFormat;
    sourceCodec: VideoCodec;
    targetFormat: VideoFormat;
    targetCodec: VideoCodec;
    status: string;
    progress: bigint;
    createdAt: Time;
    updatedAt: Time;
    completedAt: [] | [Time];
    errorMessage: [] | [string];
    outputFileId: [] | [FileId];
    metadata: Array<[string, string]>;
}

export interface TranscodingConfig {
    enableAutoTranscode: boolean;
    targetFormats: VideoFormat[];
    targetCodecs: VideoCodec[];
    maxConcurrentJobs: bigint;
    priority: bigint;
    metadata: Array<[string, string]>;
}

export interface VideoMetadata {
    fileId: FileId;
    originalFormat: VideoFormat;
    originalCodec: VideoCodec;
    availableFormats: Array<[VideoFormat, FileId]>;
    transcodingStatus: string;
    browserCompatibility: Array<[string, boolean]>;
    lastValidated: Time;
    metadata: Array<[string, string]>;
}

export interface MediaDiagnostics {
    browserId: string;
    supportedCodecs: VideoCodec[];
    supportedFormats: VideoFormat[];
    testedAt: Time;
    metadata: Array<[string, string]>;
}

export interface StripeConfiguration {
    publicKey: string;
    webhookSecret: string;
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: bigint;
    amount: bigint;
}

export interface _SERVICE {
    initializeAccessControl: () => Promise<void>;
    getCallerUserRole: () => Promise<any>;
    assignCallerUserRole: (user: Principal, role: any) => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserProfile: () => Promise<[] | [UserProfile]>;
    getUserProfile: (user: Principal) => Promise<[] | [UserProfile]>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    addContactInfo: (info: any) => Promise<void>;
    getContactInfo: () => Promise<[] | [any]>;
    uploadVideoWithCodecDetection: (
        fileId: FileId,
        fileName: string,
        contentType: string,
        size: bigint,
        checksum: string,
        detectedCodec: VideoCodec,
        detectedFormat: VideoFormat
    ) => Promise<string>;
    getTranscodingStatus: (jobId: string) => Promise<[] | [TranscodingJob]>;
    getMyTranscodingJobs: () => Promise<TranscodingJob[]>;
    getAllTranscodingJobs: () => Promise<TranscodingJob[]>;
    getVideoMetadata: (fileId: FileId) => Promise<[] | [VideoMetadata]>;
    getVideoFormats: (fileId: FileId) => Promise<Array<[VideoFormat, FileId]>>;
    triggerManualTranscode: (fileId: FileId, format: VideoFormat, codec: VideoCodec) => Promise<string>;
    updateTranscodingProgress: (jobId: string, progress: bigint, status: string) => Promise<void>;
    completeTranscodingJob: (jobId: string, outputFileId: FileId) => Promise<void>;
    getTranscodingConfig: () => Promise<TranscodingConfig>;
    updateTranscodingConfig: (config: TranscodingConfig) => Promise<void>;
    submitMediaDiagnostics: (diagnostics: MediaDiagnostics) => Promise<void>;
    getMediaDiagnostics: (browserId: string) => Promise<[] | [MediaDiagnostics]>;
    getAllMediaDiagnostics: () => Promise<MediaDiagnostics[]>;
    isStripeConfigured: () => Promise<boolean>;
    setStripeConfiguration: (config: StripeConfiguration) => Promise<void>;
    createCheckoutSession: (items: ShoppingItem[], successUrl: string, cancelUrl: string) => Promise<string>;
}
