import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Authentication } from "./Authentication.ts";
import { settings } from "../AppSettings";

export type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Load token on app start and apply dyslexic font if enabled
    useEffect(() => {
        async function initAuth() {
            // Get refreshed token
            const newToken = await Authentication.refreshToken();
            setAccessToken(newToken);

            // if no token then user logged out and ensure default font
            if (!newToken) {
                document.body.classList.remove("dyslexic-font");
                return;
            }

            // Fetch user preferences
            try {
                const res = await fetch(settings.apiBaseUrl + "/api/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    // If user could not be loaded, remove dyslexic font
                    document.body.classList.remove("dyslexic-font");
                    return;
                }

                const user = await res.json();

                // Apply font based on user preference
                if (user.fontType === true) {
                    document.body.classList.add("dyslexic-font");
                } else {
                    document.body.classList.remove("dyslexic-font");
                }
            } catch (error) {
                console.error("Error loading user font preference:", error);
                document.body.classList.remove("dyslexic-font");
            }
        }

        // Run only once on app load
        void initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth() - access authentication context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used inside an AuthProvider");
    return context;
}
