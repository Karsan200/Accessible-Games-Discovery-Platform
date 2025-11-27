import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "../game/Carousel"; // keep carousel for reviews
import { GameStars } from "../game/GameStars"; // for star ratings
import "./Profile.css";

interface PublicUser {
    _id: string;
    username: string;
    profilePicture?: string;
}

interface Review {
    _id: string;
    rating: number;
    body?: string;
    game?: {
        _id: string;
        title: string;
        images?: string[];
    };
    createdAt: string;
}

interface GameOption {
    _id: string;
    title: string;
}

export default function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState<PublicUser | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [favoriteGames, setFavoriteGames] = useState<GameOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch public profile by username
    useEffect(() => {
        if (!username) return;

        fetch(`http://localhost:5000/user/username/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }
                setUserData(data);
            })
            .catch(() => setError("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [username]);

    // Fetch user's reviews when userData is available
    useEffect(() => {
        if (!userData?._id) return;

        fetch(`http://localhost:5000/api/reviews/user/${userData._id}`)
            .then(res => res.json())
            .then(revData => setReviews(revData.reviews || []))
            .catch(() => console.error("Failed to fetch reviews"));
    }, [userData?._id]);

    // Fetch user's favorite games when userData is available
    useEffect(() => {
        if (!userData?._id) return;

        fetch(`http://localhost:5000/user/${userData._id}/favorites`)
            .then(res => res.json())
            .then(favData => setFavoriteGames(favData.favorite_games || []))
            .catch(() => console.error("Failed to fetch favorite games"));
    }, [userData?._id]);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!userData) return <h2>User not found</h2>;

    const reviewItems = reviews.map((r) => (
        <div className="review-box w-100 h-100 profile-review-box" key={r._id}>
            <h4 className="mb-1">
                <GameStars rating={r.rating} />
            </h4>
            <p className="mb-2">{r.body}</p>
            <div className="review-meta">
                <strong>Game:</strong> {r.game?.title ?? "Unknown"}
            </div>
        </div>
    ));

    return (
        <div className="profile-page">
            <div className="text-center">
                <h1>{userData.username}</h1>
                {userData.profilePicture ? (
                    <img
                        src={`http://localhost:5000${userData.profilePicture}`}
                        alt={`${userData.username}'s profile`}
                        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                    />
                ) : (
                    <p>No profile picture.</p>
                )}
            </div>

            {favoriteGames.length > 0 && (
                <div className="my-4">
                    <h2>Favorite Games</h2>
                    <div className="d-flex gap-3 flex-wrap">
                        {favoriteGames.map(game => (
                            <div
                                key={game._id}
                                className="favorite-game-card p-2 border rounded text-center"
                                style={{ minWidth: "120px", flex: "1 0 auto" }}
                            >
                                {game.title}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h2 className="mt-5">Reviews by {userData.username}</h2>
            {reviews.length > 0 ? (
                <Carousel id="profileReviews" items={reviewItems} visibleCount={3} step={1} />
            ) : (
                <p>{userData.username} hasn't written any reviews yet.</p>
            )}
        </div>
    );
}
