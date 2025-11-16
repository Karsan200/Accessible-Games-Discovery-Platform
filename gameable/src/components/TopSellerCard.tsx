import React from "react";
import { Card, Row, Col, Button, Stack } from "react-bootstrap";
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
            style={{ cursor: "pointer" }}
            tabIndex={0}
            aria-label={`${title}, rated ${rating} out of 5 stars, tags: ${tags.join(
                ", "
            )}, description: ${description}`}
            role="group"
            onKeyDown={(e) => {
                if (e.key === "Enter" && onViewGame) onViewGame();
            }}
        >
            <Row className="g-2 g-md-3 align-items-center flex-wrap">
                {/* Left: App Icon */}
                <Col xs={12} sm="auto" className="d-flex justify-content-center">
                    <Card.Img
                        src={image}
                        alt={`${title} app icon`}
                        style={{
                            width: "100%",
                            maxWidth: "120px",
                            height: "auto",
                            borderRadius: "15px",
                            objectFit: "cover",
                        }}
                    />
                </Col>

                {/* Middle: Tags, Title, Description */}
                <Col
                    xs={12}
                    sm
                    className="d-flex flex-column justify-content-center align-items-start"
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

                    <Card.Title className="fw-bold mb-1 text-truncate" title={title}>
                        {title}
                    </Card.Title>

                    <Card.Text className="mb-0 text-truncate" title={description}>
                        {description}
                    </Card.Text>
                </Col>

                {/* Right: Rating and Button */}
                <Col
                    xs={12}
                    sm="auto"
                    className="d-flex flex-column align-items-center mt-2 mt-sm-0"
                >
                    <div
                        className="mb-2"
                        style={{ fontSize: "1.2rem", lineHeight: 1 }}
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
                        className="w-100"
                    >
                        View Game
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};
