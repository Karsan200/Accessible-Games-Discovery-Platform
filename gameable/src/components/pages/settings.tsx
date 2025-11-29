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
    voiceNavEnabled?: boolean;
    voiceNavLeft?: boolean;
};

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [fontType, setFontType] = useState(false);
    const [fontSize, setFontSize] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [voiceNavEnabled, setVoiceNavEnabled] = useState(false);
    const [voiceNavLeft, setVoiceNavLeft] = useState(false);

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

    function applyVoiceNavToggle(enabled: boolean) {
        const vnBox = document.querySelector(".vn-box") as HTMLElement;
        if (!vnBox) return;

        vnBox.classList.toggle("vn-hidden", enabled);
    }

    function applyVoiceNavLocation(leftSide: boolean) {
        const vnBox = document.querySelector(".vn-box") as HTMLElement;
        if (!vnBox) return;

        vnBox.classList.remove("vn-left", "vn-right");
        vnBox.classList.add(leftSide ? "vn-left" : "vn-right");
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
                    applyVoiceNavToggle(false);
                    applyVoiceNavLocation(false);
                    setFontType(false);
                    setFontSize(false);
                    setVoiceNavEnabled(false);
                    setVoiceNavLeft(false);
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
                    applyVoiceNavToggle(false);
                    applyVoiceNavLocation(false);
                    setFontType(false);
                    setFontSize(false);
                    setVoiceNavEnabled(false);
                    setVoiceNavLeft(false);
                    setLoading(false);
                    return;
                }

                const data: UserPayload = await res.json();
                if (!mounted) return;

                setFontType(Boolean(data.fontType));
                applyFontClass(Boolean(data.fontType));

                setFontSize(Boolean(data.fontSize));
                applyFontSizeClass(Boolean(data.fontSize));

                setVoiceNavEnabled(Boolean(data.voiceNavEnabled));
                applyVoiceNavToggle(Boolean(data.voiceNavEnabled));
                console.log("Voice Nav Enabled", (Boolean(data.voiceNavEnabled)));

                setVoiceNavLeft(Boolean(data.voiceNavLeft));
                applyVoiceNavLocation(Boolean(data.voiceNavLeft));
                console.log("Voice Nav Location", (Boolean(data.voiceNavLeft)));

            } catch (err) {
                console.error("Settings load error:", err);
                applyFontClass(false);
                applyFontSizeClass(false);
                applyVoiceNavToggle(false);
                applyVoiceNavLocation(false);
                setFontType(false);
                setFontSize(false);
                setVoiceNavEnabled(false);
                setVoiceNavLeft(false);
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

    async function toggleVoiceNav() {
        const next = !voiceNavEnabled;
        setVoiceNavEnabled(next);
        applyVoiceNavToggle(next);

        try {
            const authToken = token ?? (await Authentication.refreshToken());
            if (!authToken) throw new Error("Not logged in");

            const res = await fetch(`${apiBase}/api/users/me/voiceNav`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                credentials: "include",
                body: JSON.stringify({ voiceNavigation: next }),
            });

            console.log("Voice Nav", res.json())

            if (!res.ok) throw new Error(`Failed to save voiceNav preference: ${res.status}`);
        } catch (err) {
            console.error(err);
            setVoiceNavEnabled(!next);
            applyVoiceNavToggle(!next);
        }
    }

    async function toggleNavLocation() {
        const next = !voiceNavLeft;
        setVoiceNavLeft(next);
        applyVoiceNavLocation(next);

        try {
            const authToken = token ?? (await Authentication.refreshToken());
            if (!authToken) throw new Error("Not logged in");

            const res = await fetch(`${apiBase}/api/users/me/voiceNavLocation`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                credentials: "include",
                body: JSON.stringify({ navigationLocation: next }),
            });

            if (!res.ok) throw new Error(`Failed to save voiceNav preference: ${res.status}`);
        } catch (err) {
            console.error(err);
            setVoiceNavLeft(!next);
            applyVoiceNavLocation(!next);
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

            <h2>Voice Navigation Settings</h2>
            {/* Voice Nav Settings */}
            <div className="setting-row">
                <div className="setting-info">
                    <p className="setting-title">Voice Navigation</p>
                    <p className="setting-description">Toggle to turn off the voice navigation module.</p>
                </div>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={voiceNavEnabled}
                        onChange={() => void toggleVoiceNav()}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Voice Nav Location */}
            <div className="setting-row">
                <div className="setting-info">
                    <p className="setting-title">Voice Nav Location</p>
                    <p className="setting-description">Toggle to move the voice navigations location from right to left.</p>
                </div>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={voiceNavLeft}
                        onChange={() => void toggleNavLocation()}
                        />
                    <span className="slider"></span>
                </label>
            </div>

            {/*/!* Voice Navigation Information *!/*/}
            {/*<div className="setting-row">*/}

            {/*</div>*/}
        </div>
    );
}
