
import { Principal } from "@dfinity/principal";

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
    role: UserRole;
    subscription: SubscriptionStatus;
}

export interface Workspace {
    id: string;
    name: string;
    description: string;
}

export interface WorkspaceData {
    blocks: BlockConfig[];
    connections: Connection[];
}

export interface BlockConfig {
    id: string;
    blockType: string;
    position: { x: bigint; y: bigint };
    config: string;
}

export interface Connection {
    id: string;
    source: string;
    target: string;
}

export interface UserSubscription {
    id: string;
    status: SubscriptionStatus;
}

export interface PaymentTransaction {
    id: string;
    amount: number;
    timestamp: bigint;
}

export interface ShoppingItem {
    id: string;
    name: string;
    price: number;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
}

export interface AdminPage {
    slug: string;
}

export interface ControlledRoute {
    route: string;
}

export interface AutoRoute {
    route: string;
}

export interface PageMetadata {
    page: string;
    hash: string;
}

export interface Actor {
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    listWorkspaces: () => Promise<Workspace[]>;
    saveWorkspace: (id: string, name: string, description: string, data: WorkspaceData, version: bigint) => Promise<void>;
    deleteWorkspace: (id: string) => Promise<void>;
    getCallerSubscription: () => Promise<UserSubscription | null>;
    getCallerPaymentHistory: () => Promise<PaymentTransaction[]>;
    isStripeConfigured: () => Promise<boolean>;
    createCheckoutSession: (items: ShoppingItem[], successUrl: string, cancelUrl: string) => Promise<string>;
    trackExecution: (workspaceId: string) => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
    getAdminPages: () => Promise<AdminPage[]>;
    getControlledRoutes: () => Promise<ControlledRoute[]>;
    getAllRoutes: () => Promise<{
        autoRoutes: AutoRoute[];
        adminPriorityPages: AdminPage[];
        controlledRoutes: ControlledRoute[];
        pageMetadata: PageMetadata[];
    }>;
    addAdminPage: (slug: string) => Promise<void>;
    addPageMetadata: (page: string, hash: string, adminSignature: string) => Promise<void>;
    resolveRoute: (route: string) => Promise<string>;
}
