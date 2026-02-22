
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
        getPythonFiles: async () => [],
        getReferralTransactions: async () => [],
        getSpecFileStatus: async () => 'spec.md',
        checkAndConvertSpecFile: async () => 'spec.ml',
        deduplicateSpecFile: async (content: string) => content,
        fetchIPFSContent: async (url: string) => "Mock IPFS Content\n# test.py\n```python\nprint('hello')\n```\n1 M SEToken Txn\nDetails: Mock Transaction",
        checkIPFSHealth: async () => 'Healthy',
        storePythonFile: async () => { },
        storeReferralTransaction: async () => { },
        getPages: async () => ['home', 'admin', 'sitemap', 'blog', 'faq', 'contact', 'about'],
        addPage: async () => 'Success',
        // Existing map-56b methods if needed for other components
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
