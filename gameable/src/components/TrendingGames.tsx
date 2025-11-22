import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { GameCard } from "./GameCard";

interface Game {
    id: string;
    image: string;
    name: string;
    description: string;
    tagline?: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
}

interface TrendingGamesProps {
    games: Game[];
}

export const TrendingGames: React.FC<TrendingGamesProps> = ({ games }) => {
    return (
        <section role="region" aria-label="Trending games" className="my-5 overflow-hidden">
            <Container>
                <h2 className="fw-bold mb-4 text-center fs-4 fs-md-2" tabIndex={-1}>
                    Trending Games
                </h2>

                <Row
                    className="g-3 g-md-4 justify-content-center"
                    role="list"
                    aria-label="Trending game list"
                >
                    {games.map((game) => (
                        <Col
                            key={game.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            role="listitem"
                            className="d-flex justify-content-center"
                        >
                            <GameCard
                                image={game.image}
                                name={game.name}
                                description={game.description}
                                tagline={game.tagline}
                                tags={game.tags}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};
