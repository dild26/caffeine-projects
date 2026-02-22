
export enum UserRole {
    Admin = 'Admin',
    Subscriber = 'Subscriber',
    Public = 'Public'
}
export const UserRoles = Object.values(UserRole);

export enum TaskState {
    new = 'new',
    pending = 'pending',
    inProgress = 'in-progress',
    completed = 'completed',
    blocked = 'blocked',
    finished = 'finished',
    archive = 'archive'
}
export const TaskStates = Object.values(TaskState);

export interface UserProfile {
    id: string;
    username: string;
    role: UserRole;
    bio?: string;
    avatar?: string;
}

export enum ProjectStatus {
    active = 'active',
    archived = 'archived',
    completed = 'completed',
    inProgress = 'in-progress',
    pending = 'pending',
    blocked = 'blocked'
}
export const ProjectStatuses = Object.values(ProjectStatus);

export interface Project {
    id: string;
    name: string;
    description: string;
    owner: string;
    status: ProjectStatus | string;
    createdAt: bigint;
    updatedAt: bigint;
    hash: string;
    nonce: bigint;
}

export interface Task {
    id: string;
    projectId: string;
    name: string;
    description: string;
    state: TaskState;
    createdAt: bigint;
    updatedAt: bigint;
    hash: string;
    nonce: bigint;
}

export interface ModuleMapping {
    moduleName: string;
    character: string;
}

export enum TabType {
    project = 'project',
    task = 'task',
    feature = 'feature',
    sitemap = 'sitemap',
    secure = 'secure',
    spec = 'spec',
    fixture = 'fixture',
    form = 'form',
    node = 'node'
}
export const TabTypes = Object.values(TabType);

export interface Tab {
    id: string;
    name: string;
    type: TabType;
    resourceId: string;
    is3D: boolean;
    openedAt: bigint;
}

export enum NotificationType {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error'
}
export const NotificationTypes = Object.values(NotificationType);

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    timestamp: bigint;
    read: boolean;
}

export enum FeatureState {
    pending = 'pending',
    inProgress = 'in-progress',
    completed = 'completed',
    verified = 'verified',
    failed = 'failed'
}
export const FeatureStates = Object.values(FeatureState);

export interface FeatureStatus {
    id: string;
    name: string;
    status: FeatureState;
    lastUpdated: bigint;
}

export interface SitemapNode {
    id: string;
    label: string;
    path: string;
    children: SitemapNode[];
    status: FeatureState;
}

export interface SecureData {
    id: string;
    owner: string;
    data: string; // Hashed/Encrypted
    sharedWith: string[];
    createdAt: bigint;
}

export enum RequestStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected'
}
export const RequestStatuses = Object.values(RequestStatus);

export interface PermissionRequest {
    id: string;
    requester: string;
    dataId: string;
    status: RequestStatus;
    requestedAt: bigint;
}

export interface SchemaValidation {
    id: string;
    schema: string;
    status: boolean;
    errors: string[];
    validatedAt: bigint;
    isValid?: boolean;
}

export interface ManifestLog {
    id: string;
    changes: string[];
    version: bigint;
    validationStatus: boolean;
    timestamp: bigint;
}

export interface YamlSchema {
    id: string;
    content: string;
    isNormalized: boolean;
    validationStatus: boolean;
    updatedAt: bigint;
}

export interface FeatureVerification {
    id: string;
    name: string;
    aiVerified: boolean;
    adminApproved: boolean;
    status: FeatureState;
    fixtureTopic: string;
    fof: string;
}

export enum FixtureStatus {
    pending = 'pending',
    active = 'active',
    completed = 'completed',
    failed = 'failed'
}
export const FixtureStatuses = Object.values(FixtureStatus);

export interface Fixture {
    id: string;
    topic: string;
    fof: string;
    status: FixtureStatus;
    aiDecision: string;
    adminDecision: string;
}

export interface ExecutionLog {
    timestamp: bigint;
    actor: string;
    action: string;
    signature: string;
}

export type ImportType = 'spec.ml' | 'yaml' | 'md';
export type ImportStatus = 'pending' | 'approved' | 'completed' | 'failed';

export interface AiImport {
    id: string;
    type: ImportType;
    patch: string;
    status: ImportStatus;
    createdAt: bigint;
}

export enum NodeTypeType {
    notes_text = "notes/text",
    hypertext_links = "hypertext/links",
    webpage_app = "webpage/app",
    new_tab_section = "New Tab/section",
    form_fields = "form/fields",
    instruction_cmd = "instruction/cmd",
    task_status = "task/status",
    node_depth = "node/depth"
}
export const NodeTypeTypes = Object.values(NodeTypeType);

export interface NodeType {
    id: string;
    type: NodeTypeType;
    color: string;
}

export interface FormTemplate {
    id: string;
    name: string;
    formData: string;
    metadata: string;
    eContractDetails: string;
}

export interface PostcardContent {
    id: string;
    content: string;
    page: number;
}

export enum LinkType {
    direct = 'direct',
    backlink = 'backlink',
    indirect = 'indirect'
}
export const LinkTypes = Object.values(LinkType);

export interface NodeLink {
    id: string;
    source: string;
    target: string;
    type: LinkType;
    strength: number;
}

export enum CompressionTargetType {
    spec = 'spec',
    nodeModules = 'node_modules',
    specMd = 'spec.md',
    yaml = 'yaml'
}
export const CompressionTargetTypes = Object.values(CompressionTargetType);

export interface CompressionMetric {
    target: CompressionTargetType;
    beforeSize: bigint;
    afterSize: bigint;
    ratio: number;
    timestamp: bigint;
    targetType?: CompressionTargetType;
    compressionRatio?: number;
    compressedSize?: bigint;
}

export enum DeduplicationStatus {
    pending = 'pending',
    completed = 'completed',
    failed = 'failed'
}

export interface DeduplicationStats {
    totalDeduplicationRuns: bigint;
    lastRunTimestamp?: bigint;
    averageCompressionRatio: number;
    totalEntriesCleaned: bigint;
}

export interface DeduplicationResult {
    id: string;
    entriesCleaned: bigint;
    duplicateParagraphs: bigint;
    duplicateFeatureLists: bigint;
    duplicateHeadings: bigint;
    redundantSections: bigint;
    originalSize: bigint;
    cleanedSize: bigint;
    completionTimestamp: bigint;
    status?: DeduplicationStatus; // Added based on usage
}
