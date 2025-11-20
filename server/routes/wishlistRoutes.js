import express from "express";
import { Wishlist, Game, GameMedia } from "../models/dbSetup.js";

const router = express.Router();

// Get a user's wishlist
router.get("/:userId", async (req, res) => {
    try {
        const items = await Wishlist.find({ user_id: req.params.userId })
            .sort({ weight: 1 })
            .populate("game_id");

        // Attach media (e.g., cover)
        const result = [];
        for (const item of items) {
            const media = await GameMedia.find({ game_id: item.game_id._id });
            result.push({
                ...item.toObject(),
                media
            });
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: "Error fetching wishlist" });
    }
});


// Remove from wishlist
router.delete("/:id", async (req, res) => {
    try {
        await Wishlist.findByIdAndDelete(req.params.id);
        res.json({ message: "Removed from wishlist" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

export default router;

