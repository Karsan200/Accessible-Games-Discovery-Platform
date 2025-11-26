import { useEffect, useState } from "react";
import { Authentication } from "../../data/Authentication.ts";
import { ApiDataHelper } from "../../data/ApiDataHelper.tsx";
import { getUserIdFromToken } from "../../data/TokenUtility.ts"
import { WishlistGameCard } from "../WishlistGameCard.tsx";
import { IconCheckbox } from "../IconCheckbox.tsx";
import { BlackButton } from "../BlackButton.tsx";

// --- Interfaces ---
interface Game {
    title: string;
    body?: string;
}

interface Media {
    type: string;
    url: string;
}

interface WishlistItem {
    _id: string;
    weight: number;
    game_id: Game;
    media?: Media[];
    removed_at?: string | null;
}

export function Wishlist() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initAuth() {
            const token = await Authentication.refreshToken();
            setAccessToken(token);
        }
        void initAuth();
    }, []);

    const userId = getUserIdFromToken(accessToken);
    const auth = { accessToken, setAccessToken };
    // Helper: common headers with auth
    const authHeaders = () => ({
        "Content-Type": "application/json",
        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
    });

    // Load wishlist
    async function loadWishlist() {
        if (!userId || !accessToken) return;
        setLoading(true);
        try {
            const res = await ApiDataHelper(`/wishlist/${userId}`, { method: "GET", headers: authHeaders() }, auth);
            const data: WishlistItem[] = await res.json();
            setWishlist(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadWishlist();
    }, [userId, accessToken]);

    // Soft delete
    function softRemove(id: string) {
        fetch(`http://localhost:5000/wishlist/${id}`, { method: "DELETE", headers: authHeaders() })
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Hard delete
    function hardRemove(id: string) {
        fetch(`http://localhost:5000/wishlist/${id}?hard=true`, { method: "DELETE", headers: authHeaders() })
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Restore last removed
    function restoreLast() {
        fetch(`http://localhost:5000/wishlist/restore-last/${userId}`, {
            method: "PUT",
            headers: authHeaders()
        })
            .then((res) => res.json())
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Update weight
    function updateWeight(id: string, weight: number) {
        fetch(`http://localhost:5000/wishlist/${id}/weight`, {
            method: "PATCH",
            headers: authHeaders(),
            body: JSON.stringify({ weight }),
        })
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Move up
    function moveUp(index: number) {
        if (index === 0) return;
        const newWishlist = [...wishlist];
        const current = newWishlist[index];
        const above = newWishlist[index - 1];

        // Swap weights
        const tempWeight = current.weight;
        current.weight = above.weight;
        above.weight = tempWeight;

        updateWeight(current._id, current.weight);
        updateWeight(above._id, above.weight);

        setWishlist(newWishlist.sort((a, b) => a.weight - b.weight));
    }

    // Move down
    function moveDown(index: number) {
        if (index === wishlist.length - 1) return;
        const newWishlist = [...wishlist];
        const current = newWishlist[index];
        const below = newWishlist[index + 1];

        // Swap weights
        const tempWeight = current.weight;
        current.weight = below.weight;
        below.weight = tempWeight;

        updateWeight(current._id, current.weight);
        updateWeight(below._id, below.weight);

        setWishlist(newWishlist.sort((a, b) => a.weight - b.weight));
    }

    if (loading) return <p>Loading wishlist...</p>;

    return (
        <div className="wishlist-page">

            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <div className="wishlist-header-right">
                    <p className="wishlist-subtitle">
                        Your saved games, all in one place. Explore, track, and manage your favourites.
                    </p>
                    <BlackButton text="Undo" onClick={restoreLast} />
                </div>
            </div>

            {/* Wishlist Items */}
            <div className="wishlist-container">
                {wishlist.map((item, index) => {
                    const game = item.game_id;
                    const cover = item.media?.find((m) => m.type === "cover")?.url;

                    return (
                        <div
                            key={item._id}
                            className="wishlist-item d-flex align-items-center justify-content-between mb-4"
                        >
                            <WishlistGameCard
                                image={cover || ""}
                                name={game.title}
                                description={game.body || "No description available."}
                            />

                            <div className="wishlist-actions d-flex flex-column gap-1 ms-0">
                                <BlackButton text="↑" onClick={() => moveUp(index)} />
                                <BlackButton text="↓" onClick={() => moveDown(index)} />
                                <IconCheckbox
                                    text="⌫"
                                    checked={false}
                                    onChange={(checked) => {
                                        if (checked) softRemove(item._id);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}