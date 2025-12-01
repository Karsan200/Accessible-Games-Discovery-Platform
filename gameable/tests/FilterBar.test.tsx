import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterBar, { FilterBarProps } from "../src/components/FilterBar";
import "@testing-library/jest-dom";


jest.mock("../src/AppSettings", () => ({
    settings: {
        apiBaseUrl: "http://localhost:5000",
    },
}));


const mockOptions = {
    genres: ["Action", "RPG"],
    accessibility: ["Visual", "Audio"],
};

// mocking fetch for successful API response
const mockFetchSuccess = () =>
    (fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockOptions),
        })
    );

// mocking fetch for empty API response
const mockFetchEmpty = () =>
    (fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ genres: [], accessibility: [] }),
        })
    );

// mocking fetch for failed API response
const mockFetchFailure = () =>
    (fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
            ok: false,
        })
    );

// mocking fetch for network error
const mockFetchNetworkError = () =>
    (fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error("Network failure"))
    );

// setting up a global fetch mock before each test
global.fetch = jest.fn() as jest.Mock;
beforeEach(() => {
    mockFetchSuccess();
});

// function to render the component and capture the onApply callback
async function setup(initial?: FilterBarProps["initial"]) {
    const onApply = jest.fn();
    render(<FilterBar onApply={onApply} initial={initial} />);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
    });

    return { onApply };
}

