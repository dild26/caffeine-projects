
import React, { createContext, useContext, useState, useEffect } from "react";

interface IdentityContextType {
    identity: any;
    login: () => void;
    logout: () => void;
    clear: () => void;
    isAuthenticated: boolean;
}

const IdentityContext = createContext<IdentityContextType>({
    identity: null,
    login: () => { },
    logout: () => { },
    clear: () => { },
    isAuthenticated: false,
});

export const useInternetIdentity = () => useContext(IdentityContext);

export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [identity, setIdentity] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        const mockIdentity = {
            id: "mock-id",
            getPrincipal: () => ({
                toString: () => "mock-principal-abc-123"
            })
        };
        setIdentity(mockIdentity);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIdentity(null);
        setIsAuthenticated(false);
    };

    const clear = logout;

    return (
        <IdentityContext.Provider value={{ identity, login, logout, clear, isAuthenticated }}>
            {children}
        </IdentityContext.Provider>
    );
};
