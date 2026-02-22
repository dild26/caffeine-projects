import { Principal } from "@dfinity/principal";

export enum Theme {
    default = "default",
    vibgyor = "vibgyor"
}

export enum SpecFormat {
    yaml = "yaml",
    ml = "ml",
    markdown = "markdown"
}

export interface SpecVersion {
    timestamp: bigint;
    content: string;
    format: SpecFormat;
}

export interface SitemapEntry {
    path: string;
    title: string;
    description: string;
}

export interface UserProfile {
    name: string;
}

export enum SubscriptionStatus {
    active = "active",
    inactive = "inactive",
    cancelled = "cancelled",
    expired = "expired"
}

export interface Subscription {
    user: Principal;
    status: SubscriptionStatus;
    startDate: bigint;
    endDate: bigint | null;
    plan: string;
}

export enum FileType {
    json = "json",
    markdown = "markdown",
    text = "text",
    zip = "zip"
}

export interface FileMetadata {
    id: string;
    name: string;
    fileType: FileType;
    size: bigint;
    hash: string;
    uploadTime: bigint;
    owner: Principal;
}

export enum FileUploadStatus {
    pending = "pending",
    inProgress = "inProgress",
    completed = "completed",
    failed = "failed"
}

export interface FileUploadProgress {
    fileId: string;
    status: FileUploadStatus;
    progress: bigint;
    error: string | null;
}

export interface ContentValidationResult {
    isValid: boolean;
    contentType: FileType;
    error: string | null;
}

export interface FilePair {
    baseName: string;
    jsonFile: FileMetadata | null;
    mdFile: FileMetadata | null;
}

export interface Pagination {
    page: bigint;
    pageSize: bigint;
    totalItems: bigint;
    totalPages: bigint;
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: Pagination;
}

export interface Page {
    path: string;
    title: string;
    content: string;
    isAdminOnly: boolean;
    lastUpdated: bigint;
}

export interface BusinessInfo {
    companyName: string;
    address: string;
    mapLink: string;
    phone: string;
    website: string;
    whatsapp: string;
    email: string;
    upiId: string;
    ethId: string;
    paypal: string;
    facebook: string;
    linkedin: string;
    telegram: string;
    discord: string;
    blogspot: string;
    instagram: string;
    x: string;
    youtube: string;
    ceo: string;
}

export interface ManifestEntry {
    timestamp: bigint;
    action: string;
    details: string;
    user: Principal;
}

export interface BackupData {
    spec: SpecVersion | null;
    specHistory: SpecVersion[];
    sitemap: SitemapEntry[];
    theme: Theme;
    files: FileMetadata[];
    manifestLog: ManifestEntry[];
}

export interface AnalyticsData {
    totalUsers: bigint;
    totalFiles: bigint;
    totalContracts: bigint;
    activeUsers: bigint;
    revenue: bigint;
}

export interface ShoppingItem {
    currency: string;
    productName: string;
    productDescription: string;
    priceInCents: bigint;
    quantity: bigint;
}

export interface StripeConfiguration {
    secretKey: string;
    allowedCountries: string[];
}

export type StripeSessionStatus = { failed: { error: string } } | { completed: { response: string; userPrincipal: string | null } };

export interface Referral {
    referrer: Principal;
    referred: Principal;
    date: bigint;
    status: string;
}

export interface TemplateInteraction {
    user: Principal;
    templateId: string;
    action: string;
    timestamp: bigint;
}

export interface ManualPage {
    path: string;
    title: string;
    description: string;
    isSystem: boolean;
    isControlled: boolean;
    lastUpdated: bigint;
    adminSignature: Principal | null;
}

export interface ControlledRoute {
    path: string;
    title: string;
    delegatedApp: string;
    adminControl: boolean;
    lastUpdated: bigint;
    adminSignature: Principal | null;
}

