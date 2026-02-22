import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';

interface InternetIdentityContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    authClient: AuthClient | null;
    identity: any;
    isInitializing: boolean;
    loginStatus: string;
    clear: () => void;
}

const InternetIdentityContext = createContext<InternetIdentityContextType | null>(null);

export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        AuthClient.create().then(async (client) => {
            setAuthClient(client);
            const isAuth = await client.isAuthenticated();
            setIsAuthenticated(isAuth);
            setIdentity(client.getIdentity());
            setIsInitializing(false);
        });
    }, []);

    const login = async () => {
        if (authClient) {
            await authClient.login({
                onSuccess: () => {
                    setIsAuthenticated(true);
                    setIdentity(authClient.getIdentity());
                },
            });
        }
    };

    const logout = async () => {
        if (authClient) {
            await authClient.logout();
            setIsAuthenticated(false);
            setIdentity(null);
        }
    };

    const clear = () => {
        setIsAuthenticated(false);
        setIdentity(null);
    };

    return (
        <InternetIdentityContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            authClient,
            identity,
            isInitializing,
            loginStatus: isAuthenticated ? 'authenticated' : 'idle',
            clear
        }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};

export const useInternetIdentity = () => {
    const context = useContext(InternetIdentityContext);
    if (!context) {
        throw new Error('useInternetIdentity must be used within an InternetIdentityProvider');
    }
    return context;
};
