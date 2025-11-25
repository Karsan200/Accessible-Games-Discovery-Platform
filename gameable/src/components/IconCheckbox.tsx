import React from "react";
import { ToggleButton } from "react-bootstrap";

interface CheckboxProps {
    text: string;
    checked: boolean;
    onChange?: (checked: boolean) => void;
}

export const IconCheckbox: React.FC<CheckboxProps> = ({ text, checked, onChange }) => {
    return (
        <ToggleButton
            id="wishlist-toggle-check"
            type="checkbox"
            variant="outline-secondary"
            checked={checked}
            value="1"
            onChange={(e) => onChange?.(e.currentTarget.checked)}
        >
            {text}
        </ToggleButton>
    );
};

