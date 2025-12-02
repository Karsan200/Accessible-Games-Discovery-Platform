import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/navbarAndFooter/navbar";
import { useAuth } from "../src/data/AuthContext";


// mock useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// mock auth context
jest.mock("../src/data/AuthContext", () => ({
    useAuth: jest.fn(),
}));

// mock token utility
jest.mock("../src/data/TokenUtility", () => ({
    getUserIdFromToken: () => "123",
}));

// mock API helper
jest.mock("../src/data/ApiDataHelper", () => ({
    ApiDataHelper: jest.fn(() =>
        Promise.resolve({
            ok: false,
        })
    ),
}));

// setup auth context
const mockSetAccessToken = jest.fn();
(useAuth as jest.Mock).mockReturnValue({
    accessToken: "mock-token",
    setAccessToken: mockSetAccessToken,
});

beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        })
    ) as jest.Mock;
});

// clear mocks after each test
afterEach(() => {
    (global.fetch as jest.Mock).mockClear();
});

describe("Navbar Component", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockSetAccessToken.mockClear();
    });

    test("renders logout button", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // checking for logout button to ensure user is logged in
        expect(screen.getByLabelText("Logout")).toBeTruthy();
    });

    test("logs out and navigates home", async () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        // pressing logout button
        fireEvent.click(screen.getByLabelText("Logout"));

        // waiting for the logout to complete
        await waitFor(() => {
            expect(mockSetAccessToken).toHaveBeenCalledWith(null);
        });

        // checking if the user is navigated to home
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("submits search and navigates", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // entering search query
        const input = screen.getByPlaceholderText("Search games...");
        fireEvent.change(input, { target: { value: "hello" } });
        fireEvent.click(screen.getByLabelText("Search"));

        // checking if navigation to search results occurred
        expect(mockNavigate).toHaveBeenCalledWith("/search?q=hello");
    });
});
