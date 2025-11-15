import React from "react";
import { GameTag } from "./GameTag";
import { BlackButton } from "./BlackButton";

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
        <article
            className="card mb-3 shadow-sm d-flex align-items-center"
            style={{ height: "160px", padding: "10px" }}
            tabIndex={0} // Make the card itself tabbable
            aria-label={`${title}, rated ${rating} out of 5 stars, ${tags.join(", ")} tags, description: ${description}`}
        >
            <div className="d-flex w-100 align-items-center">

                {/* Left: App Icon */}
                <img
                    src={image}
                    alt={`${title} app icon`}
                    style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "15px",
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />

                {/* Middle: Tags, Title, Description */}
                <div className="flex-grow-1 ms-3 d-flex flex-column justify-content-center">
                    <ul className="list-inline mb-1" aria-label="Accessibility tags">
                        {tags.map((tag, idx) => (
                            <li key={idx} className="list-inline-item">
                                <GameTag type={tag} />
                            </li>
                        ))}
                    </ul>

                    <h5 className="fw-bold mb-1">{title}</h5>

                    <p className="mb-0 text-truncate">{description}</p>
                </div>

                {/* Right: Rating and Button */}
                <div className="d-flex flex-column align-items-center ms-3">
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

                    <BlackButton text="View Game" onClick={onViewGame} aria-label={`View ${title}`} />
                </div>
            </div>
        </article>
    );
};
