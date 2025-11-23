import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {type unstable_RSCStaticRouterProps, useParams} from "react-router-dom";
import { GameBreadcrumbs } from "../game/GameBreadcrumbs";
import { Authentication } from "../../data/Authentication.ts";
import { getUserIdFromToken } from "../../data/TokenUtility.ts"
import { GameTags } from "../game/GameTags";
import { GameStars } from "../game/GameStars";
import { Carousel } from "../game/Carousel";
import "./GamePage.css";

const DEFAULT_PROFILE_IMG = "http://localhost:5000/images/profilepicTemp.png";

type UserSummary = {
    _id?: string;
    username?: string;
    profilePicture?: string;
};

type Media = {
    url: string;
    type?: string;
    description?: string;
};

type Tag = {
    name: string;
};

type Review = {
    rating: number;
    body?: string;
    user?: UserSummary;
};

type Game = {
    _id: string;
    title: string;
    description?: string;
    details?: string;
    accessibility?: string;
    media?: Media[];
    reviews?: Review[];
    tags?: Tag[];
    rating?: number;
    reviewCount?: number;
};

// Local TagLabel type (matches GameTags)
type TagLabel = "Visual" | "Audio" | "Motor" | "Cognitive";

const toTagLabel = (s?: string | null): TagLabel | null => {
    if (!s) return null;
    const n = s.trim().toLowerCase();
    if (n === "visual" || n === "vision") return "Visual";
    if (n === "audio" || n === "hearing") return "Audio";
    if (n === "motor") return "Motor";
    if (n.startsWith("cognit") || n === "cognitive") return "Cognitive";
    return null;
};

export function GamePage() {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGame() {
            try {
                const res = await fetch(`http://localhost:5000/api/games/${id}`);
                const data = await res.json();
                setGame(data as Game);
            } catch (err) {
                console.error("Failed to fetch game:", err);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchGame();
    }, [id]);

    // Refresh token
    useEffect(() => {
        async function initAuth() {
            const token = await Authentication.refreshToken();
            setAccessToken(token);
        }
        void initAuth();
    }, []);

    async function addToWishlist(gameId: string) {
        if (!gameId) return;

        try {
            // Get access token (refresh if needed)
            const token = accessToken || (await Authentication.refreshToken());
            if (!token) {
                alert("You must be logged in to add items to your wishlist.");
                return;
            }

            const userId = getUserIdFromToken(token);
            if (!userId) {
                alert("Invalid user session.");
                return;
            }

            // Call wishlist API with auth header
            const res = await fetch('http://localhost:5000/wishlist/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId, gameId })
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to add to wishlist:", res.status, text);
                alert("Failed to add to wishlist. Check console.");
                return;
            }

            const data = await res.json();
            // console.log("Added to wishlist:", data);
            const message = data + " added to wishlist!"
            alert(message);
        } catch (err) {
            console.error(err);
            alert("Could not add to wishlist.");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!game) return <p>Game not found.</p>;

    // Prepare images for carousel (only screenshots and covers, skip items without url)
    const imageItems: ReactElement[] = (game.media ?? [])
        .filter((m) => !!m.url && (m.type === "screenshot" || m.type === "cover"))
        .map((m, i) => {
            const src = m.url.startsWith("http") ? m.url : `http://localhost:5000${m.url}`;
            return (
                <img
                    key={i}
                    src={src}
                    className="d-block w-100 rounded"
                    alt={m.description ?? `Game screenshot ${i + 1}`}
                />
            );
        });

    // Prepare reviews for carousel
    const reviewItems: ReactElement[] = (game.reviews ?? []).map((r, i) => {
        return (
            <div className="review-box w-100 h-100" key={i}>
                <h4 className="mb-1">
                    <GameStars rating={r.rating ?? 0} />
                </h4>
                <p className="mb-2">{r.body}</p>
                <div className="review-meta">
                    <img
                        src={
                            r.user?.profilePicture
                                ? `http://localhost:5000${r.user.profilePicture}`
                                : DEFAULT_PROFILE_IMG
                        }
                        alt={r.user?.username ?? "Anonymous"}
                        className="review-avatar"
                    />
                    <strong>{r.user?.username ?? "Anonymous"}</strong>
                </div>
            </div>
        );
    });

    const tags: TagLabel[] = (game.tags ?? [])
        .map((t) => toTagLabel(t.name))
        .filter((t): t is TagLabel => t !== null);

    const ratingValue = game.rating ?? 0;
    const reviewCount = game.reviewCount ?? (game.reviews ? game.reviews.length : 0);

    return (
        <div className="container my-5">
            <div className="game-page-flex">
                <div className="game-images-col">
                    <Carousel id="gameImages" items={imageItems} visibleCount={1} step={1} />

                    <div className="game-details-left mt-3">
                        <h3 className="mb-2">Details</h3>
                        <p className="game-details">{game.details}</p>
                    </div>
                </div>

                <div className="game-info-col">
                    <div className="game-breadcrumbs">
                        <GameBreadcrumbs gameTitle={game.title} />
                    </div>

                    <h1 className="game-title">{game.title}</h1>

                    <div className="game-tags-wrapper">
                        <GameTags tags={tags} />
                    </div>

                    <div className="game-rating-row">
                        <GameStars rating={ratingValue} />
                        <span className="ms-2">({ratingValue.toFixed(1)} stars)</span>
                        <span className="mx-2">•</span>
                        <span>{reviewCount} reviews</span>
                    </div>

                    <p className="game-description">{game.description}</p>

                    <button className="btn btn-primary game-fav-btn" onClick={() => addToWishlist(game._id)}>Add to Wishlist</button>

                    <h3 className="mt-4 mb-2">Accessibility</h3>
                    <p className="game-accessibility">{game.accessibility}</p>

                    <hr className="mt-4 mb-4" />
                </div>
            </div>

            <hr className="my-5 full-width-hr" />

            <h2 className="mb-2">Customer Reviews</h2>
            <div className="reviews-header-row">
                <p className="text-muted mb-4">This is what the customers have to say.</p>
                <button type="button" className="btn btn-primary game-fav-btn reviews-add-btn">
                    Add a Review
                </button>
            </div>

            <Carousel id="reviewCarousel" items={reviewItems} visibleCount={3} step={1} />
        </div>
    );
}
