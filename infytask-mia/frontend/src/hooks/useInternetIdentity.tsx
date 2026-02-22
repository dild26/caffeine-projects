
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InternetIdentityContextType {
    identity: any | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType | undefined>(undefined);

export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState<any | null>(null);

    useEffect(() => {
        // Check locally for a mock identity
        const saved = localStorage.getItem('mock_identity');
        if (saved) {
            setIdentity({ getPrincipal: () => ({ toText: () => saved }) });
            setIsAuthenticated(true);
        }
    }, []);

    const login = async () => {
        const mockId = 'mock-principal-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('mock_identity', mockId);
        setIdentity({ getPrincipal: () => ({ toText: () => mockId }) });
        setIsAuthenticated(true);
    };

    const logout = async () => {
        localStorage.removeItem('mock_identity');
        setIdentity(null);
        setIsAuthenticated(false);
    };

    return (
        <InternetIdentityContext.Provider value={{ identity, login, logout, isAuthenticated }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};

export const useInternetIdentity = () => {
    const context = useContext(InternetIdentityContext);
    if (context === undefined) {
        throw new Error('useInternetIdentity must be used within an InternetIdentityProvider');
    }
    return context;
};
