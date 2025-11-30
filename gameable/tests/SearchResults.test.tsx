import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchResults from "../src/components/pages/SearchResults";

// mocking game card and filter bar components
jest.mock("../src/components/GameCard.tsx", () => ({
    GameCard: ({ name, onClick }: { name: string; onClick: () => void }) => (
        <div data-testid="game-card" onClick={onClick}>
            {name}
        </div>
    ),
}));

// mocking FilterBar to simulate filter application
jest.mock("../src/components/FilterBar.tsx", () => (props: {
    onApply: (arg0: { genre: string[]; accessibility: string[]; sort: string; }) => void; }) => (
    <button
        data-testid="apply-filters"
        onClick={() =>
            props.onApply({
                genre: ["Action"],
                accessibility: ["Visual"],
                sort: "rating",
            })
        }
    >
        Apply Filters
    </button>
));

// mocking fetch responses
const mockResults = [
    {
        _id: "1",
        title: "Test Game",
        tags: ["Visual"],
        avgRating: 4.5,
        media: [{ type: "icon", url: "/icon1.png" }],
    },
    {
        _id: "2",
        title: "Another Game",
        tags: ["Audio"],
        avgRating: 3.8,
        media: [{ type: "icon", url: "/icon2.png" }],
    },
];

// fetch mock setup before each test
beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve(mockResults),
        })
    ) as jest.Mock;
});

// clearing mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// function to render component with router context
function renderWithRouter(initialUrl: string) {
    return render(
        <MemoryRouter initialEntries={[initialUrl]}>
            <Routes>
                <Route path="/search" element={<SearchResults />} />
                <Route path="/games/:id" element={<div>Game Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("SearchResults Component", () => {

    test("shows loading state initially", async () => {
        renderWithRouter("/search?q=test");
        expect(screen.getByText(/Searching/i)).toBeTruthy();
    });

    test("fetches and displays results", async () => {
        renderWithRouter("/search?q=test");

        const game1 = await screen.findByText("Test Game");
        const game2 = await screen.findByText("Another Game");

        expect(game1).toBeTruthy();
        expect(game2).toBeTruthy();
    });

    test("displays correct result count", async () => {
        renderWithRouter("/search?q=test");
        const count = await screen.findByText(/Showing 2 results/i);
        expect(count).toBeTruthy();
    });

    test("renders GameCard components", async () => {
        renderWithRouter("/search?q=test");
        const cards = await screen.findAllByTestId("game-card");
        expect(cards.length).toBe(2);
    });

    test("navigates when clicking a game card", async () => {
        renderWithRouter("/search?q=test");

        const card = await screen.findByText("Test Game");
        fireEvent.click(card);

        // Waiting for the router to update and render the destination page
        await waitFor(() => {
            expect(screen.getByText("Game Page")).toBeTruthy();
        });
    });

    test("handles empty query string", async () => {
        renderWithRouter("/search?q=");

        // Waiting until the fetch call has been triggered
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        // Extracting the first fetch URL that was called
        const call = (fetch as jest.Mock).mock.calls[0][0];
        expect(call).toContain("q=");
    });

    test("handles no results", async () => {
        // Override the next fetch call to return an empty results array
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve([]),
            })
        );

        renderWithRouter("/search?q=test");

        const message = await screen.findByText(/Showing 0 results/i);
        expect(message).toBeTruthy();
    });

    test("handles 404 error", async () => {
        // Mocking a 404 response from the API
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                text: () => Promise.resolve("Not found"),
            })
        );

        renderWithRouter("/search?q=test");

        const error = await screen.findByText(/Search not found \(404\)/i);
        expect(error).toBeTruthy();
    });

    test("handles invalid JSON response", async () => {
        // Mocking a response where the server does not return JSON
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                headers: { get: () => "text/html" },
                text: () => Promise.resolve("<html lang='en'>Error</html>"),
            })
        );

        renderWithRouter("/search?q=test");

        const error = await screen.findByText(/Invalid JSON response/i);
        expect(error).toBeTruthy();
    });

    test("handles 401 with successful refresh", async () => {
        let callCount = 0;

        // First API call returns 401, refresh succeeds, second API call succeeds
        (fetch as jest.Mock).mockImplementation((url: string) => {
            if (url.includes("/auth/refresh")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ accessToken: "new-token" }),
                });
            }

            callCount++;
            if (callCount === 1) {
                return Promise.resolve({ ok: false, status: 401 });
            }

            return Promise.resolve({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockResults),
            });
        });

        renderWithRouter("/search?q=test");

        await screen.findByText("Test Game");
        expect(callCount).toBe(2);
    });

    test("handles 401 with failed refresh", async () => {
        // Refresh token request also fails
        (fetch as jest.Mock).mockImplementation((url: string) => {
            if (url.includes("/auth/refresh")) {
                return Promise.resolve({ ok: false });
            }
            return Promise.resolve({ ok: false, status: 401 });
        });

        renderWithRouter("/search?q=test");

        const error = await screen.findByText(/Unauthorized and refresh failed/i);
        expect(error).toBeTruthy();
    });

    test("handles multiple genre and accessibility filters", async () => {
        renderWithRouter(
            "/search?q=test&genre=Action&genre=RPG&accessibility=Visual&accessibility=Audio"
        );

        // Waiting for the API call to be issued
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        // Inspecting the query parameters sent to the backend
        const call = (fetch as jest.Mock).mock.calls[0][0];
        expect(call).toContain("genre=Action");
        expect(call).toContain("genre=RPG");
        expect(call).toContain("accessibility=Visual");
        expect(call).toContain("accessibility=Audio");
    });

    test("handles CSV format fallback for filters (encoded)", async () => {
        renderWithRouter("/search?q=test&genre=Action,RPG&accessibility=Visual,Audio");

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        const call = (fetch as jest.Mock).mock.calls[0][0];
        expect(call).toContain("genre=Action%2CRPG");
        expect(call).toContain("accessibility=Visual%2CAudio");
    });

    test("handles missing media/icon safely", async () => {
        // Returning a game result with no icon media
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                headers: { get: () => "application/json" },
                json: () =>
                    Promise.resolve([
                        {
                            _id: "3",
                            title: "No Icon Game",
                            tags: ["Cognitive"],
                            media: [],
                        },
                    ]),
            })
        );

        renderWithRouter("/search?q=test");

        const game = await screen.findByText("No Icon Game");
        expect(game).toBeTruthy();
    });

    test("applies sort parameter", async () => {
        renderWithRouter("/search?q=test&sort=rating");

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        // Verifying that the sort value is passed to the API
        const call = (fetch as jest.Mock).mock.calls[0][0];
        expect(call).toContain("sort=rating");
    });

    test("applies filters and triggers a new fetch", async () => {
        renderWithRouter("/search?q=test");

        const btn = await screen.findByTestId("apply-filters");
        fireEvent.click(btn);

        // Confirming that applying filters causes a second API request
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });
});
