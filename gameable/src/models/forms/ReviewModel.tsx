import { useState } from "react";
import type { CSSProperties } from "react";
import "./ReviewModel.css";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating <= 0) return; // require at least 1 star
        onSubmit(rating, body.trim());
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

                    <label className="rm-label" htmlFor="reviewBody">Your review</label>
                    <textarea
                        id="reviewBody"
                        className="rm-textarea"
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write about your experience..."
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
