import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { GameTags } from "./game/GameTags";

interface TopSellerCardProps {
    image: string;
    title: string;
    tagline?: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number; // 0-10 from DB
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
    const formattedRating = rating.toFixed(1); // <-- 1 decimal place

    return (
        <Card
            className="mb-3 shadow-sm"
            style={{ cursor: "pointer", padding: "16px" }}
            tabIndex={0}
            aria-label={`${title}, rated ${formattedRating} out of 10, tags: ${tags.join(", ")}, tagline: ${tagline || ""}`}
            role="group"
            onKeyDown={(e) => {
                if (e.key === "Enter" && onViewGame) onViewGame();
            }}
        >
            <Row className="align-items-center" style={{ flexWrap: "nowrap" }}>
                <Col xs="auto" className="d-flex justify-content-center mb-2 mb-sm-0">
                    <Card.Img
                        src={image}
                        alt={`${title} app icon`}
                        style={{
                            width: "100%",
                            maxWidth: "120px",
                            height: "120px",
                            borderRadius: "15px",
                            objectFit: "cover",
                        }}
                    />
                </Col>

                <Col
                    className="d-flex flex-column justify-content-start align-items-start"
                    style={{ minWidth: 0, flex: "1 1 auto" }}
                >
                    <div className="mb-1" aria-hidden={false}>
                        <GameTags tags={tags} />
                    </div>

                    <Card.Title className="fw-bold mb-1" title={title} style={{ wordBreak: "break-word" }}>
                        {title}
                    </Card.Title>

                    <Card.Text className="mb-0" title={tagline} style={{ wordBreak: "break-word" }}>
                        {tagline}
                    </Card.Text>
                </Col>

                <Col
                    xs="auto"
                    className="d-flex flex-column align-items-center justify-content-center ms-3"
                >
                    <div
                        className="mb-2"
                        style={{ fontSize: "1.2rem", lineHeight: 1 }}
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
