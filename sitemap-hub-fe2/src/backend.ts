import { Principal } from "@dfinity/principal";

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

// --- Enums / Variants ---

export enum SubscriptionStatus {
    active = "active",
    expired = "expired",
    cancelled = "cancelled",
    inactive = "inactive"
}

export enum ExportType {
    csv = "csv",
    xlsx = "xlsx",
    json = "json",
    zip = "zip"
}

export enum FieldCategory {
    email = "email",
    phone = "phone",
    address = "address",
    payment = "payment",
    social = "social",
    financial = "financial",
    business = "business",
    branding = "branding",
    other = "other"
}

export enum FieldStatus {
    active = "active",
    inactive = "inactive",
    archived = "archived"
}

export enum FeaturePriority {
    p1 = "p1",
    p2 = "p2",
    p3 = "p3",
    p4 = "p4"
}

export enum FeatureStatus {
    complete = "complete",
    inProgress = "inProgress",
    pending = "pending"
}

export enum CatalogSortBy {
    seoRank = "seoRank",
    clickCount = "clickCount",
    popularity = "popularity",
    relevance = "relevance",
    recency = "recency",
    visibility = "visibility",
    backlinks = "backlinks",
    pingResponse = "pingResponse",
    loadSpeed = "loadSpeed",
    bounceRate = "bounceRate"
}

export enum CatalogSortOrder {
    asc = "asc",
    desc = "desc"
}

export enum DiagnosticSeverity {
    critical = "critical",
    high = "high",
    medium = "medium",
    low = "low"
}

export enum DiagnosticCategory {
    environmentVariables = "environmentVariables",
    fileReferences = "fileReferences",
    buildErrors = "buildErrors",
    configuration = "configuration",
    accessControl = "accessControl",
    stripeConfig = "stripeConfig",
    stableData = "stableData"
}

export enum RecoveryAction {
    rebuildAssets = "rebuildAssets",
    reregisterFiles = "reregisterFiles",
    fixEnvironmentVariables = "fixEnvironmentVariables",
    purgeBuildCache = "purgeBuildCache",
    validateConfiguration = "validateConfiguration",
    reinitializeAccessControl = "reinitializeAccessControl"
}

export type SubscriptionTier =
    | { 'basic': null; __kind__: 'basic' }
    | { 'pro': null; __kind__: 'pro' }
    | { 'enterprise': null; __kind__: 'enterprise' }
    | { 'payAsYouUse': bigint; __kind__: 'payAsYouUse' };

export enum BusinessRole {
    viewer = "viewer",
    editor = "editor",
    admin = "admin"
}

export enum StripeSessionStatus {
    open = "open",
    complete = "complete",
    expired = "expired"
}

// --- Interfaces ---

export interface ShoppingItem {
    productName: string;
    productDescription: string;
    priceInCents: bigint;
    quantity: bigint;
    currency: string;
}

export interface UserProfile {
    name: string;
    email: string;
    createdAt: bigint;
    role?: UserRole;
    businessRole?: BusinessRole;
    tenantId?: string;
}

export enum UserRole {
    admin = "admin",
    user = "user"
}

