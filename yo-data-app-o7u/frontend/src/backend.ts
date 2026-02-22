
export type Time = bigint;

export enum UserRole {
    admin = "admin",
    user = "user",
}

export enum SubscriptionStatus {
    active = "active",
    inactive = "inactive",
    trial = "trial",
    expired = "expired",
}

export interface Blob {
    filename: string;
    contentType: string;
    data: Uint8Array;
}

export interface Dataset {
    id: string;
    name: string;
    owner: string;
    createdAt: Time;
    format: string;
    schema: string;
    blob: Blob;
    isPublic: boolean;
    cid: string | null;
    merkleHash: string | null;
}

export interface Project {
    id: string;
    name: string;
    owner: string;
    createdAt: Time;
    description: string;
}

export interface UserProfile {
    id: string;
    name?: string;
    username: string;
    email?: string;
    role: UserRole;
    subscription: SubscriptionStatus;
    createdAt?: Time;
}

export interface DatasetPermission {
    datasetId: string;
    user: string;
    canRead: boolean;
    canWrite: boolean;
}

export interface NavigationPage {
    id: string;
    route: string;
    title: string;
    metadata: string;
    createdAt: Time;
    updatedAt: Time;
    version: bigint;
}

export interface ContactInfo {
    companyName: string;
    ceoName: string;
    primaryEmail: string;
    phone: string;
    website: string;
    whatsapp: string;
    businessAddress: string;
    paypal: string;
    upiId: string;
    ethId: string;
    mapLink: string;
    socialLinks: [string, string][];
    logoText: string;
    logoImageUrl: string;
    createdAt: Time;
    updatedAt: Time;
    version: bigint;
}

export interface ContactInfoVersion {
    contactInfo: ContactInfo;
    updatedAt: Time;
    version: bigint;
}

export interface SitemapEntry {
    id: string;
    route: string;
    title: string;
    createdAt: Time;
    updatedAt: Time;
    version: bigint;
}

export interface SitemapPage {
    id: string;
    route: string;
    title: string;
    metadata: string;
    navOrder: bigint;
    visibility: boolean;
    content: string;
    createdAt: Time;
    updatedAt: Time;
    version: bigint;
}

export interface ArchiveContent {
    id: string;
    title: string;
    content: string;
    createdAt: Time;
    updatedAt: Time;
    version: bigint;
}

export interface ArchiveCollection {
    id: string;
    name: string;
    owner: string;
    pages: ArchiveContent[];
    createdAt: Time;
    updatedAt: Time;
    version: bigint;
    zipFileName: string;
    fileParseErrors: [string, string][];
}

export interface FeatureProgress {
    id: string;
    name: string;
    description: string;
    completion: bigint;
    implemented: boolean;
    validated: boolean;
    createdAt: Time;
    updatedAt: Time;
}

export interface Actor {
    getPublicDatasetByCID(cid: string): Promise<Dataset | null>;
    updateFeatureStatus(featureId: string, validationStatus: boolean | null, completion: bigint | null): Promise<boolean>;
    updateMultipleFeatureStatus(statuses: [string, boolean | null, bigint | null][]): Promise<bigint>;
    getFeatureById(featureId: string): Promise<FeatureProgress | null>;
    getPublicFeatures(): Promise<FeatureProgress[]>;
    getAllFeatures(): Promise<FeatureProgress[]>;
    initializeAccessControl(): Promise<void>;
    getCallerUserRole(): Promise<any>;
    isCallerAdmin(): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    createDataset(name: string, format: string, schema: string, blob: Blob, isPublic: boolean): Promise<Dataset>;
    getDataset(id: string): Promise<Dataset | null>;
    getUserDatasets(): Promise<Dataset[]>;
    getPublicDatasets(): Promise<Dataset[]>;
    getAllDatasetsSorted(): Promise<Dataset[]>;
    updateDataset(id: string, name: string, schema: string, isPublic: boolean): Promise<Dataset | null>;
    deleteDataset(id: string): Promise<boolean>;
    shareDataset(datasetId: string, user: string, canRead: boolean, canWrite: boolean): Promise<boolean>;
    revokeDatasetAccess(datasetId: string, user: string): Promise<boolean>;
    createProject(name: string, description: string): Promise<Project>;
    getProject(id: string): Promise<Project | null>;
    getUserProjects(): Promise<Project[]>;
    updateProject(id: string, name: string, description: string): Promise<Project | null>;
    deleteProject(id: string): Promise<boolean>;
    getAllNavigationPages(): Promise<NavigationPage[]>;
    createNavigationPage(route: string, title: string, metadata: string): Promise<NavigationPage>;
    updateNavigationPage(id: string, route: string, title: string, metadata: string): Promise<NavigationPage | null>;
    deleteNavigationPage(id: string): Promise<boolean>;
    getContactInfo(): Promise<ContactInfo | null>;
    updateContactInfo(info: ContactInfo): Promise<void>;
    getContactInfoHistory(): Promise<ContactInfoVersion[]>;
    getAllSitemapEntries(): Promise<SitemapEntry[]>;
    getSitemapPages(): Promise<SitemapPage[]>;
    getSitemapPage(id: string): Promise<SitemapPage | null>;
    createSitemapPage(route: string, title: string, metadata: string, navOrder: bigint, visibility: boolean, content: string): Promise<SitemapPage>;
    updateSitemapPage(id: string, route: string, title: string, metadata: string, navOrder: bigint, visibility: boolean, content: string): Promise<SitemapPage | null>;
    deleteSitemapPage(id: string): Promise<boolean>;
    getArchiveCollections(): Promise<ArchiveCollection[]>;
    getArchiveCollection(id: string): Promise<ArchiveCollection | null>;
    createArchiveCollection(name: string, zipFileName: string, pages: ArchiveContent[], fileParseErrors: [string, string][]): Promise<ArchiveCollection>;
    updateArchiveCollection(id: string, name: string, zipFileName: string, pages: ArchiveContent[], fileParseErrors: [string, string][]): Promise<ArchiveCollection | null>;
    deleteArchiveCollection(id: string): Promise<boolean>;
    // Secoinfi compatibility
    getAllSecoinfiAppsEntries(): Promise<any[]>;
    addSecoinfiAppEntry(entry: any): Promise<bigint>;
    updateSecoinfiAppEntry(id: string, entry: any): Promise<boolean>;
    deleteSecoinfiAppEntry(id: string): Promise<boolean>;
    bulkDeleteSecoinfiAppEntries(ids: string[]): Promise<void>;
    getAllSecoinfiApps(): Promise<any[]>;
    getOverviewPages(): Promise<any[]>;
    shareSelectedPages(selection: any): Promise<any>;
}
