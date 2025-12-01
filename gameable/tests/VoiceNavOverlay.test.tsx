import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FloatingVoiceNavigation from "../src/components/voiceNavigation/VoiceNavigationOverlay";
import { useAuth } from "../src/data/AuthContext";
import {BrowserRouter} from "react-router-dom";

// Mock react-speech-recognition
jest.mock("react-speech-recognition", () => ({
    __esModule: true,
    default: {
        startListening: jest.fn(),
        stopListening: jest.fn()
    },
    useSpeechRecognition: jest.fn()
}));

// Mock useAuth
jest.mock("../src/data/AuthContext", () => ({
    useAuth: jest.fn()
}));

describe("FloatingVoiceNavigation", () => {
    const mockResetTranscript = jest.fn();
    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (require("react-speech-recognition").useSpeechRecognition as jest.Mock).mockReturnValue({
            transcript: "",
            listening: false,
            resetTranscript: mockResetTranscript,
            browserSupportsSpeechRecognition: true,
        });

        (useAuth as jest.Mock).mockReturnValue({
            prefs: { voiceNavEnabled: false, voiceNavLeft: true }
        });
    });

    test("renders overlay and buttons", () => {
        renderWithRouter(<FloatingVoiceNavigation />);

        expect(screen.getByText(/Microphone: OFF/i)).toBeInTheDocument();

        const startButton = screen.getByRole("button", { name: /Start/i });
        expect(startButton).toBeInTheDocument();

        const resetButton = screen.getByRole("button", { name: /Reset/i });
        expect(resetButton).toBeInTheDocument();
    });

    test("Start button triggers startListening", () => {
        const { default: SpeechMock } = require("react-speech-recognition");

        renderWithRouter(<FloatingVoiceNavigation />);
        const startButton = screen.getByRole("button", { name: /Start/i });

        fireEvent.click(startButton);
        expect(SpeechMock.startListening).toHaveBeenCalledWith({ continuous: true });
    });

    test("Reset button triggers resetTranscript", () => {
        renderWithRouter(<FloatingVoiceNavigation />);
        const resetButton = screen.getByRole("button", { name: /Reset/i });

        fireEvent.click(resetButton);
        expect(mockResetTranscript).toHaveBeenCalled();
    });
});

describe("FloatingVoiceNavigation hardcoded commands", () => {
    const mockResetTranscript = jest.fn();
    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };
    const mockUseSpeechRecognition = require("react-speech-recognition").useSpeechRecognition;
    let commands: any[] = [];

    beforeEach(() => {
        commands = [];
        jest.clearAllMocks();

        // @ts-ignore
        mockUseSpeechRecognition.mockImplementation(({ commands: cmd }) => {
            commands.push(...cmd);
            return {
                transcript: "",
                listening: true,
                resetTranscript: mockResetTranscript,
                browserSupportsSpeechRecognition: true,
            };
        });

        renderWithRouter(<FloatingVoiceNavigation />);
    });

    test("stop listening command", () => {
        const cmd = commands.find(c => c.command.includes("*stop listening*"));
        cmd.callback();
        expect(require("react-speech-recognition").default.stopListening).toHaveBeenCalled();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("clear/reset command", () => {
        const cmd = commands.find(c => c.command.includes("*clear*"));
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("scroll down command", () => {
        window.scrollBy = jest.fn();
        const cmd = commands.find(c => c.command.includes("*scroll down*"));
        cmd.callback();
        expect(window.scrollBy).toHaveBeenCalledWith({ top: 300, left: 0, behavior: 'smooth' });
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("scroll up command", () => {
        window.scrollBy = jest.fn();
        const cmd = commands.find(c => c.command.includes("*scroll up*"));
        cmd.callback();
        expect(window.scrollBy).toHaveBeenCalledWith({ top: -300, left: 0, behavior: 'smooth' });
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("scroll to bottom command", () => {
        window.scrollTo = jest.fn();
        const cmd = commands.find(c => c.command.includes("*scroll to bottom*"));
        cmd.callback();
        expect(window.scrollTo).toHaveBeenCalled();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("scroll to top command", () => {
        window.scrollTo = jest.fn();
        const cmd = commands.find(c => c.command.includes("*scroll to top*"));
        cmd.callback();
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("start listening command", () => {
        const cmd = commands.find(c => c.command === "*start*");
        cmd.callback();
        expect(require("react-speech-recognition").default.startListening).toHaveBeenCalledWith({ continuous: true });
    });

    test("navigate home command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click home*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate wishlist command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click wishlist*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate profile command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click profile*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate settings command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click settings*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate about us command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click about us*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate accessibility statement command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click accessibility statement*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate contact us command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click contact us*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate login command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click login*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });

    test("navigate logout command fallback", () => {
        const navigateMock = jest.fn();
        const cmd = commands.find(c => c.command.includes("*click logout*"));
        cmd.callback = cmd.callback.bind({ navigate: navigateMock });
        cmd.callback();
        expect(mockResetTranscript).toHaveBeenCalled();
    });
});


