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
        // Use buffer directly to avoid SharedArrayBuffer issues in some environments
        const blob = new Blob([this.data.buffer as ArrayBuffer], { type: this.contentType });
        return URL.createObjectURL(blob);
    }

    withUploadProgress(callback: (percentage: number) => void): ExternalBlob {
        this.uploadProgressCallback = callback;
        return this;
    }
}

export interface UnitValue {
    value: bigint;
    unit: string;
    scale: bigint;
    editableBy: string[];
}

export interface FractionalOwnership {
    owner: string;
    percentage: bigint;
}

export interface Floor {
    floorNumber: bigint;
    area: bigint;
    price: bigint;
}

export interface Node {
    id: string;
    latitude: UnitValue;
    longitude: UnitValue;
    altitude: UnitValue;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface Property {
    id: string;
    name: string;
    location: string;
    price: UnitValue;
    fractionalOwnership: FractionalOwnership[];
    floors: Floor[];
    schemaVersion: bigint;
    latitude: UnitValue;
    longitude: UnitValue;
    nodes: Node[];
    nodeCount: bigint;
    nodePricing: UnitValue;
    area: UnitValue;
    elevation: UnitValue;
    pricePerUnit: UnitValue;
    gallery: ExternalBlob[];
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface Task {
    id: string;
    name: string;
    completed: boolean;
}

export interface Feature {
    id: string;
    name: string;
    completionPercentage: bigint;
    tasks: Task[];
    aiVerified: boolean;
    manuallyVerified: boolean;
    category: string;
    priority: bigint;
    progress: bigint;
    pending: boolean;
    completed: boolean;
    fixture: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: bigint;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface SocialMediaPlatform {
    id: string;
    name: string;
    url: string;
    icon: string;
    displayOrder: bigint;
    active: boolean;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface SitemapEntry {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
}

export interface Sitemap {
    entries: SitemapEntry[];
    rawXml: string;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface MenuItem {
    id: string;
    title: string;
    url: string;
    icon: string;
    order: bigint;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface Fixtures {
    id: string;
    merkleRoot: string;
    verkleLeaves: string[];
    proofStatus: string;
    verificationResult: string;
    autoUpdateRecommendations: string[];
    discrepancyResolution: string;
    recalculationHistory: string[];
    createdAt: bigint;
    updatedAt: bigint;
}

export interface EarningOpportunity {
    id: string;
    title: string;
    description: string;
    level: bigint;
    percentage: bigint;
}

export interface ProfitShareDetails {
    totalPercentage: bigint;
    distributionMethod: string;
    payoutFrequency: string;
}

export interface LevelStructure {
    levels: bigint;
    unlimitedLevels: boolean;
    levelPercentages: bigint[];
}

export interface UniqueNonceSystem {
    nonceGenerationMethod: string;
    memberTracking: string;
    referrerTracking: string;
}

export interface RunningBalanceTracking {
    calculationMethod: string;
    distributionMethod: string;
    feeTracking: string;
}

export interface ReferralMessage {
    id: string;
    title: string;
    content: string;
    type_: string;
}

export interface USPContent {
    id: string;
    title: string;
    description: string;
    highlight: boolean;
}

export interface ReferralProgram {
    id: string;
    name: string;
    description: string;
    earningOpportunities: EarningOpportunity[];
    profitShareDetails: ProfitShareDetails;
    levelStructure: LevelStructure;
    uniqueNonceSystem: UniqueNonceSystem;
    runningBalanceTracking: RunningBalanceTracking;
    messaging: ReferralMessage[];
    uspContent: USPContent[];
    createdAt: bigint;
    updatedAt: bigint;
}

export interface UserProfile {
    name: string;
}

export interface BackendActor {
    initializeAccessControl: () => Promise<void>;
    getCallerUserRole: () => Promise<any>;
    isCallerAdmin: () => Promise<boolean>;
    getAdminStatus: () => Promise<{
        isAdmin: boolean;
        isGenesisAdmin: boolean;
        currentPrincipal: string;
        genesisAdminPrincipal: string | null;
    }>;
    getProperties: () => Promise<Property[]>;
    getProperty: (id: string) => Promise<Property | null>;
    uploadProperty: (property: Property) => Promise<void>;
    updatePropertyPrice: (id: string, newPrice: UnitValue) => Promise<void>;
    addNodeToProperty: (propertyId: string, latitude: UnitValue, longitude: UnitValue, altitude: UnitValue) => Promise<void>;
    removeNodeFromProperty: (propertyId: string, nodeId: string) => Promise<void>;
    getPropertyNodes: (propertyId: string) => Promise<Node[]>;
    getPropertyNodeCount: (propertyId: string) => Promise<bigint>;
    getPropertyNodePricing: (propertyId: string) => Promise<UnitValue>;

    getPublishedBlogPosts: () => Promise<BlogPost[]>;
    getBlogPost: (id: string) => Promise<BlogPost | null>;
    getAllBlogPosts: () => Promise<BlogPost[]>;
    createBlogPost: (title: string, content: string) => Promise<string>;
    updateBlogPost: (id: string, title: string, content: string) => Promise<void>;
    setBlogPostPublished: (id: string, published: boolean) => Promise<void>;

    getFeatures: () => Promise<Feature[]>;
    getFeaturesByCategory: (category: string) => Promise<Feature[]>;
    addFeature: (name: string, tasks: Task[], category: string, priority: bigint, fixture: string) => Promise<string>;
    updateTaskCompletion: (featureId: string, taskId: string, completed: boolean) => Promise<void>;
    updateFeatureVerification: (featureId: string, aiVerified: boolean, manuallyVerified: boolean) => Promise<void>;

    getFAQs: () => Promise<FAQ[]>;
    createFAQ: (question: string, answer: string, order: bigint) => Promise<string>;
    updateFAQ: (id: string, question: string, answer: string, order: bigint) => Promise<void>;
    deleteFAQ: (id: string) => Promise<void>;
    searchFAQs: (searchTerm: string) => Promise<FAQ[]>;
    checkFAQIntegrity: () => Promise<boolean>;

    getSocialMediaPlatforms: () => Promise<SocialMediaPlatform[]>;
    getActiveSocialMediaPlatforms: () => Promise<SocialMediaPlatform[]>;
    createSocialMediaPlatform: (url: string, displayOrder: bigint, active: boolean) => Promise<string>;
    updateSocialMediaPlatform: (id: string, url: string, displayOrder: bigint, active: boolean) => Promise<void>;
    deleteSocialMediaPlatform: (id: string) => Promise<void>;
    initializeDefaultSocialMediaPlatforms: () => Promise<void>;

    getMenuItems: () => Promise<MenuItem[]>;
    createMenuItem: (title: string, url: string, icon: string, order: bigint) => Promise<string>;
    updateMenuItem: (id: string, title: string, url: string, icon: string, order: bigint) => Promise<void>;
    deleteMenuItem: (id: string) => Promise<void>;
    analyzeMenuStructure: () => Promise<any>;
    getCorrectedMenuStructure: () => Promise<any>;
    ensureCriticalMenuItems: () => Promise<void>;

    getSitemap: () => Promise<Sitemap | null>;
    createOrUpdateSitemap: (entries: SitemapEntry[], rawXml: string) => Promise<void>;
    getRawSitemapXml: () => Promise<string>;
    getRobotsTxt: () => Promise<string>;
    checkSitemapIntegrity: () => Promise<boolean>;

    getPropertyGallery: (propertyId: string) => Promise<ExternalBlob[]>;
    addImageToPropertyGallery: (propertyId: string, image: ExternalBlob) => Promise<void>;
    removeImageFromPropertyGallery: (propertyId: string, imageIndex: bigint) => Promise<void>;

    getFixtures: (id: string) => Promise<Fixtures | null>;
    getAllFixtures: () => Promise<Fixtures[]>;
    createOrUpdateFixtures: (id: string, merkleRoot: string, verkleLeaves: string[], proofStatus: string, verificationResult: string, autoUpdateRecommendations: string[], discrepancyResolution: string, recalculationHistory: string[]) => Promise<void>;

    getReferralProgram: (id: string) => Promise<ReferralProgram | null>;
    getAllReferralPrograms: () => Promise<ReferralProgram[]>;
    createOrUpdateReferralProgram: (id: string, name: string, description: string, earningOpportunities: EarningOpportunity[], profitShareDetails: ProfitShareDetails, levelStructure: LevelStructure, uniqueNonceSystem: UniqueNonceSystem, runningBalanceTracking: RunningBalanceTracking, messaging: ReferralMessage[], uspContent: USPContent[]) => Promise<void>;

    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;

    getSystemStats: () => Promise<{
        totalProperties: bigint;
        totalBlogPosts: bigint;
        totalFeatures: bigint;
        totalUsers: bigint;
    }>;

    runDataIntegrityTests: () => Promise<boolean>;
}
