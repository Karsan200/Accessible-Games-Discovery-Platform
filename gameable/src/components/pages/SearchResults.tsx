// File: `gameable/src/pages/SearchResults.tsx`
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GameCard } from "../GameCard.tsx";
import { settings } from "../../AppSettings.ts";
import { Col, Container, Row } from "react-bootstrap";
import FilterBar from "../FilterBar.tsx";

export type TagType = "Visual" | "Audio" | "Motor" | "Cognitive";

export interface SearchResult {
    _id: string;
    image?: string;
    title: string;
    description?: string;
    tags: TagType[];
    tagline?: string;
    genre_id?: string[];
    avgRating?: number;
    accessibilityMatchCount?: number;
    media?: Array<{ type: string; url: string }>;
}

/*
 * Reading the search query from the URL parameters
 * Fetching search results from the backend API
 * Handling loading, error, and no results states
 * Displaying the search results using GameCard components
 */

export const SearchResults: React.FC = () => {
    // Reading the search query from the URL parameters
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    // prefer repeated params, fallback to CSV if present
    const genreList = searchParams.getAll("genre");
    const accessibilityList = searchParams.getAll("accessibility");
    if (genreList.length === 0 && searchParams.get("genre")) {
        const raw = searchParams.get("genre") ?? "";
        if (raw) genreList.push(...raw.split(",").filter(Boolean));
    }
    if (accessibilityList.length === 0 && searchParams.get("accessibility")) {
        const raw = searchParams.get("accessibility") ?? "";
        if (raw) accessibilityList.push(...raw.split(",").filter(Boolean));
    }

    const sortParam = searchParams.get("sort") ?? "relevance";

    // Const's for search results, loading status, and error message
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // casting FilterBar to a typed component
    const FilterBarTyped = FilterBar as unknown as React.ComponentType<{
        onApply: (filters: { genre?: string[]; accessibility?: string[]; sort?: string }) => void;
        initial?: { genre: string[]; accessibility: string[]; sort: string };
    }>;

    // Hook to fetch search results when the query changes
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const controller = new AbortController();

        // Refreshing to get a new access token
        const callRefresh = async (): Promise<string | undefined> => {
            try {
                const r = await fetch(`${settings.apiBaseUrl.replace(/\/$/, "")}/auth/refresh`, {
                    method: "GET",
                    credentials: "include",
                    headers: { Accept: "application/json" },
                });
                if (!r.ok) return undefined;
                const body = await r.json();
                return body?.accessToken;
            } catch {
                return undefined;
            }
        };

        // Fetching search results from the backend API
        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            const qs = new URLSearchParams();
            qs.set("q", query);
            // append arrays as repeated params (genre=..., genre=...)
            for (const g of genreList) qs.append("genre", g);
            for (const a of accessibilityList) qs.append("accessibility", a);
            qs.set("sort", sortParam);

            const baseUrl = settings.apiBaseUrl.replace(/\/$/, "");
            const url = `${baseUrl}/api/search?${qs.toString()}`;
            console.log("Fetching search URL:", url, { query, genreList, accessibilityList, sortParam });

            const makeRequest = (token?: string) => {
                const headers: Record<string, string> = { Accept: "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;
                return fetch(url, {
                    signal: controller.signal,
                    headers,
                });
            };

            try {
                const token = localStorage.getItem("accessToken") ?? undefined;
                let res = await makeRequest(token);

                // If unauthorised, attempt a refresh to get a new token and retry the request
                if (res.status === 401) {
                    const newToken = await callRefresh();
                    if (newToken) {
                        res = await makeRequest(newToken);
                    } else {
                        setError("Unauthorized and refresh failed");
                        setLoading(false);
                        return;
                    }
                }

                // If not found, set error message
                if (res.status === 404) {
                    const body = await res.text().catch(() => "");
                    setError(
                        `Search not found (404). ${body || "Ensure backend is running and \\`settings.apiBaseUrl\\` is correct."}`
                    );
                    return;
                }

                // If response is not ok, set error message
                if (!res.ok) {
                    const body = await res.text().catch(() => "");
                    setError(`Search failed: ${res.status} ${body}`);
                    return;
                }

                // Ensuring the response is valid JSON
                const contentType = res.headers.get("content-type") || "";
                if (!contentType.includes("application/json")) {
                    const body = await res.text();
                    setError(`Invalid JSON response from server: ${body}`);
                    return;
                }

                const data: SearchResult[] = await res.json();
                // print each game so you can manually inspect DB fields
                data.forEach((g, i) => console.log(`Loaded game [${i}]:`, g));
                console.log("Search response length:", data.length);
                setResults(data);
            } catch (e: unknown) {
                const err = e as Error;
                if (err.name !== "AbortError") {
                    setError(err.message ?? "Unknown error");
                }
            } finally {
                setLoading(false);
            }
        };

        void fetchResults();
        return () => controller.abort();
        // serialize arrays in deps to avoid unnecessary fetches
    }, [query, JSON.stringify(genreList), JSON.stringify(accessibilityList), sortParam]);

    // Prompting the user to enter a search query
    if (!query) return <div>Please enter a search query.</div>;
    // Returning loading message if still loading
    if (loading) return <div>Searching…</div>;
    // Returning the error message if there is an error
    if (error) return <div>Error: {error}</div>;
    // Checking if there are no results, or it is null and returning a message
    if (results.length === 0) return <div>No results found for &quot;{query}&quot;.</div>;

    function buildSearchUrl(params: { q: string; genre?: string[] | null; accessibility?: string[]; sort?: string }) {
        const u = new URLSearchParams();
        if (params.q) u.set("q", params.q);
        if (params.genre && params.genre.length) {
            for (const g of params.genre) u.append("genre", g);
        }
        if (params.accessibility?.length) {
            for (const a of params.accessibility) u.append("accessibility", a);
        }
        if (params.sort) u.set("sort", params.sort);
        return `/search?${u.toString()}`;
    }

    // called by FilterBar -> updates URL which triggers fetch via useEffect
    function handleApplyFilters(filters: { genre?: string[]; accessibility?: string[]; sort?: string }) {
        console.log("handleApplyFilters called:", filters);
        const target = buildSearchUrl({
            q: query,
            genre: filters.genre ?? null,
            accessibility: filters.accessibility ?? [],
            sort: filters.sort ?? "relevance",
        });
        navigate(target);
    }

    return (
        <section role="region" aria-label={`Search results for ${query}`} className="my-5">
            <Container>
                <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
                    Search results for "{query}"
                </h1>

                <div className="filter-panel" style={{ marginBottom: 24 }}>
                    <FilterBarTyped
                        onApply={handleApplyFilters}
                        initial={{
                            genre: genreList,
                            accessibility: accessibilityList,
                            sort: sortParam,
                        }}
                    />
                </div>

                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <p style={{ margin: 0 }}>
                        Showing {results.length} result{results.length !== 1 ? "s" : ""}.
                    </p>
                </div>

                <Row className="g-3 g-md-4 justify-content-center" role="list" aria-label="Search result list">
                    {results.map((r) => {
                        // Extract icon URL from media array, same as TrendingGames
                        const iconMedia = r.media?.find((m) => m.type === "icon");
                        const imageUrl = iconMedia?.url || "";

                        return (
                            <Col
                                key={r._id}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                role="listitem"
                                className="d-flex justify-content-center"
                            >
                                <GameCard
                                    image={imageUrl}
                                    name={r.title}
                                    description={r.description ?? ""}
                                    tags={r.tags}
                                    onClick={() => navigate(`/games/${r._id}`)}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
};
export default SearchResults;
