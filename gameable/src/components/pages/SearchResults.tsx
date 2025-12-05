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
 * Handling loading and error
 * Displaying the search results using GameCard components
 */

export const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    // Prefer repeated params, fallback to CSV
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

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const FilterBarTyped = FilterBar as unknown as React.ComponentType<{
        onApply: (filters: { genre?: string[]; accessibility?: string[]; sort?: string }) => void;
        initial?: { genre: string[]; accessibility: string[]; sort: string };
    }>;

    // Fetch search results (now ALSO runs when query is empty)
    useEffect(() => {
        const controller = new AbortController();

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

        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            const qs = new URLSearchParams();
            qs.set("q", query); // empty string now allowed

            for (const g of genreList) qs.append("genre", g);
            for (const a of accessibilityList) qs.append("accessibility", a);

            qs.set("sort", sortParam);

            const baseUrl = settings.apiBaseUrl.replace(/\/$/, "");
            const url = `${baseUrl}/api/search?${qs.toString()}`;

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

                if (res.status === 404) {
                    const body = await res.text().catch(() => "");
                    setError(
                        `Search not found (404). ${body || "Ensure backend is running and settings.apiBaseUrl is correct."}`
                    );
                    return;
                }

                if (!res.ok) {
                    const body = await res.text().catch(() => "");
                    setError(`Search failed: ${res.status} ${body}`);
                    return;
                }

                const contentType = res.headers.get("content-type") || "";
                if (!contentType.includes("application/json")) {
                    const body = await res.text();
                    setError(`Invalid JSON response from server: ${body}`);
                    return;
                }

                const data: SearchResult[] = await res.json();
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
    }, [query, JSON.stringify(genreList), JSON.stringify(accessibilityList), sortParam]);

    if (loading) return <div>Searching…</div>;
    if (error) return <div>Error: {error}</div>;
    if (results.length === null) return <div>No results found.</div>;

    function buildSearchUrl(params: {
        q: string;
        genre?: string[] | null;
        accessibility?: string[];
        sort?: string;
    }) {
        const u = new URLSearchParams();
        if (params.q) u.set("q", params.q);
        if (params.genre?.length) {
            for (const g of params.genre) u.append("genre", g);
        }
        if (params.accessibility?.length) {
            for (const a of params.accessibility) u.append("accessibility", a);
        }
        if (params.sort) u.set("sort", params.sort);
        return `/search?${u.toString()}`;
    }

    function handleApplyFilters(filters: {
        genre?: string[];
        accessibility?: string[];
        sort?: string;
    }) {
        const target = buildSearchUrl({
            q: query,
            genre: filters.genre ?? null,
            accessibility: filters.accessibility ?? [],
            sort: filters.sort ?? "relevance",
        });
        navigate(target);
    }

    return (
        <section role="region" aria-label="Available Games:" className="my-5">
            <Container>
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
                                    description={r.tagline ?? ""}
                                    tags={r.tags}
                                    rating={r.avgRating ?? 0}
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
