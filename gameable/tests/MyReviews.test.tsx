import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyReviews from "../src/components/pages/MyReviews";

// ---- MOCKS ----

// Mock Authentication
jest.mock("../src/data/Authentication", () => ({
    Authentication: {
        refreshToken: jest.fn(() => Promise.resolve("mock-token"))
    }
}));

// Mock TokenUtility
jest.mock("../src/data/TokenUtility", () => ({
    getUserIdFromToken: jest.fn(() => "user123")
}));

// Prevent real alerts
window.alert = jest.fn();
window.confirm = jest.fn(() => true);

// ---- SAMPLE MOCK DATA ----
const mockReviews = [
    {
        _id: "r1",
        rating: 4,
        body: "Great game!",
        game: { _id: "g1", title: "Test Game" }
    }
];

const mockIcon = [{ url: "/icons/game1.png" }];

// ---- GLOBAL FETCH MOCK ----
global.fetch = jest.fn((url, opts) => {
    const u = url.toString();

    // Get Review
    if (u.includes("/api/reviews/user/")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ reviews: mockReviews })
        });
    }

    // Get icon
    if (u.includes("/api/games/g1/media?type=icon")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockIcon)
        });
    }

    // Save edit
    if (u.includes("/api/reviews/r1") && opts?.method === "PUT") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }

    // Delete review
    if (u.includes("/api/reviews/r1") && opts?.method === "DELETE") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }

    return Promise.reject("Unknown API");
}) as jest.Mock;

describe("MyReviews Component", () => {

    test("loads and displays user reviews", async () => {
        render(<MyReviews />);

        const title = await screen.findByText("Test Game");
        const body = await screen.findByText("Great game!");

        expect(title).toBeTruthy();
        expect(body).toBeTruthy();
    });


    test("enters edit mode when clicking Edit", async () => {
        render(<MyReviews />);

        const editBtn = await screen.findByText("Edit");
        fireEvent.click(editBtn);

        const textarea = await screen.findByRole("textbox");

        expect(textarea).toBeTruthy();
    });


    test("updates a review successfully", async () => {
        render(<MyReviews />);

        fireEvent.click(await screen.findByText("Edit"));

        const textarea = await screen.findByRole("textbox");
        fireEvent.change(textarea, { target: { value: "Updated text" } });

        const saveBtn = await screen.findByText("Save");
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/reviews/r1"),
                expect.objectContaining({ method: "PUT" })
            );
        });
    });


    test("deletes a review", async () => {
        render(<MyReviews />);

        const deleteBtn = await screen.findByText("Delete");
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/reviews/r1"),
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

});
