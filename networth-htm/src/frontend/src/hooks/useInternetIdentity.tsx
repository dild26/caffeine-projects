import React, { createContext, useContext, ReactNode } from 'react';

interface InternetIdentityContextType {
    identity: any;
    login: () => Promise<void>;
    clear: () => Promise<void>;
    loginStatus: 'idle' | 'logging-in' | 'success' | 'error';
}

const InternetIdentityContext = createContext<InternetIdentityContextType | null>(null);

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
    const value = {
        identity: null,
        login: async () => { },
        logout: async () => { },
        isAuthenticated: true,
        clear: async () => { },
        loginStatus: 'idle' as const,
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
