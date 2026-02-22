import { Principal } from "@dfinity/principal";

export enum SpecFormat {
    yaml = "yaml",
    ml = "ml",
    markdown = "markdown"
}

export enum Theme {
    default = "default",
    dark = "dark",
    light = "light",
    system = "system"
}

export enum FileType {
    contract = "contract",
    analysis = "analysis",
    report = "report",
    appendix = "appendix",
    other = "other"
}

export enum SubscriptionStatus {
    active = "active",
    inactive = "inactive",
    overdue = "overdue",
    cancelled = "cancelled",
    pending = "pending",
    trial = "trial"
}

export enum FileUploadStatus {
    uploaded = "uploaded",
    processing = "processing",
    failed = "failed",
    completed = "completed"
}

export class ExternalBlob {
    constructor(public data: Uint8Array) { }

    static fromBytes(bytes: Uint8Array): ExternalBlob {
        return new ExternalBlob(bytes);
    }

    withUploadProgress(callback: (percentage: number) => void): ExternalBlob {
        if (typeof callback === 'function') {
            try {
                callback(100);
            } catch (e) {
                console.error("Error in upload progress callback:", e);
            }
        }
        return this;
    }
}

export type ParsingError = {
    timestamp: bigint;
    fileName: string;
    errorMessage: string;
    severity: string;
    suggestedFix: string;
};

export interface Workflow {
    id: string;
    name: string;
    description: string;
    fileHash: string;
    isPublic: boolean;
    uploadTime: bigint;
    uploader: Principal;
    file: ExternalBlob;
}

export interface UserProfile {
    id: Principal;
    username: string;
    email: string;
}

export interface LogEntry {
    timestamp: bigint;
    message: string;
    level: string;
}

export interface Referral {
    code: string;
    referrer: Principal;
}

export interface Backup {
    timestamp: bigint;
    size: bigint;
}

export interface Fixture {
    id: string;
    name: string;
    status: string;
}

export interface Dashboard {
    totalWorkflows: number;
    activeUsers: number;
    totalExecutions: number;
}

export interface SpecFile {
    id: string;
    name: string;
    content: string;
    status: string;
}

export interface ManifestLog {
    id: string;
    timestamp: bigint;
    status: string;
    message: string;
}

export interface DeduplicationLog {
    id: string;
    timestamp: bigint;
    details: string;
}

export interface Page {
    slug: string;
    title: string;
    description: string;
    priority: bigint;
}

export interface SecoinfiApp {
    slug: string;
    name: string;
    description: string;
    routes: string[];
}

export interface SitemapAuditLog {
    timestamp: bigint;
    status: string;
    issues: string[];
}


export interface BackendActor {
    getCallerUserProfile(): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    getPublicWorkflows(): Promise<Workflow[]>;
    getWorkflows(): Promise<Workflow[]>;
    addWorkflow(workflow: Workflow): Promise<void>;
    getLogs(): Promise<LogEntry[]>;
    getReferrals(): Promise<Referral[]>;
    getParsingErrors(): Promise<ParsingError[]>;
    logParsingError(error: ParsingError): Promise<void>;
    applySuggestedFix(fileName: string, fix: string): Promise<void>;
    getFixtures(): Promise<Fixture[]>;
    addFixture(fixture: Fixture): Promise<void>;
    updateFixtureStatus(fixtureId: string, status: string): Promise<void>;
    getAdminDashboard(): Promise<Dashboard>;
    getSpecFiles(): Promise<SpecFile[]>;
    addSpecFile(specFile: SpecFile): Promise<void>;
    updateSpecFileStatus(specFileId: string, status: string, conversionLog: string): Promise<void>;
    convertSpecMdToMl(specFileId: string): Promise<void>;
    validateSpecFile(specFileId: string): Promise<void>;
    promoteSpecFileToLeaderboard(specFileId: string): Promise<void>;
    processSpecFile(specFileId: string): Promise<void>;
    getManifestLogs(): Promise<ManifestLog[]>;
    addManifestLog(manifestLog: ManifestLog): Promise<void>;
    updateManifestLogStatus(manifestLogId: string, status: string, errors: string, schemaCompliance: string, conversionLog: string): Promise<void>;
    getDeduplicationLogs(): Promise<DeduplicationLog[]>;
    runDeduplicationCheck(): Promise<void>;
    deduplicateSpecFiles(fileIds: string[]): Promise<void>;
    getDeduplicationStatistics(): Promise<{
        totalSpecFiles: bigint;
        duplicateGroups: bigint;
        normalizedFiles: bigint;
        pendingDeduplication: bigint;
    }>;
    compareSchemaRevisions(fileId1: string, fileId2: string): Promise<any>;
    normalizeSpecFile(specFileId: string): Promise<void>;
    getPages(): Promise<Page[]>;
    getSitemap(): Promise<{
        autoRoutes: string[];
        adminPages: Page[];
        appRoutes: string[];
    }>;
    addPage(slug: string, title: string, description: string, priority: bigint): Promise<void>;
    getSecoinfiApps(): Promise<SecoinfiApp[]>;
    addSecoinfiApp(app: SecoinfiApp): Promise<void>;
    assignRoutesToApp(appSlug: string, routes: string[]): Promise<void>;
    getSitemapAuditLogs(): Promise<SitemapAuditLog[]>;
}
