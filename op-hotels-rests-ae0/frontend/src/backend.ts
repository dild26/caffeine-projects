export class ExternalBlob {
    filename: string;
    contentType: string;
    data: Uint8Array;
    private uploadProgressCallback?: (percentage: number) => void;

    constructor(filename: string, contentType: string, data: Uint8Array) {
        this.filename = filename;
        this.contentType = contentType;
        this.data = data;
    }

    static fromBytes(bytes: Uint8Array): ExternalBlob {
        return new ExternalBlob('', 'application/octet-stream', bytes);
    }

    getDirectURL(): string {
        if (this.data.length === 0) return '';
        const blob = new Blob([this.data.buffer as ArrayBuffer], { type: this.contentType });
        return URL.createObjectURL(blob);
    }

    withUploadProgress(callback: (percentage: number) => void): ExternalBlob {
        this.uploadProgressCallback = callback;
        return this;
    }
}

export enum SubscriptionStatus {
    active = "active",
    inactive = "inactive",
    trial = "trial",
    expired = "expired",
}

export enum UserRole {
    admin = "admin",
    user = "user",
}

export interface UserProfile {
    id: string;
    username: string;
    name?: string;
    role: UserRole;
    subscription: SubscriptionStatus;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    branch: string;
    createdAt: bigint;
    updatedAt: bigint;
    merkleProof: string;
}

export interface TaskEvent {
    taskId: string;
    eventType: string;
    timestamp: bigint;
    details: string;
}

export interface DataObject {
    id: string;
    name: string;
    fileType: string;
    metadata: string;
    preview?: string;
    uploadedAt: bigint;
    blob: ExternalBlob;
}

export interface ContactData {
    id: string;
    name: string;
    email: string;
    phone: string;
    verified: boolean;
    source: string;
    lastVerified: bigint;
}

export interface IntegrityLog {
    id: string;
    operation: string;
    result: string;
    timestamp: bigint;
    details: string;
}

export interface SyncOperation {
    id: string;
    source: string;
    target: string;
    status: string;
    timestamp: bigint;
    details: string;
}

export interface ClonedPage {
    id: string;
    url: string;
    content: string;
    metadata: string;
    lastSynced: bigint;
    source: string;
}

export interface SitemapEntry {
    id: string;
    url: string;
    title: string;
    description: string;
    lastUpdated: bigint;
    source: string;
}

export interface SearchIndex {
    id: string;
    content: string;
    keywords: string[];
    lastIndexed: bigint;
    source: string;
}

export interface ThemeConfig {
    id: string;
    name: string;
    mode: string;
    colors: string;
    assets: string;
    lastUpdated: bigint;
    source: string;
}

export interface MenuItem {
    id: string;
    menuLabel: string;
    url: string;
    category: string;
    source: string;
    createdAt: bigint;
    updatedAt: bigint;
    version: bigint;
    isVisible: boolean;
    order: bigint;
}

export interface MenuAuditLog {
    menuItemId: string;
    operation: string;
    timestamp: bigint;
    details: string;
    version: bigint;
}

export interface VerificationResult {
    id: string;
    status: string;
    timestamp: bigint;
    details: string;
}

export interface ControlledRoute {
    path: string;
    appController: string;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface Page {
    name: string;
    url: string;
    category: string;
    topApp?: string;
    topAppUrl?: string;
}

export interface SecoinfiAppEntry {
    id: bigint;
    appName: string;
    subdomain: string;
    canonicalUrl: string;
    categoryTags: string;
    status: string;
}

export interface ShareSelectedResult {
    overview: any[];
    compare: any[];
    sites: any[];
    apps: any[];
    message: string;
}

export interface Actor {
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserRole: () => Promise<string>;
    getAllSecoinfiAppsEntries: () => Promise<SecoinfiAppEntry[]>;
    addSecoinfiAppEntry: (appName: string, subdomain: string, canonicalUrl: string, categoryTags: string, status: string) => Promise<bigint>;
    updateSecoinfiAppEntry: (id: bigint, appName: string, canonicalUrl: string) => Promise<boolean>;
    deleteSecoinfiAppEntry: (id: bigint) => Promise<boolean>;
    bulkDeleteSecoinfiAppEntries: (ids: bigint[]) => Promise<void>;
    getAllSecoinfiApps: () => Promise<Page[]>;
    getOverviewPages: () => Promise<Page[]>;
    shareSelectedPages: (selectedIds: bigint[]) => Promise<ShareSelectedResult>;

    // Task Management
    getAllTasks: () => Promise<Task[]>;
    getTask: (taskId: string) => Promise<Task | null>;
    getTaskEvents: (taskId: string) => Promise<TaskEvent[]>;
    createTask: (task: Task) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;

    // Data Objects
    getAllDataObjects: () => Promise<DataObject[]>;
    addDataObject: (dataObject: DataObject) => Promise<void>;

    // Contacts
    getAllContactData: () => Promise<ContactData[]>;
    fetchExternalContactData: () => Promise<string>;

    // Integrity
    getIntegrityLogs: (logId: string) => Promise<IntegrityLog[]>;

    // Sync
    getSyncOperations: (operationId: string) => Promise<SyncOperation[]>;
    fetchExternalSyncData: () => Promise<string>;

    // Cloned Pages
    getAllClonedPages: () => Promise<ClonedPage[]>;
    getClonedPage: (pageId: string) => Promise<ClonedPage | null>;
    cloneSitemapPages: () => Promise<void>;

    // Sitemap
    getAllSitemapEntries: () => Promise<SitemapEntry[]>;

    // Search
    getAllSearchIndexes: () => Promise<SearchIndex[]>;

    // Theme
    getAllThemeConfigs: () => Promise<ThemeConfig[]>;
    getThemeConfig: (configId: string) => Promise<ThemeConfig | null>;

    // Menu
    getAllMenuItems: () => Promise<MenuItem[]>;
    getMenuItem: (menuItemId: string) => Promise<MenuItem | null>;
    addMenuItem: (menuItem: MenuItem) => Promise<void>;
    updateMenuItem: (menuItem: MenuItem) => Promise<void>;
    deleteMenuItem: (menuItemId: string) => Promise<void>;
    getMenuAuditLogs: (menuItemId: string) => Promise<MenuAuditLog[]>;

    // Verification
    getAllVerificationResults: () => Promise<VerificationResult[]>;
    getVerificationResult: (resultId: string) => Promise<VerificationResult | null>;

    // Manual Pages
    getAllManualPages: () => Promise<string[]>;
    addManualPage: (pageSlug: string) => Promise<void>;
    removeManualPage: (pageSlug: string) => Promise<void>;

    // Controlled Routes
    getAllControlledRoutes: () => Promise<ControlledRoute[]>;
    getControlledRoute: (path: string) => Promise<ControlledRoute | null>;
    addControlledRoute: (path: string, appController: string) => Promise<void>;
    removeControlledRoute: (path: string) => Promise<void>;
}
