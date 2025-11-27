import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "../game/Carousel"; // your Carousel component
import { GameStars } from "../game/GameStars"; // for star ratings
import "./Profile.css"; // optional for custom styling

interface PublicUser {
    _id: string;
    username: string;
    profilePicture: string | null;
}

interface Review {
    _id: string;
    rating: number;
    body?: string;
    game?: {
        _id: string;
        title: string;
    };
    createdAt: string;
}

export default function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState<PublicUser | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        fetch(`http://localhost:5000/user/username/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setLoading(false);
                } else {
                    setUserData(data);
                    return fetch(`http://localhost:5000/api/reviews/user/${data._id}`);
                }
            })
            .then(res => res?.json())
            .then(data => {
                if (data?.reviews) setReviews(data.reviews);
            })
            .catch(() => setError("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [username]);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!userData) return <h2>User not found</h2>;

    // Map reviews to carousel items
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

            <h2 className="mt-5">Reviews by {userData.username}</h2>
            {reviews.length > 0 ? (
                <Carousel id="profileReviews" items={reviewItems} visibleCount={3} step={1} />
            ) : (
                <p>{userData.username} hasn't written any reviews yet.</p>
            )}
        </div>
    );
}
