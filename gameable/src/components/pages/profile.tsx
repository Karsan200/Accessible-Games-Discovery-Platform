import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "../game/Carousel";
import { GameStars } from "../game/GameStars";
import { settings } from "../../AppSettings.ts";
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
    image?: string[];
}

export default function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState<PublicUser | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [favoriteGames, setFavoriteGames] = useState<GameOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const apiBase = settings.apiBaseUrl;

    // Fetch user data
    useEffect(() => {
        if (!username) return;

        fetch(`${apiBase}/user/username/${username}`)
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
    }, [username, apiBase]);

    // Fetch reviews
    useEffect(() => {
        if (!userData?._id) return;

        fetch(`${apiBase}/api/reviews/user/${userData._id}`)
            .then(res => res.json())
            .then(revData => setReviews(revData.reviews || []))
            .catch(() => console.error("Failed to fetch reviews"));
    }, [userData?._id, apiBase]);

    // Fetch favorite games
    useEffect(() => {
        if (!userData?._id) return;

        fetch(`${apiBase}/user/${userData._id}/favorites`)
            .then(res => res.json())
            .then(favData => setFavoriteGames(favData.favorite_games || []))
            .catch(() => console.error("Failed to fetch favorite games"));
    }, [userData?._id, apiBase]);

    // Handle loading/error/user-not-found states
    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!userData || !userData.username) return <h2>User not found</h2>;

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
        <div className="profile-page container">
            <div className="profile-header text-center text-md-start mb-5">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
                    {/* Profile Picture */}
                    <div className="profile-img-wrapper">
                        {userData.profilePicture ? (
                            <img
                                src={`${apiBase}${userData.profilePicture}`}
                                alt={`${userData.username}'s profile`}
                                className="profile-img shadow-lg"
                            />
                        ) : (
                            <div className="no-profile-img shadow-lg">
                                {userData.username?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="profile-info">
                        <h1 className="fw-bold">{userData.username}</h1>

                        {favoriteGames.length > 0 && (
                            <div className="favorite-games-wrapper mt-3">
                                <h5 className="favorite-games-title mb-2">Favorite Games</h5>
                                <div className="favorite-games d-flex flex-wrap gap-3">
                                    {favoriteGames.map(game => (
                                        <div key={game._id} className="favorite-game-card shadow-sm">
                                            {game.image?.[0] && (
                                                <img
                                                    src={game.image[0]}
                                                    alt={game.title}
                                                />
                                            )}
                                            <div className="mt-1 fw-semibold">{game.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <h2 className="mt-5">Reviews by {userData.username}</h2>
            {reviews.length > 0 ? (
                <Carousel id="profileReviews" items={reviewItems} visibleCount={3} step={1} />
            ) : (
                <p>{userData.username} hasn't written any reviews yet.</p>
            )}
        </div>
    );
}
