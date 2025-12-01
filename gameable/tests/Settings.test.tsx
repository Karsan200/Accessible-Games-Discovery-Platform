import * as React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Settings from "../src/components/pages/settings";
import { Authentication } from "../src/data/Authentication";
import { MemoryRouter } from "react-router-dom";
import FloatingVoiceNavigation from "../src/components/voiceNavigation/VoiceNavigationOverlay";

jest.mock("../src/data/Authentication", () => ({
    Authentication: { refreshToken: jest.fn() }
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Settings Component - FontType & FontSize", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.className = "";
    });

    test("loads initial font settings and applies classes", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("token123");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                fontType: true,
                fontSize: true,
                voiceNavigation: false,
                navigationLocation: false,
            }),
        });

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

        // Get font type row and checkbox
        const fontTypeRow = screen.getByText(/Dyslexic font/i).closest(".setting-row");
        if (!fontTypeRow) throw new Error("Font type row not found");
        const fontTypeCheckbox = within(fontTypeRow as HTMLElement).getByRole("checkbox") as HTMLInputElement;

        // Get font size row and checkbox
        const fontSizeRow = screen.getByText(/Large Font Size/i).closest(".setting-row");
        if (!fontSizeRow) throw new Error("Font size row not found");
        const fontSizeCheckbox = within(fontSizeRow as HTMLElement).getByRole("checkbox") as HTMLInputElement;

        expect(fontTypeCheckbox.checked).toBe(true);
        expect(fontSizeCheckbox.checked).toBe(true);
        expect(document.body.classList.contains("dyslexic-font")).toBe(true);
        expect(document.body.classList.contains("large-font")).toBe(true);
    });

    test("toggles dyslexic font correctly", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("token123");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ fontType: false, fontSize: false }),
        });
        // Mock PATCH response
        mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

        const fontTypeRow = screen.getByText(/Dyslexic font/i).closest(".setting-row");
        if (!fontTypeRow) throw new Error("Font type row not found");
        const fontTypeCheckbox = within(fontTypeRow as HTMLElement).getByRole("checkbox") as HTMLInputElement;

        expect(fontTypeCheckbox.checked).toBe(false);
        expect(document.body.classList.contains("dyslexic-font")).toBe(false);

        fireEvent.click(fontTypeCheckbox);

        await waitFor(() => {
            expect(fontTypeCheckbox.checked).toBe(true);
            expect(document.body.classList.contains("dyslexic-font")).toBe(true);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/users/me/font"),
            expect.objectContaining({
                method: "PATCH",
                body: JSON.stringify({ fontType: true }),
                headers: expect.any(Object),
            })
        );
    });

    test("toggles large font correctly", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("token123");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ fontType: false, fontSize: false }),
        });
        mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

        const fontSizeRow = screen.getByText(/Large Font Size/i).closest(".setting-row");
        if (!fontSizeRow) throw new Error("Font size row not found");
        const fontSizeCheckbox = within(fontSizeRow as HTMLElement).getByRole("checkbox") as HTMLInputElement;

        expect(fontSizeCheckbox.checked).toBe(false);
        expect(document.body.classList.contains("large-font")).toBe(false);

        fireEvent.click(fontSizeCheckbox);

        await waitFor(() => {
            expect(fontSizeCheckbox.checked).toBe(true);
            expect(document.body.classList.contains("large-font")).toBe(true);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/users/me/fontSize"),
            expect.objectContaining({
                method: "PATCH",
                body: JSON.stringify({ fontSize: true }),
                headers: expect.any(Object),
            })
        );
    });
});

describe("Settings Component - Voice Navigation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = `<div class="vn-box vn-hidden"></div>`;
    });

    test("loads initial voice nav settings and applies classes", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("token123");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                fontType: false,
                fontSize: false,
                voiceNavigation: true,
                navigationLocation: true,
            }),
        });

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

        const vnBox = document.querySelector(".vn-box");
        expect(vnBox).not.toBeNull();
        await waitFor(() => expect(vnBox).toHaveClass("vn-hidden"));
        await waitFor(() => expect(vnBox).toHaveClass("vn-left"));
    });

    test("toggles voice navigation correctly", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("token123");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                fontType: false,
                fontSize: false,
                voiceNavigation: false,
                navigationLocation: false,
            }),
        });
        mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

        const voiceNavRow = screen.getByText(/Toggle to turn off the voice navigation module/i)
            .closest(".setting-row");
        const voiceNavCheckbox = within(voiceNavRow!).getByRole("checkbox") as HTMLInputElement;
        expect(voiceNavCheckbox.checked).toBe(false);

        fireEvent.click(voiceNavCheckbox);

        await waitFor(() => expect(voiceNavCheckbox.checked).toBe(true));

        const vnBox = document.querySelector(".vn-box");
        expect(vnBox).not.toBeNull();
        await waitFor(() => expect(vnBox).toHaveClass("vn-hidden"));

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/users/me/voiceNav"),
            expect.objectContaining({
                method: "PATCH",
                body: JSON.stringify({ voiceNavigation: true }),
                headers: expect.any(Object),
            })
        );
    });

    test("toggles voice nav location correctly", async () => {
        (Authentication.refreshToken as jest.Mock).mockResolvedValue("token123");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                fontType: false,
                fontSize: false,
                voiceNavigation: true,
                navigationLocation: false,
            }),
        });
        mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

        const voiceNavLocationRow = screen.getByText(/Toggle to move the voice navigation location/i)
            .closest(".setting-row");
        const navLocationCheckbox = within(voiceNavLocationRow!).getByRole("checkbox") as HTMLInputElement;
        expect(navLocationCheckbox.checked).toBe(false);

        fireEvent.click(navLocationCheckbox);

        await waitFor(() => expect(navLocationCheckbox.checked).toBe(true));

        const vnBox = document.querySelector(".vn-box");
        expect(vnBox).not.toBeNull();
        await waitFor(() => expect(vnBox).toHaveClass("vn-left"));
    });
})
