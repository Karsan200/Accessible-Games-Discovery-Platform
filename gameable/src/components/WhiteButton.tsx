import React from "react";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

export const WhiteButton: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className="btn btn-light px-4 py-2 rounded-pill border"
            onClick={onClick}
        >
            {text}
        </button>
    );
};
