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

export const TopSellersSection: React.FC<TopSellersSectionProps> = ({ games }) => {
    return (
        <section className="container my-5" aria-labelledby="top-sellers-heading">
            <h2
                id="top-sellers-heading"
                className="fw-bold mb-4 text-center fs-4 fs-md-2"
                tabIndex={-1}
            >
                Top Sellers
            </h2>

            <div className="d-flex flex-column gap-3">
                {games.map((game) => (
                    <TopSellerCard
                        key={game.id}
                        image={game.image}
                        title={game.title}
                        description={game.description}
                        tags={game.tags}
                        rating={game.rating}
                        onViewGame={() => console.log(`View Game: ${game.title}`)}
                    />
                ))}
            </div>
        </section>
    );
};
