import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { _SERVICE, UserProfile } from '../backend';

interface ActorContextType {
    actor: _SERVICE | null;
    isFetching: boolean;
}

const ActorContext = createContext<ActorContextType | undefined>(undefined);

const mockUserProfile: UserProfile = {
    name: 'Trial User',
    email: 'trial@example.com',
    roles: [{ user: null }],
    tenantId: ['default-tenant'],
    createdAt: BigInt(Date.now()),
    lastLogin: BigInt(Date.now()),
    status: 'active',
    customMetadata: []
};

export function ActorProvider({ children }: { children: ReactNode }) {
    const [actor, setActor] = useState<_SERVICE | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const mockActor: any = {
            initializeAccessControl: async () => { },
            getCallerUserRole: async () => ({ user: null }),
            isCallerAdmin: async () => false,
            getCallerUserProfile: async () => [mockUserProfile],
            saveCallerUserProfile: async () => { },
            uploadVideoWithCodecDetection: async () => "Video uploaded (mock)",
            getTranscodingStatus: async () => [],
            getMyTranscodingJobs: async () => [],
            getAllTranscodingJobs: async () => [],
            getVideoMetadata: async () => [],
            getVideoFormats: async () => [],
            triggerManualTranscode: async () => "Job triggered (mock)",
            getTranscodingConfig: async () => ({
                enableAutoTranscode: true,
                targetFormats: [],
                targetCodecs: [],
                maxConcurrentJobs: BigInt(5),
                priority: BigInt(1),
                metadata: []
            }),
            submitMediaDiagnostics: async () => { },
            isStripeConfigured: async () => true,
            createCheckoutSession: async () => "https://checkout.stripe.com/mock-session",
        };
        setActor(mockActor as _SERVICE);
        setIsFetching(false);
    }, []);

    return (
        <ActorContext.Provider value={{ actor, isFetching }}>
            {children}
        </ActorContext.Provider>
    );
}

export function useActor() {
    const context = useContext(ActorContext);
    if (context === undefined) {
        throw new Error('useActor must be used within an ActorProvider');
    }
    return context;
}
