import {
    WorkflowMetadata, Workflow, UserProfile, UserRole,
    ShoppingItem, PageContent, FaqEntry, ReferralRecord,
    MerkleRoot, TrustProof, CompanyInfo, ProcessedFile,
    FormTemplate, ErrorLog, ThemePreference, FeatureReport,
    FixtureSection, PayuFeeStructure, ReferrerEarnings,
    IncomeProjection, ReferralBanner, TransactionId,
    BackupSnapshot, ActivityLog, WorkflowPricing, JsonError,
    SpecConversionStatus, DeduplicationResult, SitemapEntry,
    SitemapSnapshot, AppControlledRouteRequest
} from './backend';

export interface Actor {
    initializeAccessControl(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    assignCallerUserRole(user: string, role: UserRole): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getUserProfile(user: string): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadWorkflow(metadata: WorkflowMetadata, json: string): Promise<void>;
    getWorkflow(id: string): Promise<Workflow | null>;
    searchWorkflows(searchTerm: string): Promise<WorkflowMetadata[]>;
    filterWorkflowsByCategory(category: string): Promise<WorkflowMetadata[]>;
    getWorkflowsPaginated(page: bigint, pageSize: bigint): Promise<{ workflows: WorkflowMetadata[]; totalPages: bigint; currentPage: bigint }>;
    getTotalWorkflowCount(): Promise<bigint>;
    isStripeConfigured(): Promise<boolean>;
    setStripeConfiguration(config: { secretKey: string; allowedCountries: string[] }): Promise<void>;
    setStripeKeys(secretKey: string, publicKey: string): Promise<void>;
    getStripeKeys(): Promise<{ publicKey: string; secretKey: string; isMasked: boolean }>;
    updateStripeKeys(secretKey: string, publicKey: string): Promise<void>;
    revealStripeSecretKey(): Promise<string>;
    getStripeSessionStatus(sessionId: string): Promise<{ failed: { error: string } } | { completed: { response: string; userPrincipal: string | null } }>;
    createCheckoutSession(items: ShoppingItem[], successUrl: string, cancelUrl: string): Promise<string>;
    updatePage(pageName: string, content: PageContent): Promise<void>;
    getPage(pageName: string): Promise<PageContent | null>;
    addFaqEntry(entry: FaqEntry): Promise<void>;
    getFaqEntries(): Promise<FaqEntry[]>;
    addReferralRecord(record: ReferralRecord): Promise<void>;
    addMerkleRoot(root: MerkleRoot): Promise<void>;
    getReferralRecords(): Promise<ReferralRecord[]>;
    getMerkleRoots(): Promise<MerkleRoot[]>;
    submitTrustProof(proof: TrustProof): Promise<void>;
    getTrustProofs(): Promise<TrustProof[]>;
    updateCompanyInfo(info: CompanyInfo): Promise<void>;
    getCompanyInfo(): Promise<CompanyInfo | null>;
    addProcessedFile(file: ProcessedFile): Promise<void>;
    getProcessedFiles(): Promise<ProcessedFile[]>;
    addFormTemplate(template: FormTemplate): Promise<void>;
    getFormTemplates(): Promise<FormTemplate[]>;
    submitFormTemplate(templateId: string, filledData: [string, string][]): Promise<void>;
    addErrorLog(log: ErrorLog): Promise<void>;
    getErrorLogs(): Promise<ErrorLog[]>;
    setThemePreference(preference: ThemePreference): Promise<void>;
    getThemePreference(): Promise<ThemePreference | null>;
    processFiles(files: ProcessedFile[]): Promise<void>;
    saveAllForms(): Promise<void>;
    addFeatureReport(report: FeatureReport): Promise<void>;
    getFeatureReports(): Promise<FeatureReport[]>;
    addFixtureSection(section: FixtureSection): Promise<void>;
    getFixtureSections(): Promise<FixtureSection[]>;
    updatePayuFeeStructure(feeStructure: PayuFeeStructure): Promise<void>;
    getPayuFeeStructure(): Promise<PayuFeeStructure | null>;
    addReferrerEarnings(earnings: ReferrerEarnings): Promise<void>;
    getReferrerEarnings(): Promise<ReferrerEarnings[]>;
    addIncomeProjection(projection: IncomeProjection): Promise<void>;
    getIncomeProjections(): Promise<IncomeProjection[]>;
    addReferralBanner(banner: ReferralBanner): Promise<void>;
    getReferralBanners(): Promise<ReferralBanner[]>;
    addTransactionId(transactionId: TransactionId): Promise<void>;
    getTransactionIds(): Promise<TransactionId[]>;
    createBackupSnapshot(snapshot: BackupSnapshot): Promise<void>;
    getBackupSnapshots(): Promise<BackupSnapshot[]>;
    restoreFromBackup(snapshotId: string): Promise<void>;
    addActivityLog(log: ActivityLog): Promise<void>;
    getActivityLogs(): Promise<ActivityLog[]>;
    setWorkflowPricing(pricing: WorkflowPricing): Promise<void>;
    getWorkflowPricing(workflowId: string): Promise<WorkflowPricing | null>;
    calculateFinalPrice(workflowId: string, userMultiplier: bigint): Promise<bigint>;
    updateTotalUnitsOrdered(workflowId: string, units: bigint): Promise<void>;
    getAllWorkflowPricing(): Promise<WorkflowPricing[]>;
    addJsonError(error: JsonError): Promise<void>;
    getJsonErrors(): Promise<JsonError[]>;
    handleJsonError(message: string, file: string | null, errorType: string, suggestedFix: string | null): Promise<void>;
    resolveJsonError(errorIndex: bigint): Promise<void>;
    getJsonErrorReport(): Promise<{ totalErrors: bigint; unresolvedErrors: bigint; errorTypes: [string, bigint][] }>;
    getJsonErrorFixSuggestions(): Promise<[string, string][]>;
    applyJsonErrorFix(errorType: string): Promise<void>;
    validateJsonErrorFix(errorType: string, isValid: boolean): Promise<void>;
    promoteJsonErrorFix(errorType: string): Promise<void>;
    addSpecConversionStatus(status: SpecConversionStatus): Promise<void>;
    getSpecConversionStatus(workflowId: string): Promise<SpecConversionStatus | null>;
    getAllSpecConversions(): Promise<SpecConversionStatus[]>;
    updateSpecConversionStatus(workflowId: string, status: SpecConversionStatus): Promise<void>;
    handleSpecConversionError(workflowId: string, errorMessage: string): Promise<void>;
    retrySpecConversion(workflowId: string): Promise<void>;
    getSpecConversionReport(): Promise<{ totalConversions: bigint; successfulConversions: bigint; pendingConversions: bigint; errorConversions: bigint }>;
    addDeduplicationResult(result: DeduplicationResult): Promise<void>;
    getDeduplicationResults(): Promise<DeduplicationResult[]>;
    addPage(page: string): Promise<void>;
    deletePage(page: string): Promise<void>;
    getAllPages(): Promise<string[]>;
    getAllSitemapEntries(): Promise<SitemapEntry[]>;
    addWhitelistedApp(appId: string): Promise<void>;
    removeWhitelistedApp(appId: string): Promise<void>;
    getWhitelistedApps(): Promise<string[]>;
    requestAppControlledRoute(appId: string, route: string): Promise<void>;
    approveAppControlledRoute(appId: string, route: string): Promise<void>;
    rejectAppControlledRoute(appId: string, route: string): Promise<void>;
    getAppRouteRequests(): Promise<AppControlledRouteRequest[]>;
    createSitemapSnapshot(description: string): Promise<void>;
    getSitemapSnapshots(): Promise<SitemapSnapshot[]>;
    restoreFromSitemapSnapshot(snapshotId: string): Promise<void>;
    getAllAdminEntries(): Promise<SitemapEntry[]>;
}

import { Principal } from '@dfinity/principal';

const mockWorkflows: WorkflowMetadata[] = [
    {
        id: 'wf1',
        title: 'Lead Generation Bot',
        category: 'Marketing',
        description: 'Automated lead scraping and CRM enrichment',
        tags: ['scraping', 'sales', 'crm'],
        triggerType: 'Schedule',
        accessType: { payPerRun: null },
        priceInCents: 50n,
        version: 1n,
        creator: Principal.fromText('aaaaa-aa')
    },
    {
        id: 'wf2',
        title: 'Invoice Processor',
        category: 'Finance',
        description: 'Extract data from invoices and sync with QuickBooks',
        tags: ['accounting', 'ocr', 'finance'],
        triggerType: 'Email',
        accessType: { subscription: null },
        priceInCents: 150n,
        version: 2n,
        creator: Principal.fromText('aaaaa-aa')
    },
    {
        id: 'wf3',
        title: 'Social Media Auto-Poster',
        category: 'Social',
        description: 'Cross-platform content distribution for creators',
        tags: ['twitter', 'instagram', 'linkedin'],
        triggerType: 'Webhook',
        accessType: { payPerRun: null },
        priceInCents: 200n,
        version: 1n,
        creator: Principal.fromText('aaaaa-aa')
    }
];

const mockProfile: UserProfile = {
    username: 'AdminUser',
    role: { admin: null },
    createdAt: 1700000000000n,
    bio: 'Platform administrator with full access.',
    mobileNo: '+1234567890'
};

const mockSitemap: SitemapEntry[] = [
    { slug: 'catalog', hash: 'h1', routeType: 'manual', status: 'active', version: 1n },
    { slug: 'about', hash: 'h2', routeType: 'manual', status: 'active', version: 1n },
    { slug: 'admin', hash: 'h3', routeType: 'systemPreset', status: 'active', version: 2n },
    { slug: 'custom-webhook', hash: 'h4', routeType: 'appControlled', status: 'active', version: 1n }
];

const mockActor: Actor = {
    async initializeAccessControl() { },
    async getCallerUserRole() { return { admin: null }; },
    async assignCallerUserRole() { },
    async isCallerAdmin() { return true; },
    async getCallerUserProfile() { return mockProfile; },
    async getUserProfile() { return mockProfile; },
    async saveCallerUserProfile() { },
    async uploadWorkflow() { },
    async getWorkflow(id) {
        const metadata = mockWorkflows.find(w => w.id === id);
        return metadata ? { metadata, json: JSON.stringify({ nodes: [], connections: [] }) } : null;
    },
    async searchWorkflows() { return mockWorkflows; },
    async filterWorkflowsByCategory() { return mockWorkflows; },
    async getWorkflowsPaginated() { return { workflows: mockWorkflows, totalPages: 1n, currentPage: 0n }; },
    async getTotalWorkflowCount() { return 3n; },
    async isStripeConfigured() { return true; },
    async setStripeConfiguration() { },
    async setStripeKeys() { },
    async getStripeKeys() { return { publicKey: 'pk_test_mock', secretKey: 'sk_test_mock', isMasked: false }; },
    async updateStripeKeys() { },
    async revealStripeSecretKey() { return 'sk_test_mock'; },
    async getStripeSessionStatus() { return { completed: { response: 'Success', userPrincipal: 'aaaaa-aa' } }; },
    async createCheckoutSession() { return JSON.stringify({ url: 'https://checkout.stripe.com/mock' }); },
    async updatePage() { },
    async getPage() { return null; },
    async addFaqEntry() { },
    async getFaqEntries() { return []; },
    async addReferralRecord() { },
    async addMerkleRoot() { },
    async getReferralRecords() { return []; },
    async getMerkleRoots() { return []; },
    async submitTrustProof() { },
    async getTrustProofs() { return []; },
    async updateCompanyInfo() { },
    async getCompanyInfo() { return { name: 'n8n Workflows E Store', contactEmail: 'admin@example.com', registrationNumber: '123' }; },
    async addProcessedFile() { },
    async getProcessedFiles() { return []; },
    async addFormTemplate() { },
    async getFormTemplates() { return []; },
    async submitFormTemplate() { },
    async addErrorLog() { },
    async getErrorLogs() { return []; },
    async setThemePreference() { },
    async getThemePreference() { return { darkMode: true, vibgyorMode: false }; },
    async processFiles() { },
    async saveAllForms() { },
    async addFeatureReport() { },
    async getFeatureReports() { return []; },
    async addFixtureSection() { },
    async getFixtureSections() { return []; },
    async updatePayuFeeStructure() { },
    async getPayuFeeStructure() { return { fixedFeeInCents: 50n, percentageFee: 3n }; },
    async addReferrerEarnings() { },
    async getReferrerEarnings() { return []; },
    async addIncomeProjection() { },
    async getIncomeProjections() { return []; },
    async addReferralBanner() { },
    async getReferralBanners() { return []; },
    async addTransactionId() { },
    async getTransactionIds() { return []; },
    async createBackupSnapshot() { },
    async getBackupSnapshots() { return []; },
    async restoreFromBackup() { },
    async addActivityLog() { },
    async getActivityLogs() { return []; },
    async setWorkflowPricing() { },
    async getWorkflowPricing() { return { workflowId: 'wf1', basePriceInCents: 50n, userMultiplier: 1n, totalUnitsOrdered: 100n, priceHistory: [] }; },
    async calculateFinalPrice() { return 50n; },
    async updateTotalUnitsOrdered() { },
    async getAllWorkflowPricing() { return []; },
    async addJsonError() { },
    async getJsonErrors() { return []; },
    async handleJsonError() { },
    async resolveJsonError() { },
    async getJsonErrorReport() { return { totalErrors: 0n, unresolvedErrors: 0n, errorTypes: [] }; },
    async getJsonErrorFixSuggestions() { return []; },
    async applyJsonErrorFix() { },
    async validateJsonErrorFix() { },
    async promoteJsonErrorFix() { },
    async addSpecConversionStatus() { },
    async getSpecConversionStatus() { return { workflowId: 'wf1', specMdExists: true, specMlExists: true, yamlExists: false, lastConverted: 0n, status: 'Completed' }; },
    async getAllSpecConversions() { return []; },
    async updateSpecConversionStatus() { },
    async handleSpecConversionError() { },
    async retrySpecConversion() { },
    async getSpecConversionReport() { return { totalConversions: 1n, successfulConversions: 1n, pendingConversions: 0n, errorConversions: 0n }; },
    async addDeduplicationResult() { },
    async getDeduplicationResults() { return []; },
    async addPage() { },
    async deletePage() { },
    async getAllPages() { return ['home', 'catalog', 'about', 'contact']; },
    async getAllSitemapEntries() { return mockSitemap; },
    async addWhitelistedApp() { },
    async removeWhitelistedApp() { },
    async getWhitelistedApps() { return ['App1', 'App2']; },
    async requestAppControlledRoute() { },
    async approveAppControlledRoute() { },
    async rejectAppControlledRoute() { },
    async getAppRouteRequests() { return []; },
    async createSitemapSnapshot() { },
    async getSitemapSnapshots() { return []; },
    async restoreFromSitemapSnapshot() { },
    async getAllAdminEntries() { return mockSitemap; },
};

export function useActor() {
    return { actor: mockActor, isFetching: false };
}
