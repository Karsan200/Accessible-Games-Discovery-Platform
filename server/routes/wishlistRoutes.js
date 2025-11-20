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

// Delete Functions -  call fetch(`/api/wishlist/${id}?hard=true`, { method: "DELETE" }) for hard delete
router.delete("/:id", async (req, res) => {
    try {
        const hardDelete = req.query.hard === "true";

        if (hardDelete) {
            await Wishlist.findByIdAndDelete(req.params.id);
            return res.json({ message: "Hard delete complete" });
        }

        await Wishlist.findByIdAndUpdate(req.params.id, {
            removed_at: new Date()
        });

        res.json({ message: "Soft delete complete" });

    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
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

// Restore a wishlist item that has
router.put("/restore/:id", async (req, res) => {
    try {
        await Wishlist.findByIdAndUpdate(req.params.id, {
            removed_at: null
        });

        res.json({ message: "Wishlist item restored" });
    } catch (err) {
        res.status(500).json({ error: "Failed to restore item" });
    }
});

// Restore the most recently removed item -- usage for undo button
router.put("/restore-last/:userId", async (req, res) => {
    try {
        const item = await Wishlist.findOne({
            user_id: req.params.userId,
            removed_at: { $ne: null }
        }).sort({ removed_at: -1 });

        if (!item) return res.status(404).json({ message: "No items to restore" });

        item.removed_at = null;
        await item.save();

        res.json({ message: "Last removed wishlist item restored", item });
    } catch (err) {
        res.status(500).json({ error: "Failed to restore last item" });
    }
});

export default router;

