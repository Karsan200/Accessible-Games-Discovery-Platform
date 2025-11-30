import * as React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
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
jest.mock("../src/models/forms/ReviewModel", () => ({
    __esModule: true,
    default: function ReviewModelMock({
                                          onClose,
                                          onSubmit,
                                      }: {
        onClose: () => void;
        onSubmit?: (rating: number, body: string) => void;
    }) {
        const [rating, setRating] = React.useState(0);
        const [body, setBody] = React.useState("");
        const [open, setOpen] = React.useState(true);

        if (!open) return null;

        return (
            <div role="dialog">
                <p>Review Modal</p>
                <div>
                    {[1, 2, 3, 4, 5].map((r) => (
                        <button
                            key={r}
                            aria-label={`${r} stars`}
                            onClick={() => setRating(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <textarea
                    aria-label="Your Review"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <button
                    onClick={async () => {
                        if (onSubmit) await onSubmit(rating, body);
                        setOpen(false);
                        onClose();
                    }}
                >
                    Submit
                </button>
                <button
                    onClick={() => {
                        setOpen(false);
                        onClose();
                    }}
                >
                    Close
                </button>
            </div>
        );
    },
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

// Mock refreshToken
const mockRefreshToken = jest.fn();
jest.mock("../src/data/Authentication", () => ({
    Authentication: {
        refreshToken: () => mockRefreshToken()
    }
}));

// Mock getUserIdFromToken
const mockGetUserFromToken = jest.fn();
jest.mock("../src/data/TokenUtility", () => ({
    getUserIdFromToken: () => mockGetUserFromToken()
}));

/// Mock fetch globally (single source of truth)
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Default implementation for fetch
mockFetch.mockImplementation((url: any) => {
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

    // Generic fallback
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
    });
});



describe("GamePage Component", () => {
    test("renders game title", async () => {
        render(<GamePage/>);
        const titles = await screen.findAllByText(/Test Game/i);
        // There are multiple, just check one exists
        expect(titles.length).toBeGreaterThan(0);
    });

    test("renders game description", async () => {
        render(<GamePage/>);
        const descriptions = await screen.findAllByText(/A great test game/i);
        expect(descriptions.length).toBeGreaterThan(0);
    });

    test("renders carousel with correct number of media items", async () => {
        render(<GamePage/>);
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
        render(<GamePage/>);
        const review1 = await screen.findAllByText("Amazing!");
        const review2 = await screen.findAllByText("Good game");
        expect(review1.length).toBeGreaterThan(0);
        expect(review2.length).toBeGreaterThan(0);
    });

    test("renders tags", async () => {
        render(<GamePage/>);
        const tags = await screen.findAllByTestId("tags");
        expect(tags.length).toBeGreaterThan(0);
        expect(tags[0].textContent).toContain("Visual");
        expect(tags[0].textContent).toContain("Audio");
    });

    test("renders stars for overall rating", async () => {
        render(<GamePage/>);

        // Find the element that contains the numeric rating
        const rating = await screen.findByText(/4\.5 stars/i);

        // Assert the text contains the correct rating
        expect(rating.textContent).toContain("4.5");
    });
});

describe("Review Component", () => {

    test("opens review modal when clicking Add a Review", async () => {
        mockRefreshToken.mockResolvedValue("mock-token");
        mockGetUserFromToken.mockReturnValue("user123");

        mockGame.reviews = []; // user has not reviewed
        mockFetch
            .mockResolvedValueOnce({ok: true, json: async () => mockGame}) // game fetch
            .mockResolvedValueOnce({ok: true, json: async () => mockGame}) // refresh after review
            .mockResolvedValue({ok: true, json: async () => mockGame});

        render(<GamePage/>);

        const btn = await screen.findByRole("button", {name: "Add a Review"});
        fireEvent.click(btn);

        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("selects rating and enters review text", async () => {
        mockRefreshToken.mockResolvedValue("mock-token");
        mockGetUserFromToken.mockReturnValue("user123");

        mockGame.reviews = [];
        mockFetch
            .mockResolvedValueOnce({ok: true, json: async () => mockGame}) // initial load
            .mockResolvedValue({ok: true, json: async () => mockGame});

        render(<GamePage/>);

        // open the review modal
        const addReviewBtn = await screen.findByRole("button", {name: "Add a Review"});
        fireEvent.click(addReviewBtn);

        // wait for the stars button to appear
        const star4 = await screen.findByRole("button", {name: "4 stars"});
        fireEvent.click(star4);

        // type in the textarea
        const textarea = screen.getByLabelText("Your Review") as HTMLTextAreaElement;
        fireEvent.change(textarea, {target: {value: "Great game!"}});

        // assert
        expect(textarea.value).toBe("Great game!");
    });


    test("submits review with correct payload", async () => {
        mockRefreshToken.mockResolvedValue("mock-token");
        mockGetUserFromToken.mockReturnValue("user123");

        mockGame.reviews = [];
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => mockGame }) // initial game load
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })     // POST submit review
            .mockResolvedValueOnce({ ok: true, json: async () => mockGame }); // refreshed game

        render(<GamePage />);

        // Open the review modal
        fireEvent.click(await screen.findByRole("button", { name: "Add a Review" }));

        // Select 5 stars
        fireEvent.click(await screen.findByRole("button", { name: "5 stars" }));

        // Enter review text
        fireEvent.change(screen.getByLabelText("Your Review"), { target: { value: "Amazing!" } });

        // Submit the review
        fireEvent.click(screen.getByRole("button", { name: "Submit" }));

        // Wait until modal disappears
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

        // Find the POST call dynamically
        const reviewCall = mockFetch.mock.calls.find(
            ([url, options]) =>
                url === "http://localhost:5000/api/reviews/123" &&
                options.method === "POST"
        );

        expect(reviewCall).toBeDefined();
        expect(reviewCall![1]).toEqual(
            expect.objectContaining({
                method: "POST",
                headers: expect.any(Object),
                body: JSON.stringify({
                    user_id: "user123",
                    rating: 5,
                    body: "Amazing!"
                })
            })
        );
    });



    test("modal closes after successful submit", async () => {
        mockRefreshToken.mockResolvedValue("mock-token");
        mockGetUserFromToken.mockReturnValue("user123");

        mockGame.reviews = [];
        mockFetch
            .mockResolvedValueOnce({ok: true, json: async () => mockGame}) // initial game load
            .mockResolvedValueOnce({ok: true, json: async () => ({})}) // POST submit review
            .mockResolvedValueOnce({ok: true, json: async () => mockGame});

        render(<GamePage/>);

        fireEvent.click(await screen.findByRole("button", {name: "Add a Review"}));

        // click 3 stars
        fireEvent.click(screen.getByRole("button", {name: "3 stars"}));

        fireEvent.change(screen.getByLabelText("Your Review"), {
            target: {value: "Good!"}
        });

        fireEvent.click(screen.getByRole("button", {name: "Submit"}));

        // wait for modal to actually disappear
        await waitFor(() => {
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });
});