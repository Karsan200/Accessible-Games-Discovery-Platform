import { useEffect, useState } from "react";
import { Authentication } from "../../data/Authentication";
import { settings } from "../../AppSettings";
import "./Settings.css";

type UserPayload = {
    _id?: string;
    username?: string;
    email?: string;
    fontType?: boolean;
};

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [fontType, setFontType] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const apiBase = settings?.apiBaseUrl ?? "http://localhost:5000";

    // helper to apply/remove class globally
    function applyFontClass(enabled: boolean) {
        if (enabled) document.body.classList.add("dyslexic-font");
        else document.body.classList.remove("dyslexic-font");
    }

    // On load refresh token and fetch user
    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            try {
                const newToken = await Authentication.refreshToken();
                if (!mounted) return;

                setToken(newToken);
                if (!newToken) {
                    applyFontClass(false);
                    setFontType(false);
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${apiBase}/api/users/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    console.warn("Failed to fetch current user:", res.status);
                    applyFontClass(false);
                    setFontType(false);
                    setLoading(false);
                    return;
                }

                const data: UserPayload = await res.json();
                if (!mounted) return;

                const pref = Boolean(data.fontType);
                setFontType(pref);
                applyFontClass(pref);
            } catch (err) {
                console.error("Settings load error:", err);
                applyFontClass(false);
                setFontType(false);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        void load();
        return () => {
            mounted = false;
        };
    }, [apiBase]);

    // Toggle handler - flips value and persists to server
    async function toggleFontType() {
        const next = !fontType;
        setFontType(next);
        applyFontClass(next);

        try {
            const authToken = token ?? (await Authentication.refreshToken());
            setToken(authToken);

            if (!authToken) {
                alert("You must be logged in to change this setting.");
                setFontType(!next);
                applyFontClass(!next);
                return;
            }

            const res = await fetch(`${apiBase}/api/users/me/font`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                credentials: "include",
                body: JSON.stringify({ fontType: next }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                console.error("Failed to save font preference:", res.status, text);
                alert("Could not save preference. See console for details.");
                setFontType(!next);
                applyFontClass(!next);
                return;
            }

            const updated = await res.json();
            const persisted = Boolean(updated.fontType);
            setFontType(persisted);
            applyFontClass(persisted);
        } catch (err) {
            console.error("Error toggling fontType:", err);
            alert("Error saving preference. See console.");
            setFontType(!next);
            applyFontClass(!next);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            {/* Dyslexic Font Setting */}
            <div className="setting-row">
                <div className="setting-info">
                    <p className="setting-title">Dyslexic font (OpenDyslexic)</p>
                    <p className="setting-description">
                        Toggle to use a dyslexia-friendly typeface across the site.
                    </p>
                </div>

                <label className="switch">
                    <input
                        type="checkbox"
                        checked={fontType}
                        onChange={() => void toggleFontType()}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Font Size Setting */}
            <div className="setting-row dummy">
                <div className="setting-info">
                    <p className="setting-title">Font Size</p>
                    <p className="setting-description">Toggle to use a larger font size across the site.</p>
                </div>

                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                </label>
            </div>
        </div>
    );
}
