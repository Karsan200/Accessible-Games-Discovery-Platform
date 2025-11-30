import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { GameTags } from "./game/GameTags";
import "./TopSellerCard.css";

interface TopSellerCardProps {
    image: string;
    title: string;
    tagline?: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number; // 0–10 from DB
    onViewGame?: () => void;
}

export const TopSellerCard: React.FC<TopSellerCardProps> = ({
                                                                image,
                                                                title,
                                                                tagline,
                                                                tags,
                                                                rating,
                                                                onViewGame,
                                                            }) => {
    const starRating = Math.round(rating);
    const formattedRating = rating.toFixed(1);

    return (
        <Card
            className="mb-3 shadow-sm top-seller-card"
            tabIndex={0}
            aria-label={`${title}, rated ${formattedRating} out of 10, tags: ${tags.join(", ")}, tagline: ${tagline || ""}`}
            role="group"
            onKeyDown={(e) => {
                if (e.key === "Enter" && onViewGame) onViewGame();
            }}
        >
            <Row className="align-items-center top-seller-row">
                {/* Image */}
                <Col xs="auto" className="d-flex justify-content-center mb-2 mb-sm-0">
                    <Card.Img
                        src={image}
                        alt={`${title} app icon`}
                        className="top-seller-image"
                    />
                </Col>

                {/* Title + Tags + Tagline */}
                <Col className="d-flex flex-column justify-content-start align-items-start top-seller-info">
                    <div className="mb-1">
                        <GameTags tags={tags} />
                    </div>

                    <Card.Title className="fw-bold mb-1 top-seller-title" title={title}>
                        {title}
                    </Card.Title>

                    <Card.Text className="mb-0 top-seller-tagline" title={tagline}>
                        {tagline}
                    </Card.Text>
                </Col>

                {/* Rating + Button */}
                <Col xs="auto" className="d-flex flex-column align-items-center justify-content-center ms-3">
                    <div
                        className="top-seller-stars mb-2"
                        aria-label={`Rating: ${formattedRating} out of 10`}
                        role="img"
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="me-1">
                                {i < starRating ? "★" : "☆"}
                            </span>
                        ))}
                    </div>

                    <Button
                        variant="success"
                        onClick={onViewGame}
                        aria-label={`View ${title}`}
                    >
                        View Game
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};
