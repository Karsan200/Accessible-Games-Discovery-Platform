import React from "react";
import { TopSellerCard } from "./TopSellerCard";
import { useNavigate } from "react-router-dom";
import "./TopSellersSection.css";

interface Game {
    id: string;
    image: string;
    title: string;
    description: string;
    tagline?: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number;
}

interface TopSellersSectionProps {
    games: Game[];
}

export const TopSellersSection: React.FC<TopSellersSectionProps> = ({ games }) => {
    const navigate = useNavigate();

    const handleViewGame = (gameId: string) => {
        navigate(`/games/${gameId}`);
    };

    return (
        <section className="container my-5 top-sellers-section" aria-labelledby="top-sellers-heading">
            <h2 id="top-sellers-heading" className="top-sellers-heading" tabIndex={-1}>
                Highest Rated
            </h2>

            <p className="top-sellers-subtitle">
                Explore the top-rated games loved by players — find out what everyone's talking about
            </p>

            <div className="d-flex flex-column gap-3">
                {games.map((game) => (
                    <TopSellerCard
                        key={game.id}
                        image={game.image}
                        title={game.title}
                        tagline={game.tagline}
                        tags={game.tags}
                        rating={game.rating}
                        onViewGame={() => handleViewGame(game.id)}
                    />
                ))}
            </div>
        </section>
    );
};
