import React, { useEffect, useRef, useState } from "react";
import { settings } from "../AppSettings";

type Options = { genres: string[]; accessibility: string[] };
type Filters = { genre?: string[]; accessibility?: string[]; sort?: string };

export interface FilterBarProps {
    onApply: (filters: Filters) => void;
    initial?: Filters;
}
/*
    * Filter bar for filtering search results by genre, accessibility, and sorting.
    * @param onApply - Callback function to apply the selected filters.
    * @param initial - Initial filter values.
    * @returns A filter bar component.
 */

export default function FilterBar({ onApply, initial }: FilterBarProps) {
    const [options, setOptions] = useState<Options>({ genres: [], accessibility: [] });
    const [selectedGenres, setSelectedGenres] = useState<string[]>(initial?.genre ?? []);
    const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(initial?.accessibility ?? []);
    const [sort, setSort] = useState<string>(initial?.sort ?? "relevance");

    const [openGenres, setOpenGenres] = useState(false);
    const [openAccessibility, setOpenAccessibility] = useState(false);

    const genresBtnRef = useRef<HTMLButtonElement | null>(null);
    const accessBtnRef = useRef<HTMLButtonElement | null>(null);
    const genresPanelRef = useRef<HTMLDivElement | null>(null);
    const accessPanelRef = useRef<HTMLDivElement | null>(null);

    const [genresPanelPos, setGenresPanelPos] = useState<{ left: number; top: number; width: number } | null>(null);
    const [accessPanelPos, setAccessPanelPos] = useState<{ left: number; top: number; width: number } | null>(null);

    // Fetching available filter options
    // load options from server (no auth)
    useEffect(() => {
        const ctl = new AbortController();
        fetch(`${settings.apiBaseUrl.replace(/\/$/, "")}/api/search/options`, { signal: ctl.signal })
            .then((r) => {
                if (!r.ok) throw new Error("options fetch failed");
                return r.json();
            })
            // Setting fetched options
            .then((data) =>
                setOptions({
                    genres: Array.isArray(data.genres) ? data.genres : [],
                    accessibility: Array.isArray(data.accessibility) ? data.accessibility : [],
                })
            )
            .catch((err: unknown) => {
                // Handling fetch errors
                if (err && typeof err === "object" && "name" in err && (err as Error).name === "AbortError") return;
                console.error("Error loading filter options:", err);
                setOptions({ genres: [], accessibility: [] });
            });
        return () => ctl.abort();
    }, []);

    // Closing dropdowns when clicking outside
    useEffect(() => {
        function rectContains(rect: DOMRect, x: number, y: number) {
            return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        }

        function onDocPointerDown(e: PointerEvent) {
            const px = e.clientX;
            const py = e.clientY;
            const tgt = e.target as Node | null;

            // prefer composedPath for robust containment checks (covers scrollbar / shadow targets)
            const path = (typeof e.composedPath === "function" ? (e.composedPath() as EventTarget[]) : []) as EventTarget[];

            if (openGenres) {
                const btn = genresBtnRef.current;
                const panel = genresPanelRef.current;
                let clickedInside = false;
                if (btn && tgt && btn.contains(tgt)) clickedInside = true;
                if (!clickedInside && panel && tgt && panel.contains(tgt)) clickedInside = true;
                if (!clickedInside && panel && path && path.includes(panel)) clickedInside = true;
                if (!clickedInside && panel) {
                    const rect = panel.getBoundingClientRect();
                    if (rectContains(rect, px, py)) clickedInside = true;
                }
                if (!clickedInside) setOpenGenres(false);
            }

            if (openAccessibility) {
                const btn = accessBtnRef.current;
                const panel = accessPanelRef.current;
                let clickedInside = false;
                if (btn && tgt && btn.contains(tgt)) clickedInside = true;
                if (!clickedInside && panel && tgt && panel.contains(tgt)) clickedInside = true;
                if (!clickedInside && panel && path && path.includes(panel)) clickedInside = true;
                if (!clickedInside && panel) {
                    const rect = panel.getBoundingClientRect();
                    if (rectContains(rect, px, py)) clickedInside = true;
                }
                if (!clickedInside) setOpenAccessibility(false);
            }
        }
        function onResizeOrScroll() {
            // close panels on resize/scroll to avoid wrong placement
            setOpenGenres(false);
            setOpenAccessibility(false);
        }
        document.addEventListener("pointerdown", onDocPointerDown);
        window.addEventListener("resize", onResizeOrScroll);
        window.addEventListener("scroll", onResizeOrScroll, true);
        return () => {
            document.removeEventListener("pointerdown", onDocPointerDown);
            window.removeEventListener("resize", onResizeOrScroll);
            window.removeEventListener("scroll", onResizeOrScroll, true);
        };
    }, [openGenres, openAccessibility]);

    function openGenresPanel() {
        const btn = genresBtnRef.current;
        if (!btn) {
            setOpenGenres((v) => !v);
            return;
        }
        const rect = btn.getBoundingClientRect();
        setGenresPanelPos({ left: rect.left, top: rect.bottom, width: rect.width });
        setOpenGenres(true);
        setOpenAccessibility(false);
    }

    function openAccessPanel() {
        const btn = accessBtnRef.current;
        if (!btn) {
            setOpenAccessibility((v) => !v);
            return;
        }
        const rect = btn.getBoundingClientRect();
        setAccessPanelPos({ left: rect.left, top: rect.bottom, width: rect.width });
        setOpenAccessibility(true);
        setOpenGenres(false);
    }

    function toggleArrayItem(setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
        setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    }

    function apply() {
        console.log("FilterBar apply:", { genre: selectedGenres, accessibility: selectedAccessibility, sort });
        onApply({ genre: selectedGenres, accessibility: selectedAccessibility, sort });
        setOpenGenres(false);
        setOpenAccessibility(false);
    }

    const panelBaseStyle: React.CSSProperties = {
        position: "fixed",
        zIndex: 9999,
        background: "white",
        border: "1px solid #ccc",
        padding: 12,
        maxHeight: 320,
        overflow: "auto",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    };

    // Rendering the filter bar
    return (
        <div className="filter-bar" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "start", overflow: "visible" }}>
            <div className="filter-item" style={{ position: "relative" }}>
                <label>Filter: Genre</label>
                <button ref={genresBtnRef} type="button" onClick={openGenresPanel} aria-expanded={openGenres} style={{ width: "100%", textAlign: "left", padding: "10px" }}>
                    {selectedGenres.length ? selectedGenres.join(", ") : "All Genres"} ▾
                </button>

                {openGenres && genresPanelPos && (
                    <div
                        ref={genresPanelRef}
                        style={{ ...panelBaseStyle, left: genresPanelPos.left, top: genresPanelPos.top, width: genresPanelPos.width }}
                        onPointerDown={(e) => e.stopPropagation()} // keep interactions inside panel from closing it
                    >
                        {options.genres.length === 0 ? (
                            <div>No genres available</div>
                        ) : (
                            options.genres.map((g) => (
                                <div key={g} style={{ marginBottom: 6 }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedGenres.includes(g)}
                                            onChange={() => toggleArrayItem(setSelectedGenres, g)}
                                        />
                                        <span>{g}</span>
                                    </label>
                                </div>
                            ))
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <button type="button" onClick={() => setSelectedGenres([])}>Clear</button>
                            <button type="button" onClick={() => setOpenGenres(false)}>Done</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-item" style={{ position: "relative" }}>
                <label>Filter: Accessibility</label>
                <button ref={accessBtnRef} type="button" onClick={openAccessPanel} aria-expanded={openAccessibility} style={{ width: "100%", textAlign: "left", padding: "10px" }}>
                    {selectedAccessibility.length ? selectedAccessibility.join(", ") : "All Accessibility Features"} ▾
                </button>
                {openAccessibility && accessPanelPos && (
                    <div
                        ref={accessPanelRef}
                        style={{ ...panelBaseStyle, left: accessPanelPos.left, top: accessPanelPos.top, width: accessPanelPos.width }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {options.accessibility.length === 0 ? (
                            <div>No accessibility options</div>
                        ) : (
                            options.accessibility.map((a) => (
                                <div key={a} style={{ marginBottom: 6 }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedAccessibility.includes(a)}
                                            onChange={() => toggleArrayItem(setSelectedAccessibility, a)}
                                        />
                                        <span>{a}</span>
                                    </label>
                                </div>
                            ))
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <button type="button" onClick={() => setSelectedAccessibility([])}>Clear</button>
                            <button type="button" onClick={() => setOpenAccessibility(false)}>Done</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-item">
                <label>Sort By</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "100%", padding: 10 }}>
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="accessibility">Accessibility</option>
                </select>
                <div className="filter-actions" style={{ marginTop: 8 }}>
                    <button type="button" onClick={apply}>Apply</button>
                </div>
            </div>
        </div>
    );
}
