import { useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole, SubscriptionStatus, Actor } from '../backend';

export function useActor() {
    const { identity } = useInternetIdentity();
    const [isFetching] = useState(false);

    const mockActor: Actor = {
        getCallerUserProfile: async () => ({
            id: 'mock-user-123',
            username: 'GuestUser',
            role: UserRole.admin,
            subscription: SubscriptionStatus.active,
        }),
        saveCallerUserProfile: async () => { },
        isCallerAdmin: async () => true,
        getCallerUserRole: async () => 'admin',
        getAllSecoinfiAppsEntries: async () => [],
        addSecoinfiAppEntry: async () => BigInt(Date.now()),
        updateSecoinfiAppEntry: async () => true,
        deleteSecoinfiAppEntry: async () => true,
        bulkDeleteSecoinfiAppEntries: async () => { },
        getAllSecoinfiApps: async () => [],
        getOverviewPages: async () => [],
        shareSelectedPages: async () => ({
            overview: [],
            compare: [],
            sites: [],
            apps: [],
            message: "Successfully shared",
        }),
        // OP Hotels specific stubs
        getAllTasks: async () => [],
        getTask: async () => null,
        getTaskEvents: async () => [],
        createTask: async () => { },
        updateTask: async () => { },
        getAllDataObjects: async () => [],
        addDataObject: async () => { },
        getAllContactData: async () => [],
        fetchExternalContactData: async () => "External data",
        getIntegrityLogs: async () => [],
        getSyncOperations: async () => [],
        fetchExternalSyncData: async () => "External sync data",
        getAllClonedPages: async () => [],
        getClonedPage: async () => null,
        cloneSitemapPages: async () => { },
        getAllSitemapEntries: async () => [],
        getAllSearchIndexes: async () => [],
        getAllThemeConfigs: async () => [],
        getThemeConfig: async () => null,
        getAllMenuItems: async () => [],
        getMenuItem: async () => null,
        addMenuItem: async () => { },
        updateMenuItem: async () => { },
        deleteMenuItem: async () => { },
        getMenuAuditLogs: async () => [],
        getAllVerificationResults: async () => [],
        getVerificationResult: async () => null,
        getAllManualPages: async () => [],
        addManualPage: async () => { },
        removeManualPage: async () => { },
        getAllControlledRoutes: async () => [],
        getControlledRoute: async () => null,
        addControlledRoute: async () => { },
        removeControlledRoute: async () => { },
    };

    return {
        actor: identity ? mockActor : null,
        isFetching,
    };
}
