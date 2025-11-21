import { useEffect, useState } from "react";
import { WishlistGameCard } from "../components/WishlistGameCard.tsx";
import { IconCheckbox } from "../components/IconCheckbox.tsx";

export default function Wishlist() {
    const userId = "1"; // TODO: THIS IS A HARDCODED VALUE AT THE MOMENT
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load wishlist
    function loadWishlist() {
        fetch(`http://localhost:5000/api/wishlist/${userId}`)
            .then((res) => res.json())
            .then((data) => {
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
                    {wishlist
                        .map((item: any) => {
                            const game = item.game_id;

                            const cover = item.media?.find(
                                (m: any) => m.type === "cover"
                            )?.url;

                            return (
                                <WishlistGameCard
                                    key={item._id}
                                    id={item._id}
                                    title={game.title}
                                    cover={cover}
                                    onRemove={softRemove}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
