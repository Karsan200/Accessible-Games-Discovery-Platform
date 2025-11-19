import { useEffect, useState } from "react";

export function Wishlist() {
    const userId = "1"; // TODO: THIS IS A HARDCODED VALUE AT THE MOMENT
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/wishlist/${userId}`)
            .then((res) => res.json())
            .then((data) => setWishlist(data))
            .catch(console.error);
    }, []);

    function removeItem(id: string) {
        fetch(`http://localhost:5000/api/wishlist/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                // Remove from state
                setWishlist((prev) => prev.filter((item: any) => item._id !== id));
            })
            .catch(console.error);
    }

    return (
        <div>
            <h1>My Wishlist</h1>

            <ul>
                {wishlist.map((item: any) => {
                    const game = item.game_id;

                    // Try to find a cover image via type
                    const cover = item.media?.find((m: any) => m.type === "cover");

                    return (
                        <li key={item._id}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                {cover && (
                                    <img
                                        src={cover.url}
                                        alt={cover.description || game.title}
                                        style={{ width: "60px", borderRadius: "6px" }}
                                    />
                                )}

                                <span>{game.title}</span>

                                <button
                                    style={{ marginLeft: "20px" }}
                                    onClick={() => removeItem(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
