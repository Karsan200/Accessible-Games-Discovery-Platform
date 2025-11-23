import express from "express";
import { Review, Game } from "../models/dbSetup.js";

const router = express.Router();

// POST: create a new review
router.post("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params;
        const { user_id, rating, body } = req.body;

        if (!rating || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Make sure game exists
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ error: "Game not found" });

        // Create the review
        const review = await Review.create({
            user_id,
            game_id: gameId,
            rating,
            body: body || "",
            flagged: false,
        });

        res.status(201).json({ message: "Review created", review });
    } catch (err) {
        console.error("Review creation error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
