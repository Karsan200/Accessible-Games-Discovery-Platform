import React from "react";
import { Card } from "react-bootstrap";
import "./WishlistGameCard.css";

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
            className="wishlist-game-card"
        >
            {/* Image */}
            <div className="wishlist-card-image">
                <img src={image} alt={`${name} game cover`} />
            </div>

            {/* Text */}
            <Card.Body className="wishlist-card-body">
                <Card.Title id={`${cardId}-title`} tabIndex={0}>
                    {name}
                </Card.Title>
                <Card.Text id={`${cardId}-desc`} tabIndex={0}>
                    {description}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};
