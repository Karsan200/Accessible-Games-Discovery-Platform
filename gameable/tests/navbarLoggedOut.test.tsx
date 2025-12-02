import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavbarLoggedOut from "../src/components/navbarAndFooter/navbarLoggedOut";

// mock navigate for SearchHandler
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("NavbarLoggedOut", () => {

    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders navigation links", () => {
        render(
            <MemoryRouter>
                <NavbarLoggedOut />
            </MemoryRouter>
        );

        // checking the navbar has all the navigation links
        expect(screen.getByText("Game Able")).toBeInTheDocument();
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Games")).toBeInTheDocument();
        expect(screen.getByText("Wishlist")).toBeInTheDocument();
        expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    test("login button exists and is correctly configured", () => {
        render(
            <MemoryRouter>
                <NavbarLoggedOut />
            </MemoryRouter>
        );

        // checking the login button exists to ensure the user is logged out
        const loginBtn = screen.getByLabelText("Login");
        expect(loginBtn).toBeTruthy();
        expect(loginBtn.tagName).toBe("BUTTON");
    });



    test("submits search and navigates", () => {
        render(
            <MemoryRouter>
                <NavbarLoggedOut />
            </MemoryRouter>
        );

        // Entering a search and checking if the user is navigated to the correct page
        const input = screen.getByPlaceholderText("Search games...");
        fireEvent.change(input, { target: { value: "testGame" } });
        fireEvent.click(screen.getByLabelText("Search"));
        expect(mockNavigate).toHaveBeenCalledWith("/search?q=testGame");
    });
});
