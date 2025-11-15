import React from "react";

interface GameTagProps {
    type: "Visual" | "Audio" | "Motor" | "Cognitive";
}

const tagColors: Record<GameTagProps["type"], string> = {
    Visual: "bg-primary text-white",
    Audio: "bg-success text-white",
    Motor: "bg-warning text-dark",
    Cognitive: "bg-danger text-white",
};

export const GameTag: React.FC<GameTagProps> = ({ type }) => {
    return (
        <span
            className={`px-2 py-1 me-2 rounded-pill small fw-bold ${tagColors[type]}`}
            role="text"
            aria-label={`${type} accessibility`}
        >
      {type}
    </span>
    );
};
