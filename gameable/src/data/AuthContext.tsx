import {createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import {Authentication} from "./Authentication.ts";

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Check if the user is authenticated
    useEffect(() => {
        // Has to be an inner function to be async
        async function initAuth() {
            setAccessToken(await Authentication.refreshToken())
        }

        // Initialize authentication on mount
        void initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used inside an AuthProvider");
    return context;
}