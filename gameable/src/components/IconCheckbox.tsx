import React from "react";
import { ToggleButton } from "react-bootstrap";

interface CheckboxProps {
    id: string;
    text: string;
    checked: boolean;
    onChange?: (checked: boolean) => void;
}

export const IconCheckbox: React.FC<CheckboxProps> = ({ id, text, checked, onChange }) => {
    return (
        <ToggleButton
            id={id}
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