export interface Subscription {
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface SearchResult {
    url: string;
    title: string;
    description: string;
}

export interface SearchResponse {
    results: SearchResult[];
    totalResults: bigint;
    page: bigint;
    pageSize: bigint;
}

export interface ExtensionCount {
    extension: string;
    count: bigint;
}

export interface PayAsYouUsePurchase {
    batchSize: bigint;
    purchaseDate: bigint;
    remainingQuota: bigint;
}

export interface Referral {
    referrer: Principal;
    referred: Principal;
    createdAt: bigint;
    level: bigint;
}

export interface Commission {
    user: Principal;
    amount: bigint;
    status: 'pending' | 'paid' | { 'pending': null } | { 'paid': null };
    createdAt: bigint;
}

export interface ExportRecord {
    exportType: ExportType;
    filePath: string;
    createdAt: bigint;
    status: 'pending' | 'completed' | 'failed' | { 'pending': null } | { 'completed': null } | { 'failed': null };
    fileSize: bigint;
    downloadCount: bigint;
    compressionRatio: number;
    expiresAt?: bigint;
}

export interface AnalyticsData {
    userActivity: bigint;
    subscriptionMetrics: bigint;
    usageStats: bigint;
    revenue: bigint;
    engagement: bigint;
    referralAnalytics: bigint;
    commissionAnalytics: bigint;
    payoutProcessing: bigint;
    exportTracking: bigint;
    publicSearchAnalytics: bigint;
}

export interface GodsEyeSummary {
    totalFees: bigint;
    totalCommissions: bigint;
    totalTransactions: bigint;
    totalRemunerations: bigint;
    totalDiscounts: bigint;
    totalOffers: bigint;
    totalReturns: bigint;
    companyName: string;
    ceoName: string;
    contactEmail: string;
    paymentEmail: string;
    website: string;
    brandingStatement: string;
    lastUpdated: bigint;
}

export interface FieldDefinition {
    id: bigint;
    name: string;
    value: string;
    category: FieldCategory;
    isChecked: boolean;
    createdAt: bigint;
    updatedAt: bigint;
    status: FieldStatus;
    order: bigint;
}

export interface FieldUpdate {
    id: bigint;
    value: string;
    isChecked: boolean;
    updatedAt: bigint;
}

export interface FieldStatusUpdate {
    id: bigint;
    status: FieldStatus;
}

export interface FieldOrderUpdate {
    id: bigint;
    order: bigint;
}

export interface FeatureChecklistItem {
    id: bigint;
    title: string;
    description: string;
    priority: FeaturePriority;
    status: FeatureStatus;
    moduleName: string;
    page: string;
    createdAt: bigint;
    updatedAt: bigint;
    documentation: string;
    tooltip: string;
    integrationGuidelines: string;
    developmentNotes: string;
}

export interface FeatureChecklistUpdate {
    id: bigint;
    status: FeatureStatus;
    updatedAt: bigint;
}

export interface FeatureChecklistSummary {
    priority: FeaturePriority;
    total: bigint;
    complete: bigint;
    inProgress: bigint;
    pending: bigint;
    progressPercentage: number;
}

export interface CatalogEntry {
    id: bigint;
    fileType: string;
    title: string;
    sourceUrl: string;
    summary: string;
    metadata: string;
    seoRank: bigint;
    clickCount: bigint;
    popularity: bigint;
    relevance: bigint;
    recency: bigint;
    visibility: bigint;
    backlinks: bigint;
    pingResponse: bigint;
    loadSpeed: bigint;
    bounceRate: bigint;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface CatalogFilter {
    fileType: string | null | undefined;
    minSeoRank: bigint | null | undefined;
    minClickCount: bigint | null | undefined;
    minPopularity: bigint | null | undefined;
    minRelevance: bigint | null | undefined;
    maxRecency: bigint | null | undefined;
    minVisibility: bigint | null | undefined;
    minBacklinks: bigint | null | undefined;
    maxPingResponse: bigint | null | undefined;
    maxLoadSpeed: bigint | null | undefined;
    maxBounceRate: bigint | null | undefined;
}

export interface CatalogSort {
    sortBy: CatalogSortBy;
    sortOrder: CatalogSortOrder;
}

export interface CatalogQuery {
    searchTerm: string;
    filter: CatalogFilter;
    sort: CatalogSort;
    page: bigint;
    pageSize: bigint;
}

export interface CatalogResponse {
    entries: CatalogEntry[];
    totalEntries: bigint;
    page: bigint;
    pageSize: bigint;
}

export interface DiagnosticIssue {
    category: DiagnosticCategory;
    severity: DiagnosticSeverity;
    message: string;
    details: string;
    recommendation: string;
    autoFixAvailable: boolean;
}

export interface DiagnosticResult {
    timestamp: bigint;
    issues: DiagnosticIssue[];
    systemHealthy: boolean;
    totalIssues: bigint;
    criticalIssues: bigint;
    highIssues: bigint;
    mediumIssues: bigint;
    lowIssues: bigint;
}

export interface DiagnosticLog {
    id: bigint;
    timestamp: bigint;
    executedBy: Principal;
    result: DiagnosticResult;
    recoveryAttempted: boolean;
    recoverySuccessful: boolean;
}

export interface RecoveryResult {
    action: RecoveryAction | any;
    successful: boolean;
    message: string;
    timestamp: bigint;
}

export interface StripeConfiguration {
    secretKey: string;
    publicKey: string;
    webhookSecret: string;
}

// --- Actor Interface ---

export interface Actor {
    initializeAccessControl: () => Promise<void>;
    getCallerUserRole: () => Promise<any>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;

    // Subscriptions
    createSubscription: (tier: SubscriptionTier) => Promise<void>;
    getCallerSubscription: () => Promise<Subscription | null>;
    purchasePayAsYouUseBatch: (batchSize: bigint) => Promise<void>;
    getPayAsYouUsePurchases: () => Promise<PayAsYouUsePurchase[]>;

