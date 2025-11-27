import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";
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

    useEffect(() => {
        const controller = new AbortController();
        const url = `${settings.apiBaseUrl.replace(/\/$/, "")}/api/search/options`;

        // Fetching available filter options
        fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to load options: ${r.status}`);
                return r.json();
            })
            // Setting fetched options
            .then((data) => {
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
    function toggleArrayItem(setArr: Dispatch<SetStateAction<string[]>>, value: string) {
        setArr((prev: string[]) =>
            prev.includes(value) ? prev.filter((x: string) => x !== value) : [...prev, value],
        );
    }

    // Apply selected filters
    function apply() {
        onApply({ genre: selectedGenres, accessibility: selectedAccessibility, sort });
        setOpenGenres(false);
        setOpenAccessibility(false);
    }

    // Rendering the filter bar
    return (
        <div className="filter-bar" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div className="filter-item" ref={genresRef} style={{ position: "relative" }}>
                <label>Filter: Genre</label>
                <button
                    type="button"
                    onClick={() => setOpenGenres((v) => !v)}
                    aria-expanded={openGenres}
                    style={{ width: "100%", textAlign: "left", padding: "10px" }}
                >
                    {selectedGenres.length ? selectedGenres.join(", ") : "All Genres"} ▾
                </button>

                {openGenres && (
                    <div
                        className="dropdown-panel"
                        style={{
                            position: "absolute",
                            zIndex: 30,
                            background: "#0b1220",
                            border: "1px solid rgba(255,255,255,0.06)",
                            padding: 12,
                            marginTop: 6,
                            width: "100%",
                            maxHeight: 280,
                            overflow: "auto",
                        }}
                    >
                        {options.genres.length === 0 ? (
                            <div style={{ padding: 8 }}>No genres available</div>
                        ) : (
                            options.genres.map((g) => (
                                <label key={g} style={{ display: "block", marginBottom: 8 }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(g)}
                                        onChange={() => toggleArrayItem(setSelectedGenres, g)}
                                    />{" "}
                                    {g}
                                </label>
                            ))
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <button type="button" onClick={() => setSelectedGenres([])}>
                                Clear
                            </button>
                            <button type="button" onClick={() => setOpenGenres(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-item" ref={accessibilityRef} style={{ position: "relative" }}>
                <label>Filter: Accessibility</label>
                <button
                    type="button"
                    onClick={() => setOpenAccessibility((v) => !v)}
                    aria-expanded={openAccessibility}
                    style={{ width: "100%", textAlign: "left", padding: "10px" }}
                >
                    {selectedAccessibility.length ? selectedAccessibility.join(", ") : "All Accessibility Features"} ▾
                </button>

                {openAccessibility && (
                    <div
                        className="dropdown-panel"
                        style={{
                            position: "absolute",
                            zIndex: 30,
                            background: "#0b1220",
                            border: "1px solid rgba(255,255,255,0.06)",
                            padding: 12,
                            marginTop: 6,
                            width: "100%",
                            maxHeight: 280,
                            overflow: "auto",
                        }}
                    >
                        {options.accessibility.length === 0 ? (
                            <div style={{ padding: 8 }}>No accessibility options</div>
                        ) : (
                            options.accessibility.map((name) => (
                                <label key={name} style={{ display: "block", marginBottom: 8 }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedAccessibility.includes(name)}
                                        onChange={() => toggleArrayItem(setSelectedAccessibility, name)}
                                    />{" "}
                                    {name}
                                </label>
                            ))
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <button type="button" onClick={() => setSelectedAccessibility([])}>
                                Clear
                            </button>
                            <button type="button" onClick={() => setOpenAccessibility(false)}>
                                Done
                            </button>
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
                    <button type="button" onClick={apply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
