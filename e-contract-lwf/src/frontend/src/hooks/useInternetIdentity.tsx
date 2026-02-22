import React, { createContext, useContext, ReactNode } from 'react';

interface InternetIdentityContextType {
    identity: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isInitializing: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType | null>(null);

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
    const value = {
        identity: null,
        login: async () => { },
        logout: async () => { },
        isAuthenticated: true,
        isInitializing: false,
    };

    return (
        <InternetIdentityContext.Provider value={value}>
            {children}
        </InternetIdentityContext.Provider>
    );
}

export function useInternetIdentity() {
    const context = useContext(InternetIdentityContext);
    if (!context) {
        throw new Error('useInternetIdentity must be used within InternetIdentityProvider');
    }
    return context;
}
