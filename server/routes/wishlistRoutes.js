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

// Adds game to the users wishlist
router.post("/add", async (req, res) => {
    try {
        const { userId, gameId } = req.body;

        if (!userId || !gameId) {
            return res.status(400).json({ error: "Missing userId or gameId" });
        }

        // Check if item exists and is active
        const existing = await Wishlist.findOne({
            user_id: userId,
            game_id: gameId,
            removed_at: null
        });

        if (existing) {
            return res.status(400).json({ error: "Game already in wishlist" });
        }

        // If it existed but has been soft-deleted will restore it
        const deletedItem = await Wishlist.findOne({
            user_id: userId,
            game_id: gameId,
            removed_at: { $ne: null }
        });

        if (deletedItem) {
            deletedItem.removed_at = null;
            // give it a new max weight
            const maxWeight = await Wishlist.find({ user_id: userId }).sort({ weight: -1 }).limit(1);
            deletedItem.weight = maxWeight.length > 0 ? maxWeight[0].weight + 1 : 1;
            await deletedItem.save();

            return res.json({ message: "Restored", id: deletedItem._id });
        }

        // Create new entry
        const maxWeight = await Wishlist.find({ user_id: userId })
            .sort({ weight: -1 })
            .limit(1);

        const nextWeight = maxWeight.length > 0 ? maxWeight[0].weight + 1 : 1;

        const newItem = await Wishlist.create({
            user_id: userId,
            game_id: gameId,
            weight: nextWeight,
            removed_at: null
        });

        // Load and return media (same as GET route)
        const media = await GameMedia.find({ game_id: gameId });

        const populatedGame = await Game.findById(gameId);

        res.json({
            ...newItem.toObject(),
            game_id: populatedGame,
            media
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add to wishlist" });
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

