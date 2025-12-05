import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import { Home } from "../src/components/pages/Home";

// Child component mocks
jest.mock("../src/components/HeroHeader.tsx", () => ({
    HeroHeader: ({ slides }: any) => (
        <div data-testid="hero-header">Hero {slides?.length}</div>
    )
}));

jest.mock("../src/components/TrendingGames.tsx", () => ({
    TrendingGames: ({ games }: any) => (
        <div data-testid="trending-games">Trending {games?.length}</div>
    )
}));

jest.mock("../src/components/TopSellersSection.tsx", () => ({
    TopSellersSection: ({ games }: any) => (
        <div data-testid="top-sellers">Top {games?.length}</div>
    )
}));

jest.mock("../src/components/FeaturesSection.tsx", () => ({
    FeaturesSection: () => <div data-testid="features-section">Features</div>
}));

// Settings micks
jest.mock("../src/AppSettings.ts", () => ({
    settings: { apiBaseUrl: "http://mock-api" }
}));

// Helper mocks data
const mockTopSellers = [
    { id: "1", title: "Top Game", image: "", description: "", rating: 5, tags: ["Visual"] }
];

const mockTrending = [
    { id: "2", name: "Trending Game", image: "", description: "", tags: ["Audio"] }
];

const mockHeroSlides = [
    { id: "3", title: "Hero Slide", image: "", description: "", tags: ["Motor"] }
];

describe("Home Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders all sections with API data", async () => {
        global.fetch = jest.fn((input: RequestInfo) => {
            const url = input.toString();
            if (url.includes("/api/home/top-sellers"))
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTopSellers) });
            if (url.includes("/api/home/trending"))
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTrending) });
            if (url.includes("/api/home/hero"))
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockHeroSlides) });
            return Promise.reject(new Error("Unknown API"));
        }) as jest.Mock;

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByTestId("hero-header")).toHaveTextContent("Hero 1");
            expect(screen.getByTestId("trending-games")).toHaveTextContent("Trending 1");
            expect(screen.getByTestId("top-sellers")).toHaveTextContent("Top 1");
            expect(screen.getByTestId("features-section")).toBeInTheDocument();
        });

        // Check fetch calls
        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(global.fetch).toHaveBeenCalledWith("http://mock-api/api/home/top-sellers");
        expect(global.fetch).toHaveBeenCalledWith("http://mock-api/api/home/trending");
        expect(global.fetch).toHaveBeenCalledWith("http://mock-api/api/home/hero");
    });

    // Empty API response
    test("renders correctly when API returns empty arrays", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
        ) as jest.Mock;

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(screen.getByTestId("hero-header")).toHaveTextContent("Hero 0");
            expect(screen.getByTestId("trending-games")).toHaveTextContent("Trending 0");
            expect(screen.getByTestId("top-sellers")).toHaveTextContent("Top 0");
        });
    });

    // Error handling
    test("logs errors when fetch fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        global.fetch = jest.fn(() => Promise.reject(new Error("Fetch failed"))) as jest.Mock;

        await act(async () => {
            render(<Home />);
        });

        // Wait for all fetch calls to trigger errors
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error fetching top sellers:",
                expect.any(Error)
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error fetching trending games:",
                expect.any(Error)
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error fetching hero slides:",
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });
});
