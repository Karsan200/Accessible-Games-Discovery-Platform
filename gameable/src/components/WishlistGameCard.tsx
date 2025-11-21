import React from "react";
import { Card } from "react-bootstrap";

interface WishlistGameCardProps {
    image: string;
    name: string;
    description: string;
}

export const WishlistGameCard: React.FC<WishlistGameCardProps> = ({
                                                      image,
                                                      name,
                                                      description,
                                                  }) => {
    const cardId = `gamecard-${name.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <Card
            tabIndex={0}
            style={{
                cursor: "pointer",
                minWidth: "100%",
                maxWidth: "500px",
            }}
        >
            {/* Image Wrapper */}
            <div
                style={{
                    width: "100%",
                    height: "150px",
                    overflow: "hidden",
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

            <Card.Body>
                {/* Title */}
                <Card.Title
                    id={`${cardId}-title`}
                    className="fw-bold text-center"
                    tabIndex={0}
                >
                    {name}
                </Card.Title>

                {/* Description */}
                <Card.Text
                    id={`${cardId}-desc`}
                    className="flex-grow-1 text-center text-wrap"
                    tabIndex={0}
                >
                    {description}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};