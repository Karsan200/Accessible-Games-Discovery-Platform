import React from "react";
import { Badge } from "react-bootstrap";

interface GameTagProps {
    type: "Visual" | "Audio" | "Motor" | "Cognitive";
}

const tagVariant: Record<GameTagProps["type"], string> = {
    Visual: "primary",
    Audio: "success",
    Motor: "warning",
    Cognitive: "danger",
};

export const GameTag: React.FC<GameTagProps> = ({ type }) => {
    return (
        <Badge
            bg={tagVariant[type]}
            text={type === "Motor" ? "dark" : "light"}
            pill
            aria-label={`${type} accessibility`}
            className="px-2 py-1 fw-bold"
        >
            {type}
        </Badge>
    );
};
