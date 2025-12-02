import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VoiceCommandsIntro from "../src/components/voiceNavigation/VoiceCommandsIntro";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe("VoiceCommandsIntro Component", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders modal with title, table, hint, and buttons", () => {
        render(<VoiceCommandsIntro />, { wrapper: MemoryRouter });

        expect(screen.getByText(/How To Use Voice Navigation/i)).toBeInTheDocument();
        expect(screen.getByText(/Basic Controls/i)).toBeInTheDocument();
        expect(screen.getByText(/Stop listening/i)).toBeInTheDocument();
        expect(screen.getByText(/clear, reset/i)).toBeInTheDocument();
        expect(screen.getByText(/Try saying "click continue"/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /More Info/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });

    test("clicking Close button hides modal", () => {
        render(<VoiceCommandsIntro />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByLabelText("Close"));
        expect(screen.queryByText(/How To Use Voice Navigation/i)).toBeNull();
    });

    test("clicking Continue button hides modal", () => {
        render(<VoiceCommandsIntro />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
        expect(screen.queryByText(/How To Use Voice Navigation/i)).toBeNull();
    });

    test("clicking More Info button hides modal and navigates", () => {
        render(<VoiceCommandsIntro />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByRole("button", { name: /More Info/i }));
        expect(screen.queryByText(/How To Use Voice Navigation/i)).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith("/voice-commands");
    });
});

