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
        <div
            className="card mb-3 shadow-sm d-flex align-items-center"
            style={{ height: "160px", padding: "10px" }}
        >
            <div className="d-flex w-100 align-items-center">

                {/* Left: App Icon */}
                <div
                    style={{
                        width: "120px",
                        height: "120px",
                        flexShrink: 0,
                        borderRadius: "15px",
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Middle: Tags, Title, Description */}
                <div className="flex-grow-1 ms-3 d-flex flex-column justify-content-center">
                    {/* Tags */}
                    <div className="mb-1">
                        {tags.map((tag, idx) => (
                            <GameTag key={idx} type={tag} />
                        ))}
                    </div>

                    {/* Title */}
                    <h5 className="fw-bold mb-1">{title}</h5>

                    {/* Description */}
                    <p className="mb-0 text-truncate">{description}</p>
                </div>

                {/* Right: Rating and Button */}
                <div className="d-flex flex-column align-items-center ms-3">
                    {/* Rating Stars */}
                    <div className="mb-2" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="me-1">
                {i < rating ? "★" : "☆"}
              </span>
                        ))}
                    </div>

                    {/* View Game Button */}
                    <BlackButton text="View Game" onClick={onViewGame} />
                </div>
            </div>
        </div>
    );
};
