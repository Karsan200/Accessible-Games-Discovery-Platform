import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import Dashboard from "../src/components/pages/Dashboard";
import { Authentication } from "../src/data/Authentication";
import { getUserIdFromToken } from "../src/data/TokenUtility";
import { settings } from "../src/AppSettings";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Mock dependencies
jest.mock("../src/data/Authentication");
jest.mock("../src/data/TokenUtility");

// 🚫 Suppress console errors to remove noise in test output
beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
    (console.error as jest.Mock).mockRestore();
});

describe("Dashboard Component", () => {
    const mockUserData = {
        username: "TestUser",
        email: "test@example.com",
        date_of_birth: "2000-01-01",
        profilePicture: "/profile.jpg",
    };

    const mockFavoriteGames = { favorite_games: [{ _id: "game1", title: "Game 1" }] };
    const mockAllGames = [
        { _id: "game1", title: "Game 1" },
        { _id: "game2", title: "Game 2" },
        { _id: "game3", title: "Game 3" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper to mock fetch responses
    const mockFetch = (responses: Record<string, any>) => {
        global.fetch = jest.fn((input: RequestInfo) => {
            const url = input.toString();
            if (responses[url]) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve(responses[url]) });
            }
            return Promise.reject(new Error("Unknown URL: " + url));
        }) as jest.Mock;
    };

    test("renders user data", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("mock-token");
        (getUserIdFromToken as jest.Mock).mockReturnValue("user123");

        mockFetch({
            [`${settings.apiBaseUrl}/user/user123`]: mockUserData,
            [`${settings.apiBaseUrl}/user/user123/favorites`]: mockFavoriteGames,
            [`${settings.apiBaseUrl}/api/games`]: mockAllGames,
        });

        await act(async () => render(<Dashboard />));

        await waitFor(() => {
            expect(screen.getByText(mockUserData.username)).toBeInTheDocument();
            expect(screen.getByText(mockUserData.email)).toBeInTheDocument();
            expect(screen.getByAltText("Profile")).toHaveAttribute(
                "src",
                `${settings.apiBaseUrl}${mockUserData.profilePicture}`
            );
            expect(screen.getByText("Game 1")).toBeInTheDocument();
        });
    });

    test("shows error message if token is missing", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue(null);

        await act(async () => render(<Dashboard />));

        await waitFor(() => {
            expect(screen.getByText("User not found.")).toBeInTheDocument();
        });
    });

    test("shows error message if fetch fails", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("mock-token");
        (getUserIdFromToken as jest.Mock).mockReturnValue("user123");

        global.fetch = jest.fn(() => Promise.reject(new Error("Fetch failed"))) as jest.Mock;

        await act(async () => render(<Dashboard />));

        await waitFor(() => {
            expect(screen.getByText("User not found.")).toBeInTheDocument();
        });
    });

    test("can toggle edit mode and input fields", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("mock-token");
        (getUserIdFromToken as jest.Mock).mockReturnValue("user123");

        mockFetch({
            [`${settings.apiBaseUrl}/user/user123`]: mockUserData,
            [`${settings.apiBaseUrl}/user/user123/favorites`]: mockFavoriteGames,
            [`${settings.apiBaseUrl}/api/games`]: mockAllGames,
        });

        await act(async () => render(<Dashboard />));
        await waitFor(() => screen.getByText("Edit Profile"));

        fireEvent.click(screen.getByText("Edit Profile"));

        const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
        fireEvent.change(usernameInput, { target: { value: "NewName" } });
        expect(usernameInput.value).toBe("NewName");

        const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: "new@example.com" } });
        expect(emailInput.value).toBe("new@example.com");

        const searchInput = screen.getByPlaceholderText("Search games...") as HTMLInputElement;
        fireEvent.change(searchInput, { target: { value: "Game 2" } });
        expect(searchInput.value).toBe("Game 2");
        expect(screen.getByText("Game 2")).toBeInTheDocument();
    });

    test("can add and remove favorite games", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("mock-token");
        (getUserIdFromToken as jest.Mock).mockReturnValue("user123");

        mockFetch({
            [`${settings.apiBaseUrl}/user/user123`]: mockUserData,
            [`${settings.apiBaseUrl}/user/user123/favorites`]: { favorite_games: [] },
            [`${settings.apiBaseUrl}/api/games`]: mockAllGames,
        });

        await act(async () => render(<Dashboard />));

        fireEvent.click(screen.getByText("Edit Profile"));

        // Add game
        fireEvent.click(screen.getByText("Game 1"));
        await waitFor(() => {
            expect(screen.getByText("Game 1")).toHaveClass("btn-success");
        });

        // Remove game
        fireEvent.click(screen.getByText("Game 1"));
        await waitFor(() => {
            expect(screen.getByText("Game 1")).toHaveClass("btn-outline-secondary");
        });
    });

    test("can cancel editing", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("mock-token");
        (getUserIdFromToken as jest.Mock).mockReturnValue("user123");

        mockFetch({
            [`${settings.apiBaseUrl}/user/user123`]: mockUserData,
            [`${settings.apiBaseUrl}/user/user123/favorites`]: mockFavoriteGames,
            [`${settings.apiBaseUrl}/api/games`]: mockAllGames,
        });

        await act(async () => render(<Dashboard />));

        fireEvent.click(screen.getByText("Edit Profile"));
        fireEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
            expect(screen.getByText("Edit Profile")).toBeInTheDocument();
        });
    });

    test("navigates to edit reviews", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("mock-token");
        (getUserIdFromToken as jest.Mock).mockReturnValue("user123");

        mockFetch({
            [`${settings.apiBaseUrl}/user/user123`]: mockUserData,
            [`${settings.apiBaseUrl}/user/user123/favorites`]: mockFavoriteGames,
            [`${settings.apiBaseUrl}/api/games`]: mockAllGames,
        });

        await act(async () => render(<Dashboard />));

        fireEvent.click(screen.getByText("Edit Reviews"));
        expect(mockNavigate).toHaveBeenCalledWith("/my-reviews");
    });
});
