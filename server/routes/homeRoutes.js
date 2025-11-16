import express from "express";
import { Game, GameMedia, Review, Tag, AccessibilityGroup } from "../models/dbSetup.js";

const router = express.Router();

// GET top sellers
router.get("/top-sellers", async (req, res) => {
    try {
        //Get all games
        const games = await Game.find();

        //Build the formatted response
        const formatted = await Promise.all(
            games.map(async (game) => {
                // Get icon image
                const media = await GameMedia.findOne({
                    game_id: game._id,
                    type: "icon",
                });

                // Get average rating
                const reviews = await Review.find({ game_id: game._id });
                const avgRating =
                    reviews.length > 0
                        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                        : 0;

                // Get tags & translate to "Visual" | "Audio" | "Motor" | "Cognitive"
                const tagsForGame = await Tag.find({ game_id: game._id }).populate(
                    "accessibility_group_id"
                );

                const simplifiedTags = tagsForGame
                    .map((tag) => tag.accessibility_group_id?.name)
                    .filter((name) =>
                        ["Visual", "Audio", "Motor", "Cognitive"].includes(name)
                    );

                return {
                    id: game._id.toString(),
                    image: media?.url || "",
                    title: game.title,
                    description: game.body,
                    tags: simplifiedTags,
                    rating: Math.round(avgRating), // integer 0–10
                };
            })
        );

        // Sort by rating (DESC)
        formatted.sort((a, b) => b.rating - a.rating);

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching top sellers" });
    }
});

// GET trending games
// TODO: Create algorithm that calculates most trending game
router.get("/trending", async (req, res) => {
    try {
        const games = await Game.find().sort({ release_date: -1 }).limit(4);

        const formatted = await Promise.all(
            games.map(async (game) => {
                const media = await GameMedia.findOne({
                    game_id: game._id,
                    type: "icon",
                });

                const tagsForGame = await Tag.find({ game_id: game._id }).populate(
                    "accessibility_group_id"
                );

                const simplifiedTags = tagsForGame
                    .map((tag) => tag.accessibility_group_id?.name)
                    .filter((name) =>
                        ["Visual", "Audio", "Motor", "Cognitive"].includes(name)
                    );

                return {
                    id: game._id.toString(),
                    image: media?.url || "",
                    name: game.title,
                    description: game.body,
                    tags: simplifiedTags,
                };
            })
        );

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch trending games" });
    }
});

export default router;
