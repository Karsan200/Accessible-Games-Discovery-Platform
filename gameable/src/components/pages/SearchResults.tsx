import React, { useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {GameCard} from "../GameCard.tsx";
import {settings} from "../../AppSettings.ts";
import {Col, Container, Row} from "react-bootstrap";

export type TagType = "Visual" | "Audio" | "Motor" | "Cognitive";

export interface SearchResult {
    id: string;
    image: string;
    title: string;
    description?: string;
    tags: TagType[];
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
    // Const's for search results, loading status, and error message
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
                const r = await fetch(`${settings.apiBaseUrl}/auth/refresh`, {
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

            const url = `${settings.apiBaseUrl}/api/search?q=${encodeURIComponent(
                query
            )}`;

            const makeRequest = (token?: string) => {
                const headers: Record<string, string> = { Accept: "application/json" };
                if (token) headers["Authorisation"] = `Bearer ${token}`;
                return fetch(url, {
                    signal: controller.signal,
                    headers,
                });
            };

            try {
                let token = localStorage.getItem("accessToken") ?? undefined;
                let res = await makeRequest(token);

                // If unauthorised, attempt a refresh to get a new token and retry the request
                if (res.status === 401) {
                    const newToken = await callRefresh();
                    if (newToken) {
                        localStorage.setItem("accessToken", newToken);
                        token = newToken;
                        res = await makeRequest(token);
                    } else {
                        setError("Unauthorised: missing or invalid token");
                        return;
                    }
                }

                // If not found, set error message
                if (res.status === 404) {
                    const body = await res.text().catch(() => "");
                    setError(
                        `Search not found (404). ${body || "Ensure backend is running and `settings.apiBaseUrl` is correct."}`
                    );
                    console.log("404 response body:", body);
                    return;
                }

                // If response is not ok, set error message
                if (!res.ok) {
                    const body = await res.text();
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
                setResults(data);
            // Catching and handling errors
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
    }, [query]);

    // Prompting the user to enter a search query
    if (!query) return <div>Please enter a search query.</div>;
    // Returning loading message if still loading
    if (loading) return <div>Searching…</div>;
    // Returning the error message if there is an error
    if (error) return <div>Error: {error}</div>;
    // Checking if there are no results, or it is null and returning a message
    if (results.length === 0) return <div>No results found for &quot;{query}&quot;.</div>;

    return (
        <section role="region" aria-label={`Search results for ${query}`} className="my-5">
            <Container>
                <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
                    Search results for "{query}"
                </h1>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <p style={{ margin: 0 }}>
                        Showing {results.length} result{results.length !== 1 ? "s" : ""}.
                    </p>
                </div>

                <Row className="g-3 g-md-4 justify-content-center" role="list" aria-label="Search result list">
                    {results.map((r) => (
                        <Col
                            key={r.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            role="listitem"
                            className="d-flex justify-content-center"
                        >
                            <GameCard
                                image={r.image}
                                name={r.title}
                                description={r.description ?? ""}
                                tags={r.tags}
                                onClick={() => navigate(`/games/${r.id}`)}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
        );
    };
    export default SearchResults;
