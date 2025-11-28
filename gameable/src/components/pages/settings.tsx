import { useEffect, useState } from "react";
import { Authentication } from "../../data/Authentication";
import { settings } from "../../AppSettings";
import "./Settings.css";

type UserPayload = {
    _id?: string;
    username?: string;
    email?: string;
    fontType?: boolean;
    fontSize?: boolean;
};

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [fontType, setFontType] = useState(false);
    const [fontSize, setFontSize] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const apiBase = settings?.apiBaseUrl ?? "http://localhost:5000";

    // Apply global classes
    function applyFontClass(enabled: boolean) {
        if (enabled) document.body.classList.add("dyslexic-font");
        else document.body.classList.remove("dyslexic-font");
    }
    function applyFontSizeClass(enabled: boolean) {
        document.body.classList.remove("default-font", "large-font");
        if (enabled) document.body.classList.add("large-font");
        else document.body.classList.add("default-font");
    }

    // Load user settings
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
                    applyFontSizeClass(false);
                    setFontType(false);
                    setFontSize(false);
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
                    console.warn("Failed to fetch user:", res.status);
                    applyFontClass(false);
                    applyFontSizeClass(false);
                    setFontType(false);
                    setFontSize(false);
                    setLoading(false);
                    return;
                }

                const data: UserPayload = await res.json();
                if (!mounted) return;

                setFontType(Boolean(data.fontType));
                applyFontClass(Boolean(data.fontType));

                setFontSize(Boolean(data.fontSize));
                applyFontSizeClass(Boolean(data.fontSize));
            } catch (err) {
                console.error("Settings load error:", err);
                applyFontClass(false);
                applyFontSizeClass(false);
                setFontType(false);
                setFontSize(false);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        void load();
        return () => { mounted = false; };
    }, [apiBase]);

    // Toggle handlers
    async function toggleFontType() {
        const next = !fontType;
        setFontType(next);
        applyFontClass(next);

        try {
            const authToken = token ?? (await Authentication.refreshToken());
            if (!authToken) throw new Error("Not logged in");

            const res = await fetch(`${apiBase}/api/users/me/font`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                credentials: "include",
                body: JSON.stringify({ fontType: next }),
            });

            if (!res.ok) throw new Error(`Failed to save fontType: ${res.status}`);
        } catch (err) {
            console.error(err);
            setFontType(!next);
            applyFontClass(!next);
        }
    }

    async function toggleFontSize() {
        const next = !fontSize;
        setFontSize(next);
        applyFontSizeClass(next);

        try {
            const authToken = token ?? (await Authentication.refreshToken());
            if (!authToken) throw new Error("Not logged in");

            const res = await fetch(`${apiBase}/api/users/me/fontSize`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                credentials: "include",
                body: JSON.stringify({ fontSize: next }),
            });

            if (!res.ok) throw new Error(`Failed to save fontSize: ${res.status}`);
        } catch (err) {
            console.error(err);
            setFontSize(!next);
            applyFontSizeClass(!next);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            {/* Dyslexic Font */}
            <div className="setting-row">
                <div className="setting-info">
                    <p className="setting-title">Dyslexic font (OpenDyslexic)</p>
                    <p className="setting-description">Toggle to use a dyslexia-friendly typeface across the site.</p>
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

            {/* Font Size */}
            <div className="setting-row">
                <div className="setting-info">
                    <p className="setting-title">Large Font Size</p>
                    <p className="setting-description">Toggle to use larger font size across the site.</p>
                </div>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={fontSize}
                        onChange={() => void toggleFontSize()}
                    />
                    <span className="slider"></span>
                </label>
            </div>
        </div>
    );
}
