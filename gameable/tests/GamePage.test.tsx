import * as React from "react";
import { render, screen } from "@testing-library/react";
import { GamePage } from "../src/components/pages/GamePage";

// Mock useParams from react-router-dom
jest.mock("react-router-dom", () => ({
    useParams: () => ({ id: "123" })
}));

// Mock Carousel component
jest.mock("../src/components/game/Carousel", () => ({
    Carousel: ({ items }: { items: React.ReactNode[] }) => (
        <div data-testid="carousel">
            {items.map((item, idx) => (
                <div key={idx} data-testid="carousel-item">{item}</div>
            ))}
        </div>
    )
}));

// Mock GameBreadcrumbs
jest.mock("../src/components/game/GameBreadcrumbs", () => ({
    GameBreadcrumbs: ({ gameTitle }: { gameTitle: string }) => (
        <div data-testid="breadcrumbs">{gameTitle}</div>
    )
}));

// Mock GameTags
jest.mock("../src/components/game/GameTags", () => ({
    GameTags: ({ tags }: { tags: string[] }) => (
        <div data-testid="tags">{tags.join(", ")}</div>
    )
}));

// Mock GameStars
jest.mock("../src/components/game/GameStars", () => ({
    GameStars: ({ rating }: { rating: number }) => (
        <div data-testid="stars">{rating} stars</div>
    )
}));

// Mock ReviewModel
jest.mock("../src/models/forms/ReviewModel", () => ({
    __esModule: true,
    default: () => null
}));

// Mock game data
const mockGame = {
    _id: "123",
    title: "Test Game",
    description: "A great test game",
    details: "Test game details",
    accessibility: "Accessible",
    media: [
        { url: "image1.png", type: "image" },
        { url: "trailer.mp4", type: "trailer" }
    ],
    reviews: [
        { rating: 5, body: "Amazing!", user: { _id: "u1", username: "Alice", profilePicture: "" } },
        { rating: 4, body: "Good game", user: { _id: "u2", username: "Bob", profilePicture: "" } }
    ],
    tags: [{ name: "Visual" }, { name: "Audio" }],
    rating: 4.5,
    reviewCount: 2
};

// Mock fetch globally
global.fetch = jest.fn((url) => {
    const strUrl = url.toString();

    if (strUrl.includes("/api/games/")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockGame)
        });
    }

    if (strUrl.includes("/api/auth/refresh")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: "fake-token" })
        });
    }

    // Add other endpoints your component might call
    // For safety, return a generic mock instead of throwing
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
    });
}) as jest.Mock;


describe("GamePage Component", () => {
    test("renders game title", async () => {
        render(<GamePage />);
        const titles = await screen.findAllByText(/Test Game/i);
        // There are multiple, just check one exists
        expect(titles.length).toBeGreaterThan(0);
    });

    test("renders game description", async () => {
        render(<GamePage />);
        const descriptions = await screen.findAllByText(/A great test game/i);
        expect(descriptions.length).toBeGreaterThan(0);
    });

    test("renders carousel with correct number of media items", async () => {
        render(<GamePage />);
        const carouselItems = await screen.findAllByTestId("carousel-item");

        // Only count items that match the media URLs
        const mediaItems = carouselItems.filter(item => {
            const img = item.querySelector("img");
            const iframe = item.querySelector("iframe");
            return (
                (img && img.src.includes("image1.png")) ||
                (iframe && iframe.src.includes("trailer.mp4"))
            );
        });

        expect(mediaItems).toHaveLength(mockGame.media.length);
    });


    test("renders reviews", async () => {
        render(<GamePage />);
        const review1 = await screen.findAllByText("Amazing!");
        const review2 = await screen.findAllByText("Good game");
        expect(review1.length).toBeGreaterThan(0);
        expect(review2.length).toBeGreaterThan(0);
    });

    test("renders tags", async () => {
        render(<GamePage />);
        const tags = await screen.findAllByTestId("tags");
        expect(tags.length).toBeGreaterThan(0);
        expect(tags[0].textContent).toContain("Visual");
        expect(tags[0].textContent).toContain("Audio");
    });

    test("renders stars for overall rating", async () => {
        render(<GamePage />);
        const stars = await screen.findAllByTestId("stars");
        expect(stars.length).toBeGreaterThan(0);
        expect(stars[0].textContent).toContain("4.5");
    });
});
