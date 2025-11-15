import React from "react";
import { BlackButton } from "./BlackButton";

interface GameCardProps {
    image: string;
    name: string;
    description: string;
    onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
                                                      image,
                                                      name,
                                                      description,
                                                      onClick,
                                                  }) => {
    const cardId = `gamecard-${name.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <div
            className="card h-100 shadow-sm"
            style={{ minWidth: "250px", maxWidth: "300px", cursor: "pointer" }}
            role="group"
            aria-labelledby={`${cardId}-title`}
            aria-describedby={`${cardId}-desc`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" && onClick) {
                    onClick();
                }
            }}
        >
            {/* Image at top */}
            <img
                src={image}
                alt={`${name} game cover`}
                style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                }}
            />

            {/* Card body */}
            <div className="card-body d-flex flex-column" style={{ height: "220px" }}>
                <h5 id={`${cardId}-title`} className="card-title fw-bold">
                    {name}
                </h5>

                <p
                    id={`${cardId}-desc`}
                    className="card-text flex-grow-1"
                    style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {description}
                </p>

                {/* Button at bottom */}
                <div className="mt-3">
                    <BlackButton
                        text="Play Now"
                        aria-label={`Play ${name}`}
                        onClick={onClick}
                    />
                </div>
            </div>
        </div>
    );
};
