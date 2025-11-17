import React from "react";
import type { FeedbackType } from "react-bootstrap/Feedback";

export type LoginFormModel = {
    inputs: {
        email: {
            value: string,
            status: [FeedbackType | undefined, React.Dispatch<React.SetStateAction<FeedbackType | undefined>>],
            message: [string, React.Dispatch<React.SetStateAction<string>>]
        },
        password: {
            value: string,
            status: [FeedbackType | undefined, React.Dispatch<React.SetStateAction<FeedbackType | undefined>>],
            message: [string, React.Dispatch<React.SetStateAction<string>>]
        }
    }
}