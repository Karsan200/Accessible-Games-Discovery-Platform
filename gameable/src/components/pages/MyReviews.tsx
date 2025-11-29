import { useEffect, useState } from "react";
import { Authentication } from "../../data/Authentication";
import { getUserIdFromToken } from "../../data/TokenUtility";
import type { ReactElement } from "react";
import "./MyReviews.css";
import { settings } from "../../AppSettings";

type GameRef = { _id?: string; title?: string };
type ReviewItem = { _id: string; rating: number; body?: string; game?: GameRef };

type MediaItem = Partial<{
    type: string;
    url: string;
}>;

export default function MyReviews(): ReactElement {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState<number>(0);
    const [editBody, setEditBody] = useState<string>("");

    const [icons, setIcons] = useState<Record<string, string>>({});
    const [editHover, setEditHover] = useState<number | null>(null);

    const placeholderIcon = "/images/type_icon.png";

    async function fetchIconForGame(gameId?: string) {
        if (!gameId) return placeholderIcon;

        try {
            const res = await fetch(
                `${settings.apiBaseUrl}/api/games/${gameId}/media?type=icon`
            );

            // If valid array
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data[0]?.url) return data[0].url;
                if (data?.url) return data.url;
            }

            // fallback general media
            const res2 = await fetch(
                `${settings.apiBaseUrl}/api/games/${gameId}/media`
            );
            if (!res2.ok) return placeholderIcon;

            const all: MediaItem[] = await res2.json();
            if (Array.isArray(all) && all.length > 0) {
                const found = all.find((m) => m?.type === "icon");
                return found?.url ?? placeholderIcon;
            }

            return placeholderIcon;
        } catch (err) {
            console.error("Failed to load icon", gameId, err);
            return placeholderIcon;
        }
    }

    const refresh = async () => {
        setLoading(true);
        try {
            const token = await Authentication.refreshToken();
            if (!token) {
                alert("You must be logged in to manage reviews.");
                return setReviews([]);
            }

            const userId = getUserIdFromToken(token);
            if (!userId) {
                alert("Invalid session.");
                return;
            }

            const res = await fetch(
                `${settings.apiBaseUrl}/api/reviews/user/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.ok) {
                alert("Failed to load your reviews.");
                return;
            }

            const data = await res.json();
            const loaded: ReviewItem[] = data.reviews ?? [];
            setReviews(loaded);

            // Load icons
            const uniqueIds = Array.from(
                new Set(
                    loaded
                        .map((r) => r.game?._id)
                        .filter((x): x is string => Boolean(x))
                )
            );

            const map: Record<string, string> = {};
            await Promise.all(
                uniqueIds.map(async (gid) => {
                    map[gid] = await fetchIconForGame(gid);
                })
            );

            setIcons(map);
        } catch (e) {
            console.error(e);
            alert("Could not load reviews.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const startEdit = (r: ReviewItem) => {
        setEditingId(r._id);
        setEditRating(r.rating);
        setEditBody(r.body ?? "");
        setEditHover(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRating(0);
        setEditBody("");
        setEditHover(null);
    };

    const saveEdit = async (reviewId: string) => {
        try {
            const token = await Authentication.refreshToken();
            if (!token) return alert("You must be logged in.");

            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            const payload = {
                user_id: userId,
                rating: Number(editRating),
                body: editBody ?? "",
            };

            const res = await fetch(
                `${settings.apiBaseUrl}/api/reviews/${reviewId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) return alert("Review invalid: please avoid special characters and keep it under 1000 characters.");

            await refresh();
            cancelEdit();
        } catch (e) {
            console.error(e);
            alert("Could not update review.");
        }
    };

    const deleteReview = async (reviewId: string) => {
        if (!confirm("Delete this review?")) return;

        try {
            const token = await Authentication.refreshToken();
            if (!token) return alert("You must be logged in.");
            const userId = getUserIdFromToken(token);
            if (!userId) return alert("Invalid session.");

            const res = await fetch(
                `${settings.apiBaseUrl}/api/reviews/${reviewId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                }
            );

            if (!res.ok) return alert("Failed to delete review.");

            await refresh();
        } catch (e) {
            console.error(e);
            alert("Could not delete review.");
        }
    };

    // Small Stars (displaying review)
    const renderStars = (value: number) => {
        const active = Math.round(value);

        return (
            <div className="stars-inline">
                {[1, 2, 3, 4, 5].map((s) => (
                    <span
                        key={s}
                        className={`star ${s <= active ? "filled" : ""}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    // Big Stars (editing review)
    const renderEditableStars = () => {
        const active = editHover ?? editRating;

        return (
            <div
                className="rm-stars edit-stars"
                onMouseLeave={() => setEditHover(null)}
            >
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`rm-star ${s <= active ? "filled" : ""}`}
                        onClick={() => setEditRating(s)}
                        onMouseEnter={() => setEditHover(s)}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    if (loading) return <p>Loading your reviews...</p>;

    return (
        <div className="container my-4 my-reviews-page">
            <h2 className="my-reviews-title">My Reviews</h2>

            {reviews.length === 0 && <p>You haven't submitted any reviews yet.</p>}

            <div className="reviews-grid">
                {reviews.map((r) => (
                    <div key={r._id} className="review-card">
                        <div className="review-left">
                            <img
                                src={
                                    r.game?._id
                                        ? icons[r.game._id] ?? placeholderIcon
                                        : placeholderIcon
                                }
                                alt={r.game?.title ?? "game icon"}
                                className="review-icon"
                            />
                        </div>

                        <div className="review-main">
                            <div className="review-header">
                                <div className="game-title">
                                    {r.game?.title ?? "Unknown Game"}
                                </div>
                                <div className="rating-visual">
                                    {renderStars(r.rating)}
                                </div>
                            </div>

                            {editingId === r._id ? (
                                <div className="edit-panel">
                                    {renderEditableStars()}

                                    <label
                                        className="edit-label"
                                        htmlFor={`editBody_${r._id}`}
                                    >
                                        Review
                                    </label>

                                    <textarea
                                        id={`editBody_${r._id}`}
                                        className="rm-textarea edit-textarea"
                                        rows={4}
                                        value={editBody}
                                        onChange={(e) =>
                                            setEditBody(e.target.value)
                                        }
                                    />

                                    <div className="rm-actions edit-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary btn-spacing-left"
                                            onClick={() => saveEdit(r._id)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="review-body">{r.body ?? <em>No text</em>}</p>
                            )}
                        </div>

                        <div className="review-actions">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => startEdit(r)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn delete-btn-colors"
                                onClick={() => deleteReview(r._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
