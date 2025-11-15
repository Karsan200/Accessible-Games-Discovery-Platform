import React from "react";
import { TopSellerCard } from "./TopSellerCard";

interface Game {
    id: number;
    image: string;
    title: string;
    description: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number;
}

interface TopSellersSectionProps {
    games: Game[];
}

export const TopSellersSection: React.FC<TopSellersSectionProps> = ({
                                                                        games,
                                                                    }) => {
    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4 text-center">Top Sellers</h2>

            <div className="d-flex flex-column">
                {games.map((game) => (
                    <TopSellerCard
                        key={game.id}
                        image={game.image}
                        title={game.title}
                        description={game.description}
                        tags={game.tags}
                        rating={game.rating}
                    />
                ))}
            </div>
        </div>
    );
};