describe("FilterBar Component", () => {
    // clearing mock history after each test run
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("fetches filter options on mount", async () => {
        await setup();

        // waiting for the API call to be made when the component mounts
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:5000/api/search/options",
                expect.any(Object)
            );
        });
    });

    test("renders genre and accessibility options", async () => {
        await setup();

        // opening the genre dropdown
        fireEvent.click(await screen.findByText("All Genres"));
        expect(await screen.findByLabelText("Action")).toBeTruthy();
        expect(await screen.findByLabelText("RPG")).toBeTruthy();

        // opening the accessibility dropdown
        fireEvent.click(screen.getByText("All Features"));
        expect(await screen.findByLabelText("Visual")).toBeTruthy();
        expect(await screen.findByLabelText("Audio")).toBeTruthy();
    });

    test("shows fallback text when no options are available", async () => {
        mockFetchEmpty();
        await setup();

        fireEvent.click(await screen.findByText("All Genres"));
        expect(await screen.findByText("No genres available")).toBeTruthy();

        fireEvent.click(screen.getByText("All Features"));
        expect(await screen.findByText("No accessibility options")).toBeTruthy();
    });

    test("allows selecting and deselecting a genre", async () => {
        await setup();

        fireEvent.click(await screen.findByText("All Genres"));

        const actionCheckbox = await screen.findByLabelText("Action");
        fireEvent.click(actionCheckbox);
        expect((actionCheckbox as HTMLInputElement).checked).toBe(true);

        // clicking again to deselect the option
        fireEvent.click(actionCheckbox);
        expect((actionCheckbox as HTMLInputElement).checked).toBe(false);
    });

    test("allows selecting and deselecting accessibility options", async () => {
        await setup();

        fireEvent.click(await screen.findByText("All Features"));

        const visualCheckbox = await screen.findByLabelText("Visual");
        fireEvent.click(visualCheckbox);
        expect((visualCheckbox as HTMLInputElement).checked).toBe(true);

        fireEvent.click(visualCheckbox);
        expect((visualCheckbox as HTMLInputElement).checked).toBe(false);
    });

    test("allows selecting multiple genres", async () => {
        await setup();

        fireEvent.click(await screen.findByText("All Genres"));
        fireEvent.click(await screen.findByLabelText("Action"));
        fireEvent.click(await screen.findByLabelText("RPG"));

        const actionCheckbox = screen.getByLabelText("Action") as HTMLInputElement;
        const rpgCheckbox = screen.getByLabelText("RPG") as HTMLInputElement;

        expect(actionCheckbox.checked).toBe(true);
        expect(rpgCheckbox.checked).toBe(true);
    });

    test("allows selecting multiple accessibility options", async () => {
        await setup();

        fireEvent.click(await screen.findByText("All Features"));
        fireEvent.click(await screen.findByLabelText("Visual"));
        fireEvent.click(await screen.findByLabelText("Audio"));

        const visualCheckbox = screen.getByLabelText("Visual") as HTMLInputElement;
        const audioCheckbox = screen.getByLabelText("Audio") as HTMLInputElement;

        expect(visualCheckbox.checked).toBe(true);
        expect(audioCheckbox.checked).toBe(true);
    });

    test("changes sort option", async () => {
        await setup();

        // selecting a new sort option
        const sortSelect = screen.getByDisplayValue("Relevance") as HTMLSelectElement;
        fireEvent.change(sortSelect, { target: { value: "rating" } });

        expect(sortSelect.value).toBe("rating");

        fireEvent.change(sortSelect, { target: { value: "accessibility" } });
        expect(sortSelect.value).toBe("accessibility");
    });

    test("applies selected filters when clicking Apply Filters", async () => {
        const { onApply } =  await setup();

        fireEvent.click(await screen.findByText("All Genres"));
        fireEvent.click(await screen.findByLabelText("Action"));

        fireEvent.click(screen.getByText("All Features"));
        fireEvent.click(await screen.findByLabelText("Visual"));

        fireEvent.change(screen.getByDisplayValue("Relevance"), {
            target: { value: "rating" },
        });

        fireEvent.click(screen.getByText("Apply Filters"));

        // checking that the selected filters are passed back correctly
        expect(onApply).toHaveBeenCalledWith({
            genre: ["Action"],
            accessibility: ["Visual"],
            sort: "rating",
        });
    });

    test("applies filters with no selections", async () => {
        const { onApply } = await setup();

        fireEvent.click(screen.getByText("Apply Filters"));

        expect(onApply).toHaveBeenCalledWith({
            genre: [],
            accessibility: [],
            sort: "relevance",
        });
    });

    test("clears all filters when Clear All is clicked", async () => {
        const { onApply } = await setup({
            genre: ["Action"],
            accessibility: ["Visual"],
            sort: "rating",
        });

        fireEvent.click(await screen.findByText("Clear All"));

        expect(onApply).toHaveBeenCalledWith({
            genre: [],
            accessibility: [],
            sort: "relevance",
        });
    });

    test("uses initial values when provided", async () => {
        await setup({
            genre: ["RPG"],
            accessibility: ["Audio"],
            sort: "rating",
        });

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        fireEvent.change(select, { target: { value: "rating" } });

        expect(select.value).toBe("rating");
        expect(await screen.findByText("RPG")).toBeTruthy();
        expect(screen.getByText("Audio")).toBeTruthy();
    });

    test("uses default empty values when initial is undefined", async () => {
        await setup();

        expect(await screen.findByText("All Genres")).toBeTruthy();
        expect(screen.getByText("All Features")).toBeTruthy();

        // checking that the default sort value is used
        expect(
            (screen.getByDisplayValue("Relevance") as HTMLSelectElement).value
        ).toBe("relevance");
    });

    test("handles API error when fetching options", async () => {
        // forcing a failed API response
        mockFetchFailure();
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        await setup();

        // waiting for the error to be logged
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error loading filter options:",
                expect.any(Error)
            );
        });

        fireEvent.click(await screen.findByText("All Genres"));
        expect(await screen.findByText("No genres available")).toBeTruthy();

        consoleSpy.mockRestore();
    });

    test("handles network error when fetching options", async () => {
        // checking handling of network failures
        mockFetchNetworkError();
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        await setup();

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error loading filter options:",
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });

    test("handles non-array response for genres and accessibility", async () => {
        // returning invalid data types from the API
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ genres: "invalid", accessibility: null }),
            })
        );

        await setup();

        fireEvent.click(await screen.findByText("All Genres"));
        expect(await screen.findByText("No genres available")).toBeTruthy();
    });

    test("displays selected genres in dropdown toggle", async () => {
        await setup({ genre: ["Action", "RPG"] });

        expect(await screen.findByText("Action, RPG")).toBeTruthy();
    });

    test("displays selected accessibility features in dropdown toggle", async () => {
        await setup({ accessibility: ["Visual", "Audio"] });

        expect(await screen.findByText("Visual, Audio")).toBeTruthy();
    });
});
