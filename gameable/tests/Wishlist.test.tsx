import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Wishlist } from "../src/components/pages/Wishlist";

const mockRefreshToken = jest.fn();
jest.mock("../src/data/Authentication.ts", () => ({
    Authentication: { refreshToken: () => mockRefreshToken() }
}));

const mockGetUserId = jest.fn();
jest.mock("../src/data/TokenUtility.ts", () => ({
    getUserIdFromToken: (token: string) => mockGetUserId(token)
}));

const mockApiDataHelper = jest.fn();
jest.mock("../src/data/ApiDataHelper.tsx", () => ({
    ApiDataHelper: (url: string, options: any, auth: any) => mockApiDataHelper(url, options, auth)
}));

jest.mock("../src/components/WishlistGameCard.tsx", () => ({
    WishlistGameCard: ({ name }: any) => <div data-testid="wishlist-game-card">{name}</div>
}));

jest.mock("../src/components/BlackButton.tsx", () => ({
    BlackButton: ({ text, onClick }: any) => <button onClick={onClick}>{text}</button>
}));

jest.mock("../src/components/IconCheckbox.tsx", () => ({
    IconCheckbox: ({ id, onChange }: any) => (
        <input
            type="checkbox"
            data-testid={id}
            onChange={(e) => onChange?.(e.target.checked)}
        />
    )
}));

const mockWishlist = [
    { _id: "w1", weight: 1, game_id: { title: "Game 1", body: "Desc 1" }, media: [{ type: "cover", url: "cover1.png" }] },
    { _id: "w2", weight: 2, game_id: { title: "Game 2", body: "Desc 2" }, media: [{ type: "cover", url: "cover2.png" }] }
];

global.fetch = jest.fn();

describe("Wishlist Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRefreshToken.mockResolvedValue("mock-token");
        mockGetUserId.mockReturnValue("user123");
        mockApiDataHelper.mockResolvedValue({
            json: async () => mockWishlist
        });
        (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });
    });

    test("renders loading initially", async () => {
        const { getByText } = render(<Wishlist />);
        expect(await screen.findByText(/loading wishlist/i)).toBeInTheDocument();
    });

    test("renders wishlist header and undo button", async () => {
        render(<Wishlist />);
        await screen.findByText("My Wishlist");
        expect(screen.getByText("My Wishlist")).toBeInTheDocument();
        expect(screen.getByText("Undo")).toBeInTheDocument();
    });

    test("renders correct number of wishlist items", async () => {
        render(<Wishlist />);
        const cards = await screen.findAllByTestId("wishlist-game-card");
        expect(cards).toHaveLength(mockWishlist.length);
        expect(cards[0].textContent).toContain("Game 1");
        expect(cards[1].textContent).toContain("Game 2");
    });

    test("clicking Undo calls restoreLast (fetch)", async () => {
        render(<Wishlist />);
        const undoBtn = await screen.findByText("Undo");
        fireEvent.click(undoBtn);
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            "http://localhost:5000/wishlist/restore-last/user123",
            expect.objectContaining({ method: "PUT" })
        ));
    });

    test("clicking Up swaps item weights and calls fetch", async () => {
        render(<Wishlist />);
        const upButtons = await screen.findAllByText("Up");
        fireEvent.click(upButtons[1]);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/wishlist/w2/weight",
                expect.objectContaining({ method: "PATCH" })
            );
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/wishlist/w1/weight",
                expect.objectContaining({ method: "PATCH" })
            );
        });
    });

    test("clicking Down swaps item weights and calls fetch", async () => {
        render(<Wishlist />);
        const downButtons = await screen.findAllByText("Down");
        fireEvent.click(downButtons[0]); // Move Game 1 down

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/wishlist/w1/weight",
                expect.objectContaining({ method: "PATCH" })
            );
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/wishlist/w2/weight",
                expect.objectContaining({ method: "PATCH" })
            );
        });
    });

    test("checking Remove triggers softRemove (fetch)", async () => {
        render(<Wishlist />);
        const removeCheckbox = await screen.findByTestId("wishlist-w1");
        fireEvent.click(removeCheckbox);
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            "http://localhost:5000/wishlist/w1",
            expect.objectContaining({ method: "DELETE" })
        ));
    });
});

