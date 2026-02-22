import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, Identity } from '@dfinity/agent';

interface AuthContextType {
    identity: Identity | null;
    agent: HttpAgent | null;
    authClient: AuthClient | null;
    isInitializing: boolean;
    isLoggingIn: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [agent, setAgent] = useState<HttpAgent | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        AuthClient.create().then(async (client) => {
            setAuthClient(client);
            const isAuth = await client.isAuthenticated();
            if (isAuth) {
                const id = client.getIdentity();
                setIdentity(id);
                const newAgent = new HttpAgent({ identity: id });
                setAgent(newAgent);
            }
            setIsInitializing(false);
        });
    }, []);

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const login = async () => {
        if (authClient) {
            setIsLoggingIn(true);
            try {
                await authClient.login({
                    identityProvider: 'https://identity.ic0.app',
                    onSuccess: () => {
                        const id = authClient.getIdentity();
                        setIdentity(id);
                        const newAgent = new HttpAgent({ identity: id });
                        setAgent(newAgent);
                        setIsLoggingIn(false);
                    },
                    onError: () => {
                        setIsLoggingIn(false);
                    }
                });
            } catch (e) {
                setIsLoggingIn(false);
                throw e;
            }
        }
    };

    const logout = async () => {
        if (authClient) {
            await authClient.logout();
            setIdentity(null);
            setAgent(null);
        }
    };

    return (
        <AuthContext.Provider value={{ identity, agent, authClient, isInitializing, isLoggingIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useInternetIdentity() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useInternetIdentity must be used within an InternetIdentityProvider');
    }
    return context;
}
