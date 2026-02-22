export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface UserProfile {
    name: string;
    stripeCustomerId: string | null;
}

export type Variant_payPerRun_subscription = { payPerRun: null } | { subscription: null };

export interface WorkflowMetadata {
    id: string;
    title: string;
    category: string;
    description: string;
    tags: string[];
    triggerType: string;
    accessType: Variant_payPerRun_subscription;
    priceInCents: bigint;
    version: bigint;
    creator: string;
}

export interface Workflow {
    metadata: WorkflowMetadata;
    json: string;
}

export interface ShoppingItem {
    currency: string;
    productName: string;
    productDescription: string;
    priceInCents: bigint;
    quantity: bigint;
}

export interface PageContent {
    title: string;
    content: string;
    lastUpdated: bigint;
}

export interface FaqEntry {
    question: string;
    answer: string;
}

export interface ReferralRecord {
    referrer: string;
    referral: string;
    campaignId: string;
    timestamp: bigint;
}

export interface MerkleRoot {
    rootHash: string;
    campaignId: string;
    timestamp: bigint;
}

export interface TrustProof {
    user: string;
    workflowId: string;
    proofData: string;
    timestamp: bigint;
    verified: boolean;
}

export interface CompanyInfo {
    name: string;
    ceo: string;
    email: string;
    phone: string;
    website: string;
    whatsapp: string;
    address: string;
    paypal: string;
    upi: string;
    eth: string;
    socialLinks: {
        facebook: string;
        linkedin: string;
        telegram: string;
        discord: string;
        blog: string;
        instagram: string;
        twitter: string;
        youtube: string;
    };
    lastUpdated: bigint;
}

export interface ProcessedFile {
    filename: string;
    content: string;
    fields: [string, string][];
    status: { success: null } | { error: string };
    timestamp: bigint;
}

export interface FormTemplate {
    id: string;
    name: string;
    fields: [string, string][];
    category: string;
    status: { parsed: null } | { pending: null } | { error: string };
    timestamp: bigint;
}

export interface ErrorLog {
    message: string;
    file: string | null;
    timestamp: bigint;
    resolved: boolean;
}

export interface ThemePreference {
    user: string;
    theme: { default: null } | { vibgyor: null };
    timestamp: bigint;
}

export interface FeatureReport {
    featureName: string;
    implemented: boolean;
    description: string;
    timestamp: bigint;
}

export interface FixtureSection {
    topic: string;
    features: FeatureReport[];
    lastUpdated: bigint;
}

export interface PayuFeeStructure {
    top10: bigint;
    top100: bigint;
    top1000: bigint;
    lastUpdated: bigint;
}

export interface ReferrerEarnings {
    referrer: string;
    earnings: bigint;
    tier: { top10: null } | { top100: null } | { top1000: null };
    timestamp: bigint;
}

export interface IncomeProjection {
    referrer: string;
    month: bigint;
    projectedEarnings: bigint;
    timestamp: bigint;
}

export interface ReferralBanner {
    id: string;
    referrer: string;
    campaignId: string;
    trackingCode: string;
    permalink: string;
    timestamp: bigint;
}

export interface TransactionId {
    uid: string;
    nonce: bigint;
    userId: string;
    timestamp: bigint;
}

export interface BackupSnapshot {
    id: string;
    timestamp: bigint;
    data: string;
    description: string;
}

export interface ActivityLog {
    id: string;
    action: string;
    timestamp: bigint;
    user: string;
    details: string;
}

export interface WorkflowPricing {
    workflowId: string;
    basePriceInCents: bigint;
    userMultiplier: bigint;
    totalUnitsOrdered: bigint;
    priceHistory: bigint[];
    lastUpdated: bigint;
}

export interface JsonError {
    message: string;
    file: string | null;
    timestamp: bigint;
    resolved: boolean;
    errorType: string;
    suggestedFix: string | null;
}

export interface SpecConversionStatus {
    workflowId: string;
    specMdExists: boolean;
    specMlExists: boolean;
    yamlExists: boolean;
    conversionStatus: { pending: null } | { success: null } | { error: string };
    lastUpdated: bigint;
}

export interface DeduplicationResult {
    removedDuplicates: string[];
    affectedFilePaths: string[];
    canonicalSpecs: string[];
    storageReclaimed: bigint;
    timestamp: bigint;
}

export interface SitemapEntry {
    slug: string;
    routeType: { manual: null } | { appControlled: null } | { systemPreset: null };
    timestamp: bigint;
    createdBy: string | null;
    status: { active: null } | { deleted: null } | { pendingApproval: null };
    hash: string;
    version: bigint;
    approvedBy: string | null;
}

export interface SitemapSnapshot {
    id: string;
    entries: SitemapEntry[];
    timestamp: bigint;
    createdBy: string;
    description: string;
}

export interface AppControlledRouteRequest {
    appId: string;
    route: string;
    requestedBy: string;
    timestamp: bigint;
    status: { pending: null } | { approved: null } | { rejected: null };
}
