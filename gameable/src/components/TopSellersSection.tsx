import React from "react";
import { TopSellerCard } from "./TopSellerCard";

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
    return (
        <section className="container my-5" aria-labelledby="top-sellers-heading">
            <h2
                id="top-sellers-heading"
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '120%',
                    textAlign: 'center',
                    color: '#000000',
                    marginTop: '128px',
                    marginBottom: '48px',
                }}
                tabIndex={-1}
            >
                Highest Rated
            </h2>

            <div className="d-flex flex-column gap-3">
                {games.map((game) => (
                    <TopSellerCard
                        key={game.id}
                        image={game.image}
                        title={game.title}
                        tagline={game.tagline}
                        tags={game.tags}
                        rating={game.rating}
                        onViewGame={() => console.log(`View Game: ${game.title}`)}
                    />
                ))}
            </div>
        </section>
    );
};
