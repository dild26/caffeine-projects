import { useState, useEffect } from 'react';
import { _SERVICE, UserProfile } from '../backend';

export function useActor() {
    const [actor, setActor] = useState<_SERVICE | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const mockActor: _SERVICE = {
            getCallerUserProfile: async () => ({
                username: 'InfiniteExplorer',
                role: 'admin',
                joinedAt: BigInt(Date.now())
            }),
            saveCallerUserProfile: async (profile) => {
                console.log('Saved profile:', profile);
            },
            isCallerAdmin: async () => true,
            canAccessAdminPages: async () => true,
            canAccessFeaturesPage: async () => true,
            checkGodsEyeNetAccess: async () => ({ hasAccess: true, reason: 'Unlimited Access' }),
            checkAdvancedGodsEyeAccess: async () => ({ hasAccess: true, reason: 'System Level Access' }),
            checkIPCameraAccess: async () => ({ hasAccess: true, reason: 'Stream Authorized' }),
            getThemePreference: async () => 'dark',
            setThemePreference: async (theme) => {
                console.log('Theme set to:', theme);
            }
        };
        setActor(mockActor);
        setIsFetching(false);
    }, []);

    return { actor, isFetching };
}
