import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Principal } from '../backend';

const MOCK_PRINCIPAL: Principal = {
    toText: () => '2vxsx-fae',
};

interface InternetIdentityContextType {
    identity: any;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

export const InternetIdentityContext = createContext<InternetIdentityContextType | null>(null);

export function useInternetIdentity() {
    const context = useContext(InternetIdentityContext);
    if (!context) {
        throw new Error('useInternetIdentity must be used within an InternetIdentityProvider');
    }
    return context;
}

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
    const [identity, setIdentity] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Simulate auto-login for development
        login();
    }, []);

    const login = () => {
        setIdentity({
            getPrincipal: () => MOCK_PRINCIPAL,
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIdentity(null);
        setIsAuthenticated(false);
    };

    const value = {
        identity,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <InternetIdentityContext.Provider value= { value } >
        { children }
        </InternetIdentityContext.Provider>
  );
}
