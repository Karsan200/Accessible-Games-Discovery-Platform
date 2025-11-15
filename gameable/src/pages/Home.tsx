import React from "react";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

export const Home: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className="btn btn-dark px-4 py-2 rounded-pill"
            onClick={onClick}
        >
            {text}
        </button>
    );
};
