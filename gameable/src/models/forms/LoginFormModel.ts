import type { FeedbackType } from "react-bootstrap/Feedback";
import React from "react";
import type { AuthContextType } from "../../data/AuthContext.tsx";

export type LoginFormModel = {
    banner: [React.JSX.Element, React.Dispatch<React.SetStateAction<React.JSX.Element>>],
    authContext: AuthContextType,
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