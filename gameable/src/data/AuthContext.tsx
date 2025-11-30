import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Authentication } from "./Authentication.ts";
import { settings } from "../AppSettings";

type Prefs = {
    voiceNavEnabled: boolean;
    voiceNavLeft: boolean;
};

export type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;

    prefs: Prefs;
    setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [prefs, setPrefs] = useState<Prefs>({
        voiceNavEnabled: true,
        voiceNavLeft: false,
    });

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

                const updatedPrefs: Prefs = {
                    voiceNavEnabled: user.voiceNavigation,
                    voiceNavLeft: user.navigationLocation,

                };

                setPrefs(updatedPrefs);

                // Apply font based on user preference
                if (user.fontType === true) {
                    document.body.classList.add("dyslexic-font");
                } else {
                    document.body.classList.remove("dyslexic-font");
                }
            } catch (error) {
                console.error("Error loading user preferences:", error);
                document.body.classList.remove("dyslexic-font");
            }
        }

        // Run only once on app load
        void initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, prefs, setPrefs }}>
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
