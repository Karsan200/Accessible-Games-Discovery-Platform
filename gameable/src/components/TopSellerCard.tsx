import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { GameTag } from "./GameTag";

interface TopSellerCardProps {
    image: string;
    title: string;
    description: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number; // 0-5
    onViewGame?: () => void;
}

export const TopSellerCard: React.FC<TopSellerCardProps> = ({
                                                                image,
                                                                title,
                                                                description,
                                                                tags,
                                                                rating,
                                                                onViewGame,
                                                            }) => {
    return (
        <Card
            className="mb-3 shadow-sm"
            style={{ height: "160px", cursor: "pointer" }}
            tabIndex={0}
            aria-label={`${title}, rated ${rating} out of 5 stars, tags: ${tags.join(
                ", "
            )}, description: ${description}`}
            role="group"
            onKeyDown={(e) => {
                if (e.key === "Enter" && onViewGame) onViewGame();
            }}
        >
            <Row className="g-0 align-items-center h-100">
                {/* Left: App Icon */}
                <Col xs="auto">
                    <Card.Img
                        src={image}
                        alt={`${title} app icon`}
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "15px",
                            objectFit: "cover",
                        }}
                    />
                </Col>

                {/* Middle: Tags, Title, Description */}
                <Col className="ms-3 d-flex flex-column justify-content-center">
                    <div
                        className="mb-1 d-flex flex-wrap justify-content-center"
                        role="list"
                        aria-label="Accessibility tags"
                    >
                        {tags.map((tag, idx) => (
                            <span key={idx} role="listitem">
                <GameTag type={tag} />
              </span>
                        ))}
                    </div>

                    <Card.Title className="fw-bold mb-1">{title}</Card.Title>
                    <Card.Text className="mb-0 text-truncate">{description}</Card.Text>
                </Col>

                {/* Right: Rating and Button */}
                <Col xs="auto" className="d-flex flex-column align-items-center ms-3">
                    <div
                        className="mb-2"
                        style={{ fontSize: "1.5rem", lineHeight: 1 }}
                        aria-label={`Rating: ${rating} out of 5 stars`}
                        role="img"
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="me-1">
                {i < rating ? "★" : "☆"}
              </span>
                        ))}
                    </div>

                    <Button
                        variant="dark"
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
