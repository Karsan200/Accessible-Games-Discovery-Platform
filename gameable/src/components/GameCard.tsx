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
    return (
        <div className="card h-100 shadow-sm" style={{ minWidth: "250px", maxWidth: "300px" }}>

            {/* Image at top */}
            <div
                style={{
                    width: "100%",
                    height: "150px",
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />

            {/* Card body */}
            <div className="card-body d-flex flex-column" style={{ height: "220px" }}>
                <h5 className="card-title fw-bold">{name}</h5>
                <p className="card-text flex-grow-1" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {description}
                </p>

                {/* Button at bottom */}
                <div className="mt-3">
                    <BlackButton text="Play Now" onClick={onClick} />
                </div>
            </div>
        </div>
    );
};
