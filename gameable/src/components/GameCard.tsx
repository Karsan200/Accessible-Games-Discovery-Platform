import React from "react";
import { Card, Stack } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { GameTags } from "./game/GameTags";
import {GameStars} from "./game/GameStars";

interface GameCardProps {
    image: string;
    name: string;
    description: string;
    tagline?: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number;
    onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
                                                      image,
                                                      name,
                                                      description,
                                                      tagline,
                                                      tags,
                                                      rating,
                                                      onClick,
                                                  }) => {
    const cardId = `gamecard-${name.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <Card
            className="h-100 shadow-sm flex-grow-1"
            role="group"
            aria-labelledby={`${cardId}-title`}
            aria-describedby={`${cardId}-tagline`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" && onClick) onClick();
            }}
            style={{
                cursor: "pointer",
                minWidth: "100%",
                maxWidth: "300px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "150px",
                    overflow: "hidden",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                }}
            >
                <img
                    src={image}
                    alt={`${name} game cover`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
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

                {rating !== undefined && (
                    <div className="mb-2 d-flex flex-column align-items-center">
                    <GameStars rating={rating} />
                    <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                        ({rating.toFixed(1)}/5)
                    </span>
                    </div>
                )}


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
