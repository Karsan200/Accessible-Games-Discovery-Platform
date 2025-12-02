import React, { useState } from "react";
import DateSelect from "../common/DateSelect";
import PublisherSelect from "../common/PublisherSelect.tsx";
import GenreSelect from "../common/GenreSelect.tsx";
import {settings} from "../../AppSettings.ts";

export default function SubmitGame() {
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");
    const [accessibility, setAccessibility] = useState("");
    const [release_date, setRelease_date] = useState(""); // "YYYY-MM-DD"
    const [publisher_id, setPublisher_id] = useState("");
    const [age_rating, setAge_rating] = useState("");  //input as string
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

    // Ensure there is at most one empty field and it is at the end.
    // Also cap the total at 10 entries.
    function normalizeScreenshots(urls: string[]): { urls: string[]; flags: boolean[] } {
        const trimmed = urls.map((u) => u.trim());
        const nonEmpty: string[] = [];

        for (const u of trimmed) {
            if (u) nonEmpty.push(u);
        }

        let normalized: string[];
        if (nonEmpty.length === 0) {
            // No screenshots at all -> single empty field
            normalized = [""];
        } else if (nonEmpty.length >= 10) {
            // Max 10 non-empty screenshots, no blank field
            normalized = nonEmpty.slice(0, 10);
        } else {
            // Non-empty screenshots + one blank at the end
            normalized = [...nonEmpty, ""];
        }

        // Reset validity; previews will re-set flags onLoad
        const flags = new Array(normalized.length).fill(false);
        return { urls: normalized, flags };
    }

    function handleScreenshotClear(index: number) {
        setScreenshotUrls((prev) => {
            const next = [...prev];
            next[index] = ""; // clear this field

            const { urls, flags } = normalizeScreenshots(next);
            setScreenshotValidFlags(flags);
            return urls;
        });
    }

    // File: src/SubmitGame.tsx

    function handleScreenshotChange(index: number, value: string) {
        setScreenshotUrls((prev) => {
            const next = [...prev];
            next[index] = value;

            // If the field is truly cleared, normalise so blank is only at the end
            if (!value.trim()) {
                const { urls, flags } = normalizeScreenshots(next);
                setScreenshotValidFlags(flags);
                return urls;
            }

            // Just updating a non-empty URL: keep order, reset validity for this index
            setScreenshotValidFlags((prevFlags) => {
                const flags = [...prevFlags];
                if (index < flags.length) {
                    flags[index] = false;
                }
                // Ensure flags length is not shorter than urls
                while (flags.length < next.length) {
                    flags.push(false);
                }
                return flags;
            });

            return next;
        });
    }

    function handleScreenshotLoad(index: number) {
        // Mark this screenshot as valid
        setScreenshotValidFlags((prev) => {
            const next = [...prev];
            if (index < next.length) {
                next[index] = true;
            }
            return next;
        });

        // If this is the last field and under the max (10), append a new empty field
        setScreenshotUrls((prev) => {
            if (index !== prev.length - 1 || prev.length >= 10) {
                return prev;
            }
            return [...prev, ""];
        });
    }

    function handleScreenshotError(index: number) {
        // Mark as invalid on load error
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

        // reset prior error
        setAgeRatingError(null);

        let ageRatingNumber: number | undefined = undefined;

        if (age_rating.trim() !== "") {
            const n = Number(age_rating.trim());

            const INT32_MAX = 21;
            const INT32_MIN = 0;

            if (!Number.isInteger(n)) {
                setAgeRatingError("Age rating must be a whole number (no decimals).");
                return;
            }

            if (n < INT32_MIN || n > INT32_MAX) {
                setAgeRatingError(
                    `Age rating must be between ${INT32_MIN} and ${INT32_MAX}.`
                );
                return;
            }

            ageRatingNumber = n;
        }

        // Check at least one valid screenshot image (loaded successfully)
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

        // Build media payload: { type, url } entries
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

        console.log({
            title,
            tagline,
            description,
            details,
            accessibility,
            release_date, // ISO date string (YYYY-MM-DD) or empty if incomplete
            publisher_id, // selected publisher _id
            age_rating: ageRatingNumber,
            genre_ids,
            media, // array of { type, url }
        });

        const payload = {
            title,
            tagline,
            description,
            details,
            accessibility,
            release_date, // ISO date string (YYYY-MM-DD) or empty if incomplete
            publisher_id, // selected publisher _id
            age_rating: ageRatingNumber,
            genre_ids,
            media, // array of { type, url }
        };

        const res = await fetch(`${settings.apiBaseUrl}/api/games/with-media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            // Optional: try to read error details
            let msg = `Request failed with status ${res.status}`;
            try {
                const data = await res.json();
                if (data && typeof data.error === "string") {
                    msg = data.error;
                }
            } catch {
                // ignore JSON parse errors, keep default msg
            }
            alert(`Game submit failed: ${msg}`);
            return;
        }
        alert("Game submitted successfully!");

    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Submit a Game</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                    <label>Tagline:</label>
                    <input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>

                <div>
                    <label>Description:</label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div>
                    <label>Details:</label>
                    <input value={details} onChange={(e) => setDetails(e.target.value)} />
                </div>

                <div>
                    <label>Genres:</label>
                    <GenreSelect selected={genre_ids} onChange={setGenre_ids} />
                </div>


                <div>
                    <label>Accessibility:</label>
                    <input value={accessibility} onChange={(e) => setAccessibility(e.target.value)} />
                </div>

                <div>
                    <label>Release Date:</label>
                    <DateSelect value={release_date} onChange={setRelease_date} />
                </div>

                <div>
                    <label>Publisher:</label>
                    <PublisherSelect value={publisher_id} onChange={setPublisher_id} />
                </div>

                <div>
                    <label>
                        Age Rating:
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={21}
                            step={1}
                            value={age_rating}
                            onChange={(e) => setAge_rating(e.target.value)}
                            placeholder="e.g. 3, 7, 12, 16, 18"
                        />
                    </label>
                    {ageRatingError && (
                        <div style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                            {ageRatingError}
                        </div>
                    )}
                </div>

                <h2>Media</h2>
                {mediaError && (
                    <div style={{ color: "red", marginBottom: "8px" }}>{mediaError}</div>
                )}

                <div>
                    <label>
                        Icon URL (required):
                        <input
                            type="url"
                            placeholder=""
                            value={iconUrl}
                            onChange={(e) => setIconUrl(e.target.value)}
                        />
                    </label>
                    {iconUrl.trim() && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginLeft: "8px",
                                marginTop: "4px",
                                verticalAlign: "middle",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleIconClear}
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "2px",
                                    width: "20px",
                                    height: "20px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    padding: 0,
                                    lineHeight: "18px",
                                    fontSize: "12px",
                                }}
                                aria-label="Remove icon"
                            >
                                ×
                            </button>
                            <img
                                src={iconUrl}
                                alt="Icon preview"
                                style={{
                                    maxWidth: "64px",
                                    maxHeight: "64px",
                                    display: "block",
                                }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label>
                        Cover URL (required):
                        <input
                            type="url"
                            placeholder=""
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                        />
                    </label>
                    {coverUrl.trim() && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "4px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleCoverClear}
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "2px",
                                    width: "20px",
                                    height: "20px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    padding: 0,
                                    lineHeight: "18px",
                                    fontSize: "12px",
                                }}
                                aria-label="Remove cover"
                            >
                                ×
                            </button>
                            <img
                                src={coverUrl}
                                alt="Cover preview"
                                style={{ maxWidth: "200px", display: "block" }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label>Screenshots (at least 1 required):</label>
                    {screenshotUrls.map((url, index) => (
                        <div key={index} style={{ marginTop: index === 0 ? "4px" : "8px" }}>
                            <input
                                type="url"
                                placeholder=""
                                value={url}
                                onChange={(e) => handleScreenshotChange(index, e.target.value)}
                            />
                            {url.trim() && (
                                <div
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        marginLeft: "8px",
                                        marginTop: "4px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleScreenshotClear(index)}
                                        style={{
                                            position: "absolute",
                                            top: "2px",
                                            right: "2px",
                                            width: "20px",
                                            height: "20px",
                                            border: "none",
                                            borderRadius: "50%",
                                            background: "rgba(0,0,0,0.6)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            padding: 0,
                                            lineHeight: "18px",
                                            fontSize: "12px",
                                        }}
                                        aria-label="Remove screenshot"
                                    >
                                        ×
                                    </button>
                                    <img
                                        src={url}
                                        alt={`Screenshot ${index + 1} preview`}
                                        style={{
                                            maxWidth: "200px",
                                            display: "block",
                                        }}
                                        onLoad={() => handleScreenshotLoad(index)}
                                        onError={() => handleScreenshotError(index)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                        New screenshot fields appear automatically when an image loads, up to a maximum of 10.
                    </div>
                </div>

                <div>
                    <label>
                        Trailer URL (optional – YouTube):
                        <input
                            type="url"
                            placeholder=""
                            value={trailerUrl}
                            onChange={(e) => setTrailerUrl(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Concept art URL (optional):
                        <input
                            type="url"
                            placeholder=""
                            value={conceptArtUrl}
                            onChange={(e) => setConceptArtUrl(e.target.value)}
                        />
                    </label>
                    {conceptArtUrl.trim() && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "4px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleConceptArtClear}
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "2px",
                                    width: "20px",
                                    height: "20px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    padding: 0,
                                    lineHeight: "18px",
                                    fontSize: "12px",
                                }}
                                aria-label="Remove concept art"
                            >
                                ×
                            </button>
                            <img
                                src={conceptArtUrl}
                                alt="Concept art preview"
                                style={{ maxWidth: "200px", display: "block" }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label>
                        Other media URL (optional):
                        <input
                            type="url"
                            placeholder=""
                            value={otherMediaUrl}
                            onChange={(e) => setOtherMediaUrl(e.target.value)}
                        />
                    </label>
                    {otherMediaUrl.trim() && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginTop: "4px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleOtherMediaClear}
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "2px",
                                    width: "20px",
                                    height: "20px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    padding: 0,
                                    lineHeight: "18px",
                                    fontSize: "12px",
                                }}
                                aria-label="Remove other media"
                            >
                                ×
                            </button>
                            <img
                                src={otherMediaUrl}
                                alt="Other media preview"
                                style={{ maxWidth: "200px", display: "block" }}
                            />
                        </div>
                    )}
                </div>

                <button type="submit">Submit Game</button>
            </form>
        </div>
    );
}