    // Search
    publicSearchUrls: (searchQuery: string, page: bigint, pageSize: bigint) => Promise<SearchResponse>;
    addSitemapData: (domain: string, results: SearchResult[]) => Promise<void>;
    getSitemapData: (domain: string) => Promise<SearchResult[]>;
    getAllSitemapData: () => Promise<SearchResult[]>;
    getAllDomains: () => Promise<string[]>;
    filterDomainsByExtension: (extension: string, page: bigint, pageSize: bigint) => Promise<SearchResponse>;
    getExtensionCounts: () => Promise<ExtensionCount[]>;
    processSitemapUploadChunk: (domain: string, chunk: SearchResult[], isLastChunk: boolean) => Promise<void>;
    getSitemapUploadProgress: (domain: string) => Promise<bigint>;
    getSitemapUploadStatus: (domain: string) => Promise<string>;
    getSitemapUploadSummary: (domain: string) => Promise<bigint>;
    getAllValidTlds: () => Promise<string[]>;

    // Referrals & Commissions
    getReferrals: () => Promise<Referral[]>;
    getReferralLinks: () => Promise<Referral[]>;
    createReferralLink: (referred: Principal, level: bigint) => Promise<void>;
    getCommissions: () => Promise<Commission[]>;
    addCommission: (amount: bigint) => Promise<void>;

    // Exports
    createExport: (exportType: ExportType, filePath: string) => Promise<void>;
    getExportRecords: () => Promise<ExportRecord[]>;

    // Catalog
    addCatalogEntry: (entry: CatalogEntry) => Promise<void>;
    updateCatalogEntry: (entry: CatalogEntry) => Promise<void>;
    deleteCatalogEntry: (id: bigint) => Promise<void>;
    getAllCatalogEntries: () => Promise<CatalogEntry[]>;
    getCatalogEntryById: (id: bigint) => Promise<CatalogEntry>;
    getCatalogEntriesByQuery: (query: CatalogQuery) => Promise<CatalogResponse>;

    // Diagnostics
    runDeploymentDiagnostics: () => Promise<DiagnosticResult>;
    executeRecoveryAction: (action: any) => Promise<RecoveryResult>;
    getDeploymentDiagnosticLogs: () => Promise<DiagnosticLog[]>;
    getLatestDiagnosticLog: () => Promise<DiagnosticLog | null>;
    clearDiagnosticLogs: () => Promise<void>;
    getDiagnosticLogById: (id: bigint) => Promise<DiagnosticLog | null>;
    getDiagnosticLogsByDateRange: (startTime: bigint, endTime: bigint) => Promise<DiagnosticLog[]>;

    // God's Eye
    updateGodsEyeSummary: (summary: GodsEyeSummary) => Promise<void>;
    getGodsEyeSummary: (companyName: string) => Promise<GodsEyeSummary>;

    // Analytics
    updateAnalytics: (domain: string, data: AnalyticsData) => Promise<void>;
    getAnalytics: (domain: string) => Promise<AnalyticsData>;
    getAllAnalytics: () => Promise<AnalyticsData[]>;
    getAnalyticsSummary: () => Promise<AnalyticsData>;
    getAnalyticsByCategory: (category: string) => Promise<bigint>;
    getAnalyticsTrends: (category: string, period: bigint) => Promise<bigint[]>;
    getAnalyticsGrowthRate: (category: string) => Promise<number>;

    // Feature Checklist
    addFeatureChecklistItem: (item: FeatureChecklistItem) => Promise<void>;
    getFeatureChecklist: () => Promise<FeatureChecklistItem[]>;
    getFeatureChecklistSummary: () => Promise<FeatureChecklistSummary[]>;
    getFeatureChecklistProgress: () => Promise<number>;
    getFeatureChecklistByPriority: (priority: FeaturePriority) => Promise<FeatureChecklistItem[]>;
    updateFeatureChecklistStatus: (update: FeatureChecklistUpdate) => Promise<void>;

    // Stripe Compatibility (Extended)
    isStripeConfigured: () => Promise<boolean>;
    setStripeConfiguration: (config: StripeConfiguration) => Promise<void>;
    createCheckoutSession: (items: any[], successUrl: string, cancelUrl: string) => Promise<string>;
    getStripeSessionStatus: (sessionId: string) => Promise<StripeSessionStatus>;
    getAllSecoinfiApps?: () => Promise<any[]>; // Compatibility
    getOverviewPages?: () => Promise<any[]>; // Compatibility
    shareSelectedPages?: (selectedIds: bigint[]) => Promise<any>; // Compatibility
}

export type backendInterface = Actor;
