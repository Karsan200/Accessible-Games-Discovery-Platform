import { useEffect, useState } from "react";
import {settings} from "../../AppSettings.ts"

type Publisher = { _id: string; name: string };

type Props = {
    value: string;                  // selected publisher _id OR "__NEW__"
    onChange: (idOrNewFlag: string) => void;
};

const NEW_VALUE = "__NEW__";

export default function PublisherSelect({ value, onChange }: Props) {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // Local state for the inline "new publisher" form
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string>("");

    // Fetch publishers once
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError("");
        fetch("/api/publishers")
            .then(async (res) => {
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    const msg = body?.error || `HTTP ${res.status}`;
                    throw new Error(msg);
                }
                return res.json();
            })
            .then((data: Publisher[]) => {
                if (mounted) setPublishers(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (mounted) setError(String(err?.message || err));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);


    async function handleCreatePublisher() {
        setCreating(true);
        setCreateError("");

        if (!newName.trim() || !newEmail.trim()) {
            setCreateError("Name and Email are required.");
            setCreating(false);
            return;
        }

        try {
            const res = await fetch(`${settings.apiBaseUrl}/api/publishers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: newName.trim(),
                    email: newEmail.trim(),
                    description: newDescription.trim(),
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.error || `HTTP ${res.status}`);
            }

            const payload = await res.json();
            const created = payload?.publisher;
            if (!created?._id) throw new Error("Server did not return new publisher ID.");

            setPublishers((prev) => [created, ...prev]);
            onChange(created._id);

            setNewName("");
            setNewEmail("");
            setNewDescription("");
        } catch (err: any) {
            setCreateError(String(err.message || err));
        } finally {
            setCreating(false);
        }
    }


    if (loading) {
        return (
            <div>
                <select disabled>
                    <option>Loading publishers…</option>
                </select>
            </div>
        );
    }

    return (
        <div style={{ display: "grid", gap: "8px" }}>
            {error ? (
                <>
                    <select disabled>
                        <option>Error loading publishers</option>
                    </select>
                    <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
                </>
            ) : (
                <>
                    {/* Dropdown with the "New Publisher…" option on top */}
                    <select
                        aria-label="Publisher"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value={NEW_VALUE}>+ New Publisher…</option>
                        <option value="">Select Publisher</option>
                        {publishers.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    {/* Inline creation form appears only when "New Publisher…" is selected */}
                    {value === NEW_VALUE && (
                        <div
                            style={{
                                border: "1px solid #ddd",
                                padding: "12px",
                                borderRadius: "6px",
                            }}
                        >
                            <div style={{ marginBottom: "8px" }}>
                                <label style={{ display: "block" }}>Name (required):</label>
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Publisher name"
                                />
                            </div>

                            <div style={{ marginBottom: "8px" }}>
                                <label style={{ display: "block" }}>Email (required):</label>
                                <input
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="contact@example.com"
                                />
                            </div>

                            <div style={{ marginBottom: "8px" }}>
                                <label style={{ display: "block" }}>Description (optional):</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Company info"
                                    rows={3}
                                />
                            </div>

                            {createError && (
                                <div style={{ color: "red", fontSize: "0.9rem", marginBottom: "8px" }}>
                                    {createError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleCreatePublisher}
                                disabled={creating}
                            >
                                {creating ? "Creating…" : "Create Publisher"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
