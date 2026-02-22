
import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole, SubscriptionStatus, Actor } from '../backend';

export function useActor() {
    const { identity } = useInternetIdentity();
    const [isFetching, setIsFetching] = useState(false);

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
    };

    return {
        actor: identity ? mockActor : null,
        isFetching,
    };
}
