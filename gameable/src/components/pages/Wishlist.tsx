import { useEffect, useState } from "react";
import { WishlistGameCard } from "../WishlistGameCard.tsx";
import { IconCheckbox } from "../IconCheckbox.tsx";

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

export default function Wishlist() {
    const userId = "1"; // TODO: THIS IS A HARDCODED VALUE AT THE MOMENT
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load wishlist
    function loadWishlist() {
        fetch(`http://localhost:5000/api/wishlist/${userId}`)
            .then((res) => res.json())
            .then((data: WishlistItem[]) => {
                setWishlist(data);
                setLoading(false);
            })
            .catch(console.error);
    }

    useEffect(() => {
        loadWishlist();
    }, []);

    // Soft delete
    function softRemove(id: string) {
        fetch(`http://localhost:5000/api/wishlist/${id}`, { method: "DELETE" })
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Hard delete
    function hardRemove(id: string) {
        fetch(`http://localhost:5000/api/wishlist/${id}?hard=true`, { method: "DELETE" })
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Restore last removed
    function restoreLast() {
        fetch(`http://localhost:5000/api/wishlist/restore-last/${userId}`, {
            method: "PUT",
        })
            .then((res) => res.json())
            .then(() => loadWishlist())
            .catch(console.error);
    }

    // Update weight
    function updateWeight(id: string, weight: number) {
        fetch(`http://localhost:5000/api/wishlist/${id}/weight`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
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

            {/* --- Wishlist Header Banner --- */}
            <div className="wishlist-header">
                <h1>My Wishlist</h1>

                <p className="wishlist-subtitle">
                    Your saved games, all in one place. Explore, track, and manage your favourites.
                </p>

                <div style={{ marginTop: "20px" }}>
                    {wishlist.map((item: any) => {
                        const game = item.game_id;

                        // Find cover
                        const cover = item.media?.find(
                            (m: any) => m.type === "cover"
                        )?.url;

                        return (
                            <WishlistGameCard
                                key={item._id}
                                image={cover}
                                name={game.title}
                                description={game.body || "No description available."}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
