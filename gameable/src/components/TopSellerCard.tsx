import React from "react";
import { Card, Row, Col, Button, Stack } from "react-bootstrap";
import { GameTag } from "./GameTag";

interface TopSellerCardProps {
    image: string;
    title: string;
    description: string;
    tags: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
    rating: number; // 0-10 from DB
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
    const starRating = Math.round((rating / 10) * 5);

    return (
        <Card
            className="mb-3 shadow-sm"
            style={{ cursor: "pointer", padding: "16px" }}
            tabIndex={0}
            aria-label={`${title}, rated ${rating} out of 10, tags: ${tags.join(
                ", "
            )}, description: ${description}`}
            role="group"
            onKeyDown={(e) => {
                if (e.key === "Enter" && onViewGame) onViewGame();
            }}
        >
            <Row className="align-items-center" style={{ flexWrap: "nowrap" }}>
                {/* Left: App Icon */}
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

                {/* Middle: Tags, Title, Description */}
                <Col
                    className="d-flex flex-column justify-content-start align-items-start"
                    style={{ minWidth: 0, flex: "1 1 auto" }}
                >
                    <Stack
                        direction="horizontal"
                        gap={2}
                        className="flex-wrap mb-1"
                        role="list"
                        aria-label="Accessibility tags"
                    >
                        {tags.map((tag, idx) => (
                            <span key={idx} role="listitem">
                <GameTag type={tag} />
              </span>
                        ))}
                    </Stack>

                    <Card.Title className="fw-bold mb-1" title={title} style={{ wordBreak: "break-word" }}>
                        {title}
                    </Card.Title>

                    <Card.Text className="mb-0" title={description} style={{ wordBreak: "break-word" }}>
                        {description}
                    </Card.Text>
                </Col>

                {/* Right: Rating and Button */}
                <Col
                    xs="auto"
                    className="d-flex flex-column align-items-center justify-content-center ms-3"
                >
                    <div
                        className="mb-2"
                        style={{ fontSize: "1.2rem", lineHeight: 1 }}
                        aria-label={`Rating: ${rating} out of 10`}
                        role="img"
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="me-1">
                {i < starRating ? "★" : "☆"}
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
