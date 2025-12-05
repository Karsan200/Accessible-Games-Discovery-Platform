import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import DateSelect from "../common/DateSelect";
import PublisherSelect from "../common/PublisherSelect.tsx";
import GenreSelect from "../common/GenreSelect.tsx";
import { settings } from "../../AppSettings.ts";
import "../../styles/SubmitGame.scss"

export default function SubmitGameForm() {
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");
    const [accessibility, setAccessibility] = useState("");
    const [release_date, setRelease_date] = useState(""); // "YYYY-MM-DD"
    const [publisher_id, setPublisher_id] = useState("");
    const [age_rating, setAge_rating] = useState(""); // input as string
    const [ageRatingError, setAgeRatingError] = useState<string | null>(null);
    const [genre_ids, setGenre_ids] = useState<string[]>([]);

    // Media URLs
    const [trailerUrl, setTrailerUrl] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [screenshotUrls, setScreenshotUrls] = useState<string[]>([""]); // dynamic list
    const [conceptArtUrl, setConceptArtUrl] = useState("");
    const [otherMediaUrl, setOtherMediaUrl] = useState("");

    // Validation / helper state
    const [mediaError, setMediaError] = useState<string | null>(null);

    // Track which screenshot URLs have successfully loaded as images
    const [screenshotValidFlags, setScreenshotValidFlags] = useState<boolean[]>([false]);

    function handleIconClear() {
        setIconUrl("");
    }

    function handleCoverClear() {
        setCoverUrl("");
    }

    function handleConceptArtClear() {
        setConceptArtUrl("");
    }

    function handleOtherMediaClear() {
        setOtherMediaUrl("");
    }

    // Ensure there is at most one empty screenshot field and it is at the end.
    // Also cap the total at 10 entries.
    function normalizeScreenshots(urls: string[]): { urls: string[]; flags: boolean[] } {
        const trimmed = urls.map((u) => u.trim());
        const nonEmpty: string[] = [];

        for (const u of trimmed) {
            if (u) nonEmpty.push(u);
        }

        let normalized: string[];
        if (nonEmpty.length === 0) {
            normalized = [""];
        } else if (nonEmpty.length >= 10) {
            normalized = nonEmpty.slice(0, 10);
        } else {
            normalized = [...nonEmpty, ""];
        }

        const flags = new Array(normalized.length).fill(false);
        return { urls: normalized, flags };
    }

    function handleScreenshotClear(index: number) {
        setScreenshotUrls((prev) => {
            const next = [...prev];
            next[index] = "";

            const { urls, flags } = normalizeScreenshots(next);
            setScreenshotValidFlags(flags);
            return urls;
        });
    }

    function handleScreenshotChange(index: number, value: string) {
        setScreenshotUrls((prev) => {
            const next = [...prev];
            next[index] = value;

            if (!value.trim()) {
                const { urls, flags } = normalizeScreenshots(next);
                setScreenshotValidFlags(flags);
                return urls;
            }

            setScreenshotValidFlags((prevFlags) => {
                const flags = [...prevFlags];
                if (index < flags.length) {
                    flags[index] = false;
                }
                while (flags.length < next.length) {
                    flags.push(false);
                }
                return flags;
            });

            return next;
        });
    }

    function handleScreenshotLoad(index: number) {
        setScreenshotValidFlags((prev) => {
            const next = [...prev];
            if (index < next.length) {
                next[index] = true;
            }
            return next;
        });

        setScreenshotUrls((prev) => {
            if (index !== prev.length - 1 || prev.length >= 10) {
                return prev;
            }
            return [...prev, ""];
        });
    }

    function handleScreenshotError(index: number) {
        setScreenshotValidFlags((prev) => {
            const next = [...prev];
            if (index < next.length) {
                next[index] = false;
            }
            return next;
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setAgeRatingError(null);

        let ageRatingNumber: number | undefined = undefined;

        if (age_rating.trim() !== "") {
            const n = Number(age_rating.trim());

            const INT_MIN = 0;
            const INT_MAX = 21; // domain constraint for your form

            if (!Number.isInteger(n)) {
                setAgeRatingError("Age rating must be a whole number (no decimals).");
                return;
            }

            if (n < INT_MIN || n > INT_MAX) {
                setAgeRatingError(`Age rating must be between ${INT_MIN} and ${INT_MAX}.`);
                return;
            }

            ageRatingNumber = n;
        }

        const hasValidScreenshot =
            screenshotValidFlags.some(
                (isValid, index) =>
                    isValid && screenshotUrls[index] && screenshotUrls[index].trim() !== ""
            );

        if (!iconUrl.trim() || !coverUrl.trim() || !hasValidScreenshot) {
            setMediaError(
                "Please provide an Icon URL, a Cover URL, and at least one valid Screenshot image URL."
            );
            return;
        }

        setMediaError(null);

        const trimmedScreenshotUrls = screenshotUrls
            .map((url) => url.trim())
            .filter((url) => url.length > 0);

        const media: { type: string; url: string }[] = [];

        if (iconUrl.trim()) {
            media.push({ type: "icon", url: iconUrl.trim() });
        }
        if (coverUrl.trim()) {
            media.push({ type: "cover", url: coverUrl.trim() });
        }
        for (const url of trimmedScreenshotUrls) {
            media.push({ type: "screenshot", url });
        }
        if (trailerUrl.trim()) {
            media.push({ type: "trailer", url: trailerUrl.trim() });
        }
        if (conceptArtUrl.trim()) {
            media.push({ type: "concept_art", url: conceptArtUrl.trim() });
        }
        if (otherMediaUrl.trim()) {
            media.push({ type: "other", url: otherMediaUrl.trim() });
        }

        const payload = {
            title,
            tagline,
            description,
            details,
            accessibility,
            release_date,
            publisher_id,
            age_rating: ageRatingNumber,
            genre_ids,
            media,
        };

        const res = await fetch(`${settings.apiBaseUrl}/api/games/with-media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            let msg = `Request failed with status ${res.status}`;
            try {
                const data = await res.json();
                if (data && typeof data.error === "string") {
                    msg = data.error;
                }
            } catch {
                // ignore JSON parse errors
            }
            alert(`Game submit failed: ${msg}`);
            return;
        }

        alert("Game submitted successfully!");
    }

    return (
        <Container className="submit-game-page py-4">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <h1 className="mb-4">Submit a Game</h1>

                    <Form onSubmit={handleSubmit} className="submit-game-form">
                        <Form.Group className="mb-3" controlId="gameTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameTagline">
                            <Form.Label>Tagline</Form.Label>
                            <Form.Control
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="description-textarea"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameDetails">
                            <Form.Label>Details</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="description-textarea"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameGenres">
                            <Form.Label>Genres</Form.Label>
                            <GenreSelect selected={genre_ids} onChange={setGenre_ids} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameAccessibility">
                            <Form.Label>Accessibility</Form.Label>
                            <Form.Control
                                type="text"
                                value={accessibility}
                                onChange={(e) => setAccessibility(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameReleaseDate">
                            <Form.Label>Release Date</Form.Label>
                            <div>
                                <DateSelect value={release_date} onChange={setRelease_date} />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gamePublisher">
                            <Form.Label>Publisher</Form.Label>
                            <div>
                                <PublisherSelect
                                    value={publisher_id}
                                    onChange={setPublisher_id}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameAgeRating">
                            <Form.Label>Age Rating</Form.Label>
                            <Form.Control
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={21}
                                step={1}
                                value={age_rating}
                                onChange={(e) => setAge_rating(e.target.value)}
                                placeholder="e.g. 3, 7, 12, 16, 18"
                            />
                            {ageRatingError && (
                                <Form.Text className="text-danger">
                                    {ageRatingError}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <h2 className="h4 mt-4">Media</h2>
                        {mediaError && (
                            <Form.Text className="text-danger d-block mb-2">
                                {mediaError}
                            </Form.Text>
                        )}

                        {/* Icon */}
                        <Form.Group className="mb-3" controlId="gameIcon">
                            <Form.Label>Icon URL (required)</Form.Label>
                            <Form.Control
                                type="url"
                                value={iconUrl}
                                onChange={(e) => setIconUrl(e.target.value)}
                            />
                            {iconUrl.trim() && (
                                <div className="position-relative d-inline-block ms-2 mt-2">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        type="button"
                                        onClick={handleIconClear}
                                        className="position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                        style={{ width: 24, height: 24 }}
                                        aria-label="Remove icon"
                                    >
                                        ×
                                    </Button>
                                    <img
                                        src={iconUrl}
                                        alt="Icon preview"
                                        style={{ maxWidth: 64, maxHeight: 64, display: "block" }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        {/* Cover */}
                        <Form.Group className="mb-3" controlId="gameCover">
                            <Form.Label>Cover URL (required)</Form.Label>
                            <Form.Control
                                type="url"
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                            />
                            {coverUrl.trim() && (
                                <div className="position-relative d-inline-block mt-2">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        type="button"
                                        onClick={handleCoverClear}
                                        className="position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                        style={{ width: 24, height: 24 }}
                                        aria-label="Remove cover"
                                    >
                                        ×
                                    </Button>
                                    <img
                                        src={coverUrl}
                                        alt="Cover preview"
                                        style={{ maxWidth: 200, display: "block" }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        {/* Screenshots */}
                        <Form.Group className="mb-3" controlId="gameScreenshots">
                            <Form.Label>
                                Screenshots (at least 1 required)
                            </Form.Label>
                            {screenshotUrls.map((url, index) => (
                                <div key={index} className="mb-2">
                                    <Form.Control
                                        type="url"
                                        value={url}
                                        onChange={(e) =>
                                            handleScreenshotChange(index, e.target.value)
                                        }
                                    />
                                    {url.trim() && (
                                        <div className="position-relative d-inline-block mt-2">
                                            <Button
                                                variant="dark"
                                                size="sm"
                                                type="button"
                                                onClick={() => handleScreenshotClear(index)}
                                                className="position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                                style={{ width: 24, height: 24 }}
                                                aria-label="Remove screenshot"
                                            >
                                                ×
                                            </Button>
                                            <img
                                                src={url}
                                                alt={`Screenshot ${index + 1} preview`}
                                                style={{ maxWidth: 200, display: "block" }}
                                                onLoad={() => handleScreenshotLoad(index)}
                                                onError={() => handleScreenshotError(index)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Form.Text muted>
                                New screenshot fields appear automatically when an image loads, up to a maximum of 10.
                            </Form.Text>
                        </Form.Group>

                        {/* Trailer */}
                        <Form.Group className="mb-3" controlId="gameTrailer">
                            <Form.Label>Trailer URL (optional – YouTube)</Form.Label>
                            <Form.Control
                                type="url"
                                value={trailerUrl}
                                onChange={(e) => setTrailerUrl(e.target.value)}
                            />
                        </Form.Group>

                        {/* Concept art */}
                        <Form.Group className="mb-3" controlId="gameConceptArt">
                            <Form.Label>Concept art URL (optional)</Form.Label>
                            <Form.Control
                                type="url"
                                value={conceptArtUrl}
                                onChange={(e) => setConceptArtUrl(e.target.value)}
                            />
                            {conceptArtUrl.trim() && (
                                <div className="position-relative d-inline-block mt-2">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        type="button"
                                        onClick={handleConceptArtClear}
                                        className="position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                        style={{ width: 24, height: 24 }}
                                        aria-label="Remove concept art"
                                    >
                                        ×
                                    </Button>
                                    <img
                                        src={conceptArtUrl}
                                        alt="Concept art preview"
                                        style={{ maxWidth: 200, display: "block" }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        {/* Other media */}
                        <Form.Group className="mb-3" controlId="gameOtherMedia">
                            <Form.Label>Other media URL (optional)</Form.Label>
                            <Form.Control
                                type="url"
                                value={otherMediaUrl}
                                onChange={(e) => setOtherMediaUrl(e.target.value)}
                            />
                            {otherMediaUrl.trim() && (
                                <div className="position-relative d-inline-block mt-2">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        type="button"
                                        onClick={handleOtherMediaClear}
                                        className="position-absolute top-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                        style={{ width: 24, height: 24 }}
                                        aria-label="Remove other media"
                                    >
                                        ×
                                    </Button>
                                    <img
                                        src={otherMediaUrl}
                                        alt="Other media preview"
                                        style={{ maxWidth: 200, display: "block" }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Button type="submit" variant="primary" className="mt-3">
                            Submit Game
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
