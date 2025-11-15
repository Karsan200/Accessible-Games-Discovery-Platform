import React from "react";
import { GameCard } from "./GameCard";

interface Game {
    id: number;
    image: string;
    name: string;
    description: string;
    tags?: string[];
}

interface TrendingGamesProps {
    games: Game[];
}

export const TrendingGames: React.FC<TrendingGamesProps> = ({ games }) => {
    return (
        <section
            className="container my-5"
            role="region"
            aria-label="Trending games"
        >
            <h2 className="fw-bold mb-4 text-center">Trending Games</h2>

            <div
                className="row g-4 justify-content-center"
                role="list"
                aria-label="Trending game list"
            >
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="col-12 col-sm-6 col-md-3 d-flex"
                        role="listitem"
                    >
                        <GameCard
                            image={game.image}
                            name={game.name}
                            description={game.description}
                            tags={game.tags}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
