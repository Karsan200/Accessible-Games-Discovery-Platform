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
            rating,
            body: cleanBody,
            flagged: false,
        });

        res.status(201).json({ message: "Review created", review });
    } catch (err) {
        console.error("Review creation error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
