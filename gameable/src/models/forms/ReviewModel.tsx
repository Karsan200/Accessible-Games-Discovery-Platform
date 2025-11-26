import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import "./ReviewModel.css";

function hasControlChars(s: string) {
    for (let i = 0; i < s.length; i++) {
        const code = s.charCodeAt(i);
        if (code <= 0x1f || code === 0x7f) return true;
    }
    return false;
}

/* Adding Validation to prevent injection script */
function isValidReviewBody(body: string) {
    const maxLen = 1000;
    if (body === null || body === undefined) return false;
    const trimmed = body.trim();

    if (trimmed.length > maxLen) return false;
    if (trimmed.length === 0) return true; // allow empty review text

    // For non-empty text apply stricter checks
    if (/[<>]/.test(trimmed)) return false;
    if (/script/i.test(trimmed)) return false;
    if (hasControlChars(trimmed)) return false;
    return true;
}

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (rating: number, body: string) => void;
};

export default function ReviewModel({ open, onClose, onSubmit }: Props) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [body, setBody] = useState("");

    if (!open) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (rating <= 0) {
            alert("Please select at least 1 star.");
            return;
        }

        const trimmed = body.trim();
        if (!isValidReviewBody(trimmed)) {
            alert("Review invalid: please avoid special characters and keep it under 1000 characters.");
            return;
        }

        // send rating
        onSubmit(rating, trimmed);
        setRating(0);
        setBody("");
        onClose();
    };

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="rm-overlay" role="dialog" aria-modal="true">
            <div className="rm-modal" role="document" aria-labelledby="rm-title">
                <button className="rm-close" aria-label="Close" onClick={onClose}>
                    ×
                </button>

                <h3 id="rm-title" className="rm-title">Leave a review</h3>

                <form onSubmit={handleSubmit} className="rm-form">
                    <div className="rm-stars" aria-label="Rating">
                        {stars.map((s) => {
                            const filled = s <= (hover || rating);
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    className={`rm-star ${filled ? "filled" : ""}`}
                                    onClick={() => setRating(s)}
                                    onMouseEnter={() => setHover(s)}
                                    onMouseLeave={() => setHover(0)}
                                    aria-pressed={rating === s}
                                    aria-label={`${s} star${s > 1 ? "s" : ""}`}
                                >
                                    ★
                                </button>
                            );
                        })}
                    </div>

                    <label className="rm-label" htmlFor="reviewBody">Your Review</label>
                    <textarea
                        id="reviewBody"
                        className="rm-textarea"
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write about your experience (optional)..."
                    />

                    <div className="rm-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ marginLeft: 8 } as CSSProperties}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
