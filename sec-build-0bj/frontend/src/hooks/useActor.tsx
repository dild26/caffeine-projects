
import React, { createContext, useContext, useState, useEffect } from "react";
import { Actor } from "../backend";

interface ActorContextType {
    actor: Actor | null;
    isFetching: boolean;
}

const ActorContext = createContext<ActorContextType>({
    actor: null,
    isFetching: false,
});

export const useActor = () => useContext(ActorContext);

export const ActorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [actor, setActor] = useState<Actor | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const mockActor: Actor = {
            getCallerUserProfile: async () => ({
                name: "Admin User",
                bio: "Professional Ethereum Sandbox Explorer",
                avatar: "",
                joinedAt: Date.now()
            }),
            saveCallerUserProfile: async () => { },
            listWorkspaces: async () => [],
            saveWorkspace: async () => { },
            deleteWorkspace: async () => { },
            getCallerSubscription: async () => null,
            getCallerPaymentHistory: async () => [],
            isStripeConfigured: async () => false,
            createCheckoutSession: async () => JSON.stringify({ id: "mock", url: "#" }),
            trackExecution: async () => { },
            isCallerAdmin: async () => false,
            getAdminPages: async () => [],
            getControlledRoutes: async () => [],
            getAllRoutes: async () => ({
                autoRoutes: [],
                adminPriorityPages: [],
                controlledRoutes: [],
                pageMetadata: []
            }),
            addAdminPage: async () => { },
            addPageMetadata: async () => { },
            resolveRoute: async () => "mock",
        };
        setActor(mockActor);
        setIsFetching(false);
    }, []);

    return (
        <ActorContext.Provider value={{ actor, isFetching }}>
            {children}
        </ActorContext.Provider>
    );
};
