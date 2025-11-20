import express from "express";
import { Wishlist, Game, GameMedia } from "../models/dbSetup.js";

const router = express.Router();

// Get a user's wishlist ACTIVE ONLY
router.get("/:userId", async (req, res) => {
    try {
        const items = await Wishlist.find({
            user_id: req.params.userId,
            removed_at: null // Only show active items
        })
            .sort({ weight: 1 })
            .populate("game_id");

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
        res.status(500).json({ error: "Failed to load wishlist" });
    }
});

// Soft remove from wishlist
router.delete("/:id", async (req, res) => {
    try {
        await Wishlist.findByIdAndUpdate(req.params.id, {
            removed_at: new Date()
        });

        res.json({ message: "Wishlist item removed (soft delete)" });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove item" });
    }
});

// Update Weighting
router.patch("/:id/weight", async (req, res) => {
    try {
        const { weight } = req.body;
        await Wishlist.findByIdAndUpdate(req.params.id, { weight });
        res.json({ message: "Weight updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update weight" });
    }
});

export default router;

