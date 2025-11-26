import express from "express";
import { Review, Game } from "../models/dbSetup.js";

const router = express.Router();

/* Helper: detect invalid characters or patterns */
function containsInvalidChars(str) {
    if (!str) return false;
    const s = String(str);
    if (/[<>]/.test(s)) return true;
    if (/[\u0000-\u001F\u007F]/.test(s)) return true;
    if (/script/i.test(s)) return true;
    return false;
}

// POST: create a new review
router.post("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params;
        const { user_id, rating, body } = req.body;

        if (!rating || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Prevent duplicate reviews by the same user for the same game
        const existing = await Review.findOne({ game_id: gameId, user_id });
        if (existing) {
            return res.status(400).json({ error: "User has already reviewed this game" });
        }

        const cleanBody = (body || "").toString().trim();
        if (cleanBody.length > 1000) {
            return res.status(400).json({ error: "Review body too long" });
        }
        if (containsInvalidChars(cleanBody)) {
            return res.status(400).json({ error: "Review body contains invalid characters" });
        }

        // Make sure game exists
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ error: "Game not found" });

        // Create the review using the validated/trimmed body
        const review = await Review.create({
            user_id,
            game_id: gameId,
            rating: Number(rating),
            body: cleanBody,
            flagged: false,
        });

        res.status(201).json({ message: "Review created", review });
    } catch (err) {
        console.error("Review creation error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET: all reviews for a user (includes basic game title)
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const reviewsRaw = await Review.find({ user_id: userId })
            .populate({ path: "game_id", select: "title" })
            .lean();

        const reviews = (reviewsRaw || []).map(r => ({
            _id: r._id,
            rating: r.rating,
            body: r.body,
            game: r.game_id ? { _id: r.game_id._id, title: r.game_id.title } : null,
            createdAt: r.createdAt,
        }));

        res.json({ reviews });
    } catch (err) {
        console.error("Failed to load user reviews:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT: update a review (owner must match)
router.put("/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { user_id, rating, body } = req.body;

        if (!user_id || rating === undefined || rating === null) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const cleanBody = (body || "").toString().trim();
        if (cleanBody.length > 1000) {
            return res.status(400).json({ error: "Review body too long" });
        }
        if (containsInvalidChars(cleanBody)) {
            return res.status(400).json({ error: "Review body contains invalid characters" });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ error: "Review not found" });

        if (review.user_id.toString() !== String(user_id)) {
            return res.status(403).json({ error: "Not authorized to update this review" });
        }

        review.rating = Number(rating);
        review.body = cleanBody;
        await review.save();

        res.json({ message: "Review updated", review });
    } catch (err) {
        console.error("Review update error:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: remove a review (owner must match)
router.delete("/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { user_id } = req.body;
        if (!user_id) return res.status(400).json({ error: "Missing user_id" });

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ error: "Review not found" });

        if (review.user_id.toString() !== String(user_id)) {
            return res.status(403).json({ error: "Not authorized to delete this review" });
        }

        await Review.deleteOne({ _id: reviewId });
        res.json({ message: "Review deleted" });
    } catch (err) {
        console.error("Review delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
