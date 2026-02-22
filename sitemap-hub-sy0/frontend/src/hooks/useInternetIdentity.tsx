import { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';

interface InternetIdentityContextType {
    identity: any;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    isLoggingIn: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType>({
    identity: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    isLoggingIn: false,
});

export const InternetIdentityProvider = ({ children }: { children: React.ReactNode }) => {
    const [identity, setIdentity] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        // Mock init
        setIsAuthenticated(false);
    }, []);

    const login = async () => {
        setIsLoggingIn(true);
        setTimeout(() => {
            setIsAuthenticated(true);
            setIsLoggingIn(false);
            // Mock identity
            setIdentity({ getPrincipal: () => ({ toText: () => "mock-principal-id" }) });
        }, 1000);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIdentity(null);
    };

    return (
        <InternetIdentityContext.Provider value={{ identity, isAuthenticated, login, logout, isLoggingIn }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};

export const useInternetIdentity = () => useContext(InternetIdentityContext);