export interface BackendActor {
    initializeAccessControl: () => Promise<void>;
    getCallerUserRole: () => Promise<any>;
    assignCallerUserRole: (user: Principal, role: any) => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserProfile: () => Promise<UserProfile | null>;
    getUserProfile: (user: Principal) => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    addSubscription: (subscription: Subscription) => Promise<void>;
    getUserSubscription: (user: Principal) => Promise<Subscription | null>;
    updateSubscription: (updated: Subscription) => Promise<void>;
    isCallerSubscriber: () => Promise<boolean>;
    getCurrentSpec: () => Promise<SpecVersion | null>;
    updateSpec: (content: string, format: SpecFormat) => Promise<void>;
    getSpecHistory: () => Promise<SpecVersion[]>;
    revertToVersion: (timestamp: bigint) => Promise<void>;
    validateSpecFormat: (format: SpecFormat) => Promise<boolean>;
    addSitemapEntry: (entry: SitemapEntry) => Promise<void>;
    getSitemap: () => Promise<SitemapEntry[]>;
    searchSitemap: (searchTerm: string) => Promise<SitemapEntry[]>;
    removeSitemapEntry: (path: string) => Promise<void>;
    toggleTheme: () => Promise<Theme>;
    getCurrentTheme: () => Promise<Theme>;
    addFileMetadata: (metadata: FileMetadata) => Promise<void>;
    updateUploadProgress: (progress: FileUploadProgress) => Promise<void>;
    validateFilePairing: (pair: FilePair) => Promise<boolean>;
    affirmFilePairing: (pair: FilePair, notes: string) => Promise<void>;
    getAllFilePairs: () => Promise<FilePair[]>;
    getPairingErrors: () => Promise<string[]>;
    paginateFiles: (page: bigint, pageSize: bigint) => Promise<PaginatedResult<FileMetadata>>;
    maskHash: (hash: string) => Promise<string>;
    addPage: (page: Page) => Promise<void>;
    getAllPages: () => Promise<Page[]>;
    getPage: (path: string) => Promise<Page | null>;
    removePage: (path: string) => Promise<void>;
    updatePage: (updatedPage: Page) => Promise<void>;
    initializeDefaultPages: () => Promise<void>;
    getNavigationLinks: () => Promise<Page[]>;
    getAdminNavigationLinks: () => Promise<Page[]>;
    getQuickLinks: () => Promise<Page[]>;
    getBottomNavbarLinks: () => Promise<Page[]>;
    validateNavigationLinks: () => Promise<boolean>;
    markFeatureAsCompleted: (featureName: string) => Promise<void>;
    getBusinessInfo: () => Promise<BusinessInfo>;
    updateBusinessInfo: (info: BusinessInfo) => Promise<void>;
    validateBusinessInfo: () => Promise<boolean>;
    addManifestEntry: (action: string, details: string) => Promise<void>;
    getManifestLog: () => Promise<ManifestEntry[]>;
    filterManifestLogByAction: (action: string) => Promise<ManifestEntry[]>;
    createBackup: () => Promise<BackupData>;
    restoreBackup: (backup: BackupData) => Promise<void>;
    getAnalyticsData: () => Promise<AnalyticsData>;
    isStripeConfigured: () => Promise<boolean>;
    setStripeConfiguration: (config: StripeConfiguration) => Promise<void>;
    getStripeConfiguration: () => Promise<StripeConfiguration | null>;
    getStripeSessionStatus: (sessionId: string) => Promise<StripeSessionStatus>;
    createCheckoutSession: (items: ShoppingItem[], successUrl: string, cancelUrl: string) => Promise<string>;
    addReferral: (referred: Principal) => Promise<void>;
    getUserReferrals: (user: Principal) => Promise<Referral[]>;
    updateReferralStatus: (referrer: Principal, referred: Principal, status: string) => Promise<void>;
    addTemplateInteraction: (templateId: string, action: string) => Promise<void>;
    getUserTemplateInteractions: (user: Principal) => Promise<TemplateInteraction[]>;
    getTemplateInteractionsByTemplateId: (templateId: string) => Promise<TemplateInteraction[]>;
    hasEnhancedTemplateAccess: () => Promise<boolean>;
    downloadTemplate: (templateId: string) => Promise<FileMetadata | null>;
    addManualPage: (page: ManualPage) => Promise<void>;
    getManualPages: () => Promise<ManualPage[]>;
    getPageByPath: (path: string) => Promise<ManualPage | null>;
    updateManualPage: (updated: ManualPage) => Promise<void>;
    removeManualPage: (path: string) => Promise<void>;
    addControlledRoute: (route: ControlledRoute) => Promise<void>;
    getControlledRoutes: () => Promise<ControlledRoute[]>;
    getControlledRouteByPath: (path: string) => Promise<ControlledRoute | null>;
    updateControlledRoute: (updated: ControlledRoute) => Promise<void>;
    removeControlledRoute: (path: string) => Promise<void>;
    resolveSitemap: () => Promise<{ auto: SitemapEntry[]; manualPages: ManualPage[]; controlledRoutes: ControlledRoute[] }>;
    getSystemPages: () => Promise<ManualPage[]>;
    getAdminControlledRoutes: () => Promise<ControlledRoute[]>;
}
