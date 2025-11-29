import React from "react";
import { Card, Stack } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { GameTags } from "./game/GameTags";
import "./GameCard.css";

interface GameCardProps {
    image: string;
    name: string;
    description: string;
    tagline?: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
                                                      image,
                                                      name,
                                                      description,
                                                      tagline,
                                                      tags,
                                                      onClick,
                                                  }) => {
    const cardId = `gamecard-${name.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <Card
            className="h-100 shadow-sm flex-grow-1 gamecard"
            role="group"
            aria-labelledby={`${cardId}-title`}
            aria-describedby={`${cardId}-tagline`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" && onClick) onClick();
            }}
        >
            <div className="gamecard-image-wrapper">
                <img
                    src={image}
                    alt={`${name} game cover`}
                    className="gamecard-image"
                />
            </div>

            <Card.Body className="d-flex flex-column align-items-center">
                <Stack
                    direction="horizontal"
                    className="flex-wrap justify-content-center mb-2"
                    gap={2}
                >
                    <GameTags tags={tags} />
                </Stack>

                <Card.Title
                    id={`${cardId}-title`}
                    className="fw-bold text-center fs-5 fs-md-6"
                    tabIndex={0}
                >
                    {name}
                </Card.Title>

                <Card.Text
                    id={`${cardId}-tagline`}
                    className="flex-grow-1 text-center text-wrap text-muted mb-2"
                    tabIndex={0}
                >
                    {tagline ?? description}
                </Card.Text>

                <div className="mt-3 w-100 d-flex justify-content-center">
                    <div className="w-100 w-md-auto">
                        <BlackButton
                            text="Play Now"
                            aria-label={`Play ${name}`}
                            onClick={onClick}
                        />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
