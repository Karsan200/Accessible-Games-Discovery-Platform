import React from "react";
import type {FeedbackType} from "react-bootstrap/Feedback";

export type RegisterFormModel = {
    inputs: {
        username: {
            value: string,
            status: [FeedbackType | undefined, React.Dispatch<React.SetStateAction<FeedbackType | undefined>>],
            message: [string, React.Dispatch<React.SetStateAction<string>>]
        },
        email: {
            value: string,
            status: [FeedbackType | undefined, React.Dispatch<React.SetStateAction<FeedbackType | undefined>>],
            message: [string, React.Dispatch<React.SetStateAction<string>>]
        },
        password: {
            value: string,
            status: [FeedbackType | undefined, React.Dispatch<React.SetStateAction<FeedbackType | undefined>>],
            message: [string, React.Dispatch<React.SetStateAction<string>>]
        },
        passwordConfirm: {
            value: string,
            status: [FeedbackType | undefined, React.Dispatch<React.SetStateAction<FeedbackType | undefined>>],
            message: [string, React.Dispatch<React.SetStateAction<string>>]
        },
    }
}