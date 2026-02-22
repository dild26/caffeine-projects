/**
 * Backend type stubs for multi-apps-unify-app-hbc (Multi-Apps Unify).
 */

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    role: string;
    organization: string;
    createdAt: bigint;
}

export interface SyncLog {
    id: string;
    appId: string;
    appName: string;
    action: 'sync' | 'deploy' | 'rollback' | 'healthCheck';
    status: 'success' | 'failed' | 'pending' | 'inProgress';
    message: string;
    timestamp: bigint;
    duration: number;
}

export interface RouteConfig {
    path: string;
    appId: string;
    label: string;
    icon: string;
    enabled: boolean;
    order: number;
}

export interface SecoinfiApp {
    id: string;
    name: string;
    description: string;
    url: string;
    port: number;
    status: 'active' | 'inactive' | 'error' | 'deploying';
    version: string;
    lastDeployed: bigint;
    healthEndpoint: string;
    routes: RouteConfig[];
}
