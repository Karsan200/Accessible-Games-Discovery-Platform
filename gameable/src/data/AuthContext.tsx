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

    function applyFontClass(enabled: boolean) {
        if (enabled) document.body.classList.add("dyslexic-font");
        else document.body.classList.remove("dyslexic-font");
    }

    function applyFontSizeClass(enabled: boolean) {
        document.body.classList.remove("default-font", "large-font");
        if (enabled) document.body.classList.add("large-font");
        else document.body.classList.add("default-font");
    }

    // Load token on app start and apply dyslexic/font-size if enabled
    useEffect(() => {
        async function initAuth() {
            // Get refreshed token
            const newToken = await Authentication.refreshToken();
            setAccessToken(newToken);

            // if no token then user logged out and ensure default font classes
            if (!newToken) {
                applyFontClass(false);
                applyFontSizeClass(false);
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
                    // If user could not be loaded, reset font classes
                    applyFontClass(false);
                    applyFontSizeClass(false);
                    return;
                }

                const user = await res.json();

                // Apply font based on user preference
                applyFontClass(user.fontType === true);
                applyFontSizeClass(user.fontSize === true);
            } catch (error) {
                console.error("Error loading user font preference:", error);
                applyFontClass(false);
                applyFontSizeClass(false);
            }
        }

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
