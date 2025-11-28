import React, { useEffect, useRef, useState } from "react";
import { settings } from "../AppSettings.ts";

type Options = { genres: string[]; accessibility: string[] };
type Filters = { genre?: string[]; accessibility?: string[]; sort?: string };

interface FilterBarProps {
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
    const genresRef = useRef<HTMLDivElement | null>(null);
    const accessibilityRef = useRef<HTMLDivElement | null>(null);

    // Fetching available filter options
    // load options from server (no auth)
    useEffect(() => {
        const controller = new AbortController();
        const url = `${settings.apiBaseUrl.replace(/\/$/, "")}/api/search/options`;
        fetch(url, { signal: controller.signal })
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to load options: ${r.status}`);
                return r.json();
            })
            // Setting fetched options
            .then((data: { genres: string[]; accessibility: string[] }) => {
                console.log("Data:", data);
                setOptions({
                    genres: Array.isArray(data.genres) ? data.genres : [],
                    accessibility: Array.isArray(data.accessibility) ? data.accessibility : [],
                });
            })
            // Handling fetch errors
            .catch(() => {
                setOptions({ genres: [], accessibility: [] });
            });
        return () => controller.abort();
    }, []);

    // Closing dropdowns when clicking outside
    useEffect(() => {
        function handleDocClick(e: MouseEvent) {
            const tgt = e.target as Node;
            if (openGenres && genresRef.current && !genresRef.current.contains(tgt)) setOpenGenres(false);
            if (openAccessibility && accessibilityRef.current && !accessibilityRef.current.contains(tgt)) setOpenAccessibility(false);
        }
        document.addEventListener("click", handleDocClick);
        return () => document.removeEventListener("click", handleDocClick);
    }, [openGenres, openAccessibility]);

    // Function to toggle item in an array
    function toggleArrayItem(setArr: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
        setArr((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    }

    // Apply selected filters
    function apply() {
        onApply({ genre: selectedGenres, accessibility: selectedAccessibility, sort });
        setOpenGenres(false);
        setOpenAccessibility(false);
    }

    // Rendering the filter bar
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div ref={genresRef} style={{ position: "relative" }}>
                <label>Filter: Genre</label>
                <button type="button" onClick={() => setOpenGenres((v) => !v)}>
                    {selectedGenres.length ? selectedGenres.join(", ") : "All Genres"} ▾
                </button>
                {openGenres && (
                    <div style={{ position: "absolute", background: "white", border: "1px solid #ccc", padding: 12 }}>
                        {options.genres.length === 0 ? (
                            <div>No genres available</div>
                        ) : (
                            options.genres.map((g) => (
                                <div key={g}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedGenres.includes(g)}
                                            onChange={() => toggleArrayItem(setSelectedGenres, g)}
                                        />
                                        {g}
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

            <div ref={accessibilityRef} style={{ position: "relative" }}>
                <label>Filter: Accessibility</label>
                <button type="button" onClick={() => setOpenAccessibility((v) => !v)}>
                    {selectedAccessibility.length ? selectedAccessibility.join(", ") : "All Accessibility Features"} ▾
                </button>
                {openAccessibility && (
                    <div style={{ position: "absolute", background: "white", border: "1px solid #ccc", padding: 12 }}>
                        {options.accessibility.length === 0 ? (
                            <div>No accessibility options</div>
                        ) : (
                            options.accessibility.map((a) => (
                                <div key={a}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedAccessibility.includes(a)}
                                            onChange={() => toggleArrayItem(setSelectedAccessibility, a)}
                                        />
                                        {a}
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

            <div>
                <label>Sort By</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="accessibility">Accessibility</option>
                </select>
                <div style={{ marginTop: 8 }}>
                    <button type="button" onClick={apply}>Apply</button>
                </div>
            </div>
        </div>
    );
}
