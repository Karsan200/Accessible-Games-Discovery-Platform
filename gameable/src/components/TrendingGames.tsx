import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { GameCard } from "./GameCardHome";
import { useNavigate } from "react-router-dom";
import "./TrendingGames.css";

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
    const navigate = useNavigate();

    return (
        <section role="region" aria-label="Trending games" className="my-5 overflow-hidden">
            <Container>
                <h2 className="trending-heading" tabIndex={-1}>
                    Trending Games
                </h2>

                <p className="trending-subtitle">
                    Discover the most popular games right now — see what players are loving today.
                </p>

                <Row className="g-3 g-md-4 justify-content-center" role="list" aria-label="Trending game list">
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
                                onClick={() => navigate(`/games/${game.id}`)}
                                                          />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};
