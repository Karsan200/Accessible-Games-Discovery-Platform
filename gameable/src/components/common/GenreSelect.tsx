import { useEffect, useState } from "react";
import {settings} from "../../AppSettings.ts";

type Genre = { _id: string; name: string };

type Props = {
    selected: string[]; // array of genre IDs
    onChange: (ids: string[]) => void;
};

export default function GenreSelect({ selected, onChange }: Props) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showNewForm, setShowNewForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError("");

        const loadGenres = async () => {
            try {
                const res = await fetch(`${settings.apiBaseUrl}/api/genres`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    // Try to parse JSON error body, but treat it as unknown
                    let body: unknown = null;
                    try {
                        body = await res.json();
                    } catch {
                        // ignore JSON parse errors – keep body as null
                    }

                    let msg: string;

                    // Safely check for a string `error` property
                    if (
                        body &&
                        typeof body === "object" &&
                        "error" in body &&
                        typeof (body as { error: unknown }).error === "string"
                    ) {
                        msg = (body as { error: string }).error;
                    } else if (res.status === 401) {
                        msg = "You are not authorised to load genres.";
                    } else {
                        msg = `HTTP ${res.status}`;
                    }

                    throw new Error(msg);
                }

                const data = (await res.json()) as Genre[];

                if (mounted) {
                    setGenres(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void loadGenres();

        return () => {
            mounted = false;
        };
    }, []);


    function toggleGenre(id: string) {
        if (selected.includes(id)) {
            onChange(selected.filter((g) => g !== id));
        } else {
            onChange([...selected, id]);
        }
    }

    async function handleCreateGenre() {
        setCreating(true);
        setCreateError("");
        if (!newName.trim()) {
            setCreateError("Name is required");
            setCreating(false);
            return;
        }
        try {
            const res = await fetch("/api/genres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // if cookies are used
                body: JSON.stringify({ name: newName.trim(), description: newDescription.trim() }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const payload = await res.json();
            const created = payload.genre;
            setGenres((prev) => [...prev, created]);
            onChange([...selected, created._id]);
            setNewName("");
            setNewDescription("");
            setShowNewForm(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setCreateError(msg);
        } finally {
            setCreating(false);
        }
    }

    if (loading) return <div>Loading genres...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div style={{ display: "grid", gap: "8px" }}>
            <div>
                {genres.map((genre) => (
                    <label key={genre._id} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={selected.includes(genre._id)}
                            onChange={() => toggleGenre(genre._id)}
                        />
                        {genre.name}
                    </label>
                ))}
            </div>
            <button type="button" onClick={() => setShowNewForm(!showNewForm)}>
                {showNewForm ? "Cancel" : "+ New Genre"}
            </button>
            {showNewForm && (
                <div style={{ border: "1px solid #ccc", padding: "8px", marginTop: "8px" }}>
                    <input
                        placeholder="Genre name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    {createError && <div style={{ color: "red" }}>{createError}</div>}
                    <button type="button" onClick={handleCreateGenre} disabled={creating}>
                        {creating ? "Creating..." : "Create Genre"}
                    </button>
                </div>
            )}
        </div>
    );
}
