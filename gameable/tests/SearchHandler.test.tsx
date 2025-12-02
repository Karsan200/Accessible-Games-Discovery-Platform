import { render, fireEvent } from "@testing-library/react";
import React, { createRef } from "react";
import { SearchHandler } from "../src/data/SearchHandler";
import { sanitiseSearch } from "../src/data/InputSanitation";

// mocking the sanitiseSearch function
jest.mock("../src/data/InputSanitation", () => ({
    sanitiseSearch: jest.fn(),
}));

function TestComponent({ navigate }: { navigate: jest.Mock }) {
    const inputRef = createRef<HTMLInputElement>();

    return (
        <form onSubmit={SearchHandler(inputRef, navigate)}>
            <input ref={inputRef} defaultValue="test" />
            <button type="submit">Search</button>
        </form>
    );
}

describe("SearchHandler", () => {

    test("prevents the default form submission behaviour", () => {
        const navigate = jest.fn();

        (sanitiseSearch as jest.Mock).mockReturnValue("test");

        const ref = createRef<HTMLInputElement>();
        ref.current = { value: "test" } as HTMLInputElement;

        const handler = SearchHandler(ref, navigate);

        const dummyEvent = {
            preventDefault: jest.fn(),
        } as unknown as React.FormEvent;

        handler(dummyEvent);

        expect(dummyEvent.preventDefault).toHaveBeenCalled();
    });

    test("does not navigate when sanitised input is null", () => {
        const navigate = jest.fn();

        (sanitiseSearch as jest.Mock).mockReturnValue(null);

        const ref = createRef<HTMLInputElement>();
        ref.current = { value: "badInput" } as HTMLInputElement;

        const handler = SearchHandler(ref, navigate);

        const dummyEvent = {
            preventDefault: jest.fn(),
        } as unknown as React.FormEvent;

        handler(dummyEvent);

        expect(navigate).not.toHaveBeenCalled();
    });

    test("navigates with encoded search query when input is valid", () => {
        const navigate = jest.fn();

        (sanitiseSearch as jest.Mock).mockReturnValue("test value");

        const ref = createRef<HTMLInputElement>();
        ref.current = { value: "test value" } as HTMLInputElement;

        const handler = SearchHandler(ref, navigate);

        const dummyEvent = {
            preventDefault: jest.fn(),
        } as unknown as React.FormEvent;

        handler(dummyEvent);

        expect(navigate).toHaveBeenCalledWith("/search?q=test%20value");
    });

    test("reads input value from the ref correctly", () => {
        const navigate = jest.fn();

        (sanitiseSearch as jest.Mock).mockReturnValue("example");

        const ref = createRef<HTMLInputElement>();
        ref.current = { value: "example" } as HTMLInputElement;

        const handler = SearchHandler(ref, navigate);

        const dummyEvent = {
            preventDefault: jest.fn(),
        } as unknown as React.FormEvent;

        handler(dummyEvent);

        expect(sanitiseSearch).toHaveBeenCalledWith("example");
    });

    test("integrates correctly with a real form submission", () => {
        const navigate = jest.fn();

        (sanitiseSearch as jest.Mock).mockReturnValue("hello");

        const { getByText } = render(<TestComponent navigate={navigate} />);

        // triggering the form submit via button click
        fireEvent.click(getByText("Search"));

        expect(navigate).toHaveBeenCalledWith("/search?q=hello");
    });
});
