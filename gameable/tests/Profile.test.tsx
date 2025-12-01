import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import Profile from "../src/components/pages/profile";
import { useParams } from "react-router-dom";

// Mock child components
jest.mock("../src/components/game/Carousel.tsx", () => ({
    Carousel: ({ items }: any) => (
        <div data-testid="carousel">
            {items.map((item: any, i: number) => (
                <div key={i}>{item}</div>
            ))}
        </div>
    ),
}));

jest.mock("../src/components/game/GameStars.tsx", () => ({
    GameStars: ({ rating }: any) => <div data-testid="game-stars">{rating} stars</div>,
}));

// Mock AppSettings
jest.mock("../src/AppSettings.ts", () => ({
    settings: { apiBaseUrl: "http://mock-api" },
}));

// Mock useParams
jest.mock("react-router-dom", () => ({
    useParams: jest.fn(),
}));

describe("Profile Component", () => {
    const mockUser = { _id: "u1", username: "testuser", profilePicture: "/pic.jpg" };
    const mockReviews = [
        {
            _id: "r1",
            rating: 5,
            body: "Great game!",
            game: { _id: "g1", title: "Game 1" },
            createdAt: "2025-12-01",
        },
    ];
    const mockFavorites = [
        { _id: "g1", title: "Favorite Game", image: ["/fav.jpg"] },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useParams as jest.Mock).mockReturnValue({ username: "testuser" });
    });

    test("renders loading state initially", async () => {
        global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
        render(<Profile />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("renders error state when user fetch fails", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Failed"))) as jest.Mock;
        await act(async () => render(<Profile />));
        await waitFor(() => {
            expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
        });
    });

    test("renders 'user not found' when user data is empty", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock;
        await act(async () => render(<Profile />));
        await waitFor(() => {
            expect(screen.getByText("User not found")).toBeInTheDocument();
        });
    });

    test("renders correctly with no favorite games or reviews", async () => {
        global.fetch = jest.fn((url: string) => {
            if (url.includes("/user/username/")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            if (url.includes("/api/reviews/user/")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ reviews: [] }) });
            if (url.includes("/user/u1/favorites")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorite_games: [] }) });
            return Promise.reject("Unknown API");
        }) as jest.Mock;

        await act(async () => render(<Profile />));

        await waitFor(() => {
            expect(screen.queryByText("Favorite Games")).not.toBeInTheDocument();
            expect(screen.getByText("testuser hasn't written any reviews yet.")).toBeInTheDocument();
        });
    });

    test("logs error when reviews fetch fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        global.fetch = jest.fn((url: string) => {
            if (url.includes("/user/username/")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            if (url.includes("/api/reviews/user/")) return Promise.reject(new Error("Reviews failed"));
            if (url.includes("/user/u1/favorites")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorite_games: [] }) });
            return Promise.reject("Unknown API");
        }) as jest.Mock;

        await act(async () => render(<Profile />));

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch reviews");
        });

        consoleErrorSpy.mockRestore();
    });

    test("logs error when favorites fetch fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        global.fetch = jest.fn((url: string) => {
            if (url.includes("/user/username/")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            if (url.includes("/api/reviews/user/")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ reviews: [] }) });
            if (url.includes("/user/u1/favorites")) return Promise.reject(new Error("Favorites failed"));
            return Promise.reject("Unknown API");
        }) as jest.Mock;

        await act(async () => render(<Profile />));

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch favorite games");
        });

        consoleErrorSpy.mockRestore();
    });

    // render profile with reviews and favorite games
    test("renders reviews and favorite games correctly", async () => {
        global.fetch = jest.fn((url: string) => {
            if (url.includes("/user/username/")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            if (url.includes("/api/reviews/user/")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ reviews: mockReviews }) });
            if (url.includes("/user/u1/favorites")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorite_games: mockFavorites }) });
            return Promise.reject("Unknown API");
        }) as jest.Mock;

        await act(async () => render(<Profile />));

        await waitFor(() => {
            // Profile picture
            const profileImg = screen.getByAltText("testuser's profile") as HTMLImageElement;
            expect(profileImg).toBeInTheDocument();
            expect(profileImg.src).toContain("/pic.jpg");

            // Favorite game image and title
            const favImg = screen.getByAltText("Favorite Game") as HTMLImageElement;
            expect(favImg).toBeInTheDocument();
            expect(favImg.src).toContain("/fav.jpg");
            expect(screen.getByText("Favorite Game")).toBeInTheDocument();

            // Review content
            expect(screen.getByText("Great game!")).toBeInTheDocument();
            expect(screen.getByTestId("game-stars")).toHaveTextContent("5 stars");

            // Carousel rendered
            expect(screen.getByTestId("carousel")).toBeInTheDocument();
        });
    });

    // edge case test: favorite game without image
    test("renders favorite game without image correctly", async () => {
        const favoritesNoImage = [{ _id: "g2", title: "No Image Game" }];
        global.fetch = jest.fn((url: string) => {
            if (url.includes("/user/username/")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            if (url.includes("/api/reviews/user/")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ reviews: [] }) });
            if (url.includes("/user/u1/favorites")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorite_games: favoritesNoImage }) });
            return Promise.reject("Unknown API");
        }) as jest.Mock;

        await act(async () => render(<Profile />));

        await waitFor(() => {
            expect(screen.getByText("No Image Game")).toBeInTheDocument();
            expect(screen.queryByAltText("No Image Game")).not.toBeInTheDocument();
        });
    });
});
