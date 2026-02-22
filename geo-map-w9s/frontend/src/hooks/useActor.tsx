import { createContext, useContext, useEffect, useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useInternetIdentity } from './useInternetIdentity';

// Define a minimal interface for the actor to satisfy useQueries.ts
// In a real app, this would come from the generated declarations
interface BackendActor {
    getCallerUserProfile: () => Promise<any>;
    saveCallerUserProfile: (profile: any) => Promise<any>;
    isCallerAdmin: () => Promise<boolean>;
    getPages: () => Promise<string[]>;
    addPage: (page: string) => Promise<any>;
    removePage: (page: string) => Promise<any>;
    getSitemap: () => Promise<any[]>;
    getPageAuditLog: () => Promise<any[]>;
    getControlledRoutes: () => Promise<any[]>;
    createPin: (pin: any) => Promise<any>;
    getUserPins: (principal: any) => Promise<any[]>;
    createPolygon: (polygon: any) => Promise<any>;
    getUserPolygons: (principal: any) => Promise<any[]>;
    getManifestLog: () => Promise<any[]>;
    isStripeConfigured: () => Promise<boolean>;
    setStripeConfiguration: (config: any) => Promise<any>;
    createCheckoutSession: (items: any[], successUrl: string, cancelUrl: string) => Promise<string>;
    createImageAdjustment: (adjustment: any) => Promise<any>;
    getUserImageAdjustments: (principal: any) => Promise<any[]>;
    saveImageAdjustmentPermanently: (id: string) => Promise<any>;
    convertToECEF: (lat: number, lon: number, alt: number) => Promise<any>;
    convertToWebMercator: (lat: number, lon: number) => Promise<any>;
}

interface ActorContextType {
    actor: BackendActor | null;
    isFetching: boolean;
}

const ActorContext = createContext<ActorContextType>({ actor: null, isFetching: false });

export const ActorProvider = ({ children }: { children: React.ReactNode }) => {
    const { identity, isAuthenticated } = useInternetIdentity();
    const [actor, setActor] = useState<BackendActor | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const initActor = async () => {
            setIsFetching(true);
            try {
                const agent = new HttpAgent({ identity });

                if (process.env.NODE_ENV !== 'production') {
                    await agent.fetchRootKey();
                }

                // Mock actor if declarations are missing
                // In reality, you would import { createActor } from '../../declarations/backend';
                // const newActor = createActor(process.env.CANISTER_ID_BACKEND, { agent });

                // For now, allow null or partial mock to unblock UI
                // We will create a dummy actor that returns empty data for now
                const mockActor: BackendActor = {
                    getCallerUserProfile: async () => null,
                    saveCallerUserProfile: async () => { },
                    isCallerAdmin: async () => false,
                    getPages: async () => [],
                    addPage: async () => { },
                    removePage: async () => { },
                    getSitemap: async () => [],
                    getPageAuditLog: async () => [],
                    getControlledRoutes: async () => [],
                    createPin: async () => { },
                    getUserPins: async () => [],
                    createPolygon: async () => { },
                    getUserPolygons: async () => [],
                    getManifestLog: async () => [],
                    isStripeConfigured: async () => false,
                    setStripeConfiguration: async () => { },
                    createCheckoutSession: async () => "{}",
                    createImageAdjustment: async () => { },
                    getUserImageAdjustments: async () => [],
                    saveImageAdjustmentPermanently: async () => { },
                    convertToECEF: async (lat, lon, alt) => ({ x: 0, y: 0, z: 0 }),
                    convertToWebMercator: async (lat, lon) => ({ x: 0, y: 0 })
                };

                setActor(mockActor);
            } catch (error) {
                console.error("Failed to initialize actor:", error);
            } finally {
                setIsFetching(false);
            }
        };

        if (identity) {
            initActor();
        }
    }, [identity]);

    return (
        <ActorContext.Provider value={{ actor, isFetching }}>
            {children}
        </ActorContext.Provider>
    );
};

export const useActor = () => useContext(ActorContext);
