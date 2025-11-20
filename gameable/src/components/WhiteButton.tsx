import React from "react";
import { Button } from "react-bootstrap";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

export const WhiteButton: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <Button
            variant="light"
            className="px-4 py-2 rounded-pill border"
            onClick={onClick}
        >
            {text}
        </Button>
    );
};
