import React from "react";
import { Card, Image, Stack } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { GameTag } from "./GameTag";

interface GameCardProps {
    image: string;
    name: string;
    description: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
                                                      image,
                                                      name,
                                                      description,
                                                      tags,
                                                      onClick,
                                                  }) => {
    const cardId = `gamecard-${name.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <Card
            className="h-100 shadow-sm"
            role="group"
            aria-labelledby={`${cardId}-title`}
            aria-describedby={`${cardId}-desc`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" && onClick) onClick();
            }}
            style={{ cursor: "pointer", minWidth: "250px", maxWidth: "300px" }}
        >
            {/* Image */}
            <Image
                src={image}
                alt={`${name} game cover`}
                style={{
                    height: "150px",
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem"
                }}
            />


            <Card.Body className="d-flex flex-column">

                {/* Accessibility Tags */}
                <Stack
                    direction="horizontal"
                    className="flex-wrap justify-content-center mb-2"
                    role="list"
                    aria-label="Accessibility features"
                    gap={2}
                >
                    {tags?.map((tag) => (
                        <span key={tag} role="listitem">
                            <GameTag type={tag} />
                        </span>
                    ))}
                </Stack>

                {/* Title */}
                <Card.Title id={`${cardId}-title`} className="fw-bold text-center">
                    {name}
                </Card.Title>

                {/* Description */}
                <Card.Text
                    id={`${cardId}-desc`}
                    className="flex-grow-1 text-center"
                    style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {description}
                </Card.Text>

                {/* Button */}
                <div className="mt-3 text-center">
                    <BlackButton
                        text="Play Now"
                        aria-label={`Play ${name}`}
                        onClick={onClick}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};
