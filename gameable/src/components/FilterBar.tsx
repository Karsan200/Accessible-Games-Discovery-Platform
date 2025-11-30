import React, { useEffect, useState } from "react";
import { settings } from "../AppSettings";
import { Form, Button, Dropdown } from "react-bootstrap";

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

    function toggleArrayItem(setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
        setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    }

    function apply() {
        onApply({ genre: selectedGenres, accessibility: selectedAccessibility, sort });
    }

    function clearFilters() {
        setSelectedGenres([]);
        setSelectedAccessibility([]);
        setSort("relevance");
        onApply({ genre: [], accessibility: [], sort: "relevance" });
    }

    // Rendering the filter bar
    return (
        <div className="filter-bar bg-light p-4 rounded shadow-sm mb-4">
            <div className="row g-3 align-items-end">
                <div className="col-md-4">
                    <Form.Label className="fw-bold">Genre</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            className="w-100 text-start text-truncate"
                            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            title={selectedGenres.join(", ")}
                        >
                            {selectedGenres.length ? selectedGenres.join(", ") : "All Genres"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100 ps-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {options.genres.length === 0 ? (
                                <Dropdown.ItemText>No genres available</Dropdown.ItemText>
                            ) : (
                                options.genres.map((g) => (
                                    <Form.Check
                                        key={g}
                                        type="checkbox"
                                        id={`genre-${g}`}
                                        label={g}
                                        checked={selectedGenres.includes(g)}
                                        onChange={() => toggleArrayItem(setSelectedGenres, g)}
                                        className="px-3 py-1"
                                    />
                                ))
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="col-md-4">
                    <Form.Label className="fw-bold">Accessibility</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            className="w-100 text-start text-truncate"
                            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            title={selectedAccessibility.join(", ")}
                        >
                            {selectedAccessibility.length ? selectedAccessibility.join(", ") : "All Features"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100 ps-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {options.accessibility.length === 0 ? (
                                <Dropdown.ItemText>No accessibility options</Dropdown.ItemText>
                            ) : (
                                options.accessibility.map((a) => (
                                    <Form.Check
                                        key={a}
                                        type="checkbox"
                                        id={`access-${a}`}
                                        label={a}
                                        checked={selectedAccessibility.includes(a)}
                                        onChange={() => toggleArrayItem(setSelectedAccessibility, a)}
                                        className="px-3 py-1"
                                    />
                                ))
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="col-md-4">
                    <Form.Label className="fw-bold">Sort By</Form.Label>
                    <Form.Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-100">
                        <option value="relevance">Relevance</option>
                        <option value="rating">Rating</option>
                        <option value="accessibility">Accessibility</option>
                    </Form.Select>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="outline-secondary" onClick={clearFilters}>
                    Clear All
                </Button>
                <Button variant="primary" onClick={apply}>
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}
