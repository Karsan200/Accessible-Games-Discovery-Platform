import React from "react";
import { Button } from "react-bootstrap";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

export const BlackButton: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <Button
            variant="dark"
            className="px-4 py-2 rounded-pill"
            onClick={onClick}
        >
            {text}
        </Button>
    );
};
