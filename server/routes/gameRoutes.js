import express from "express";
import { Game, GameMedia, Review, Tag, Genre } from "../models/dbSetup.js";

const router = express.Router();

// Light list
router.get("/", async (req, res) => {
    try {
        const games = await Game.find({}, "title description release_date age_rating").lean();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Full game by id: media, tags, reviews with user info, genres and rating
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findById(id).lean();
        if (!game) return res.status(404).json({ error: "Game not found" });

        const [media, tags, reviewsRaw, genres] = await Promise.all([
            GameMedia.find({ game_id: id }).lean(),
            Tag.find({ game_id: id }).lean(),
            Review.find({ game_id: id }).populate({ path: "user_id", select: "username profilePicture" }).lean(),
            Genre.find({ _id: { $in: (game.genre_ids || []) } }).lean(),
        ]);

        const reviews = (reviewsRaw || []).map((r) => ({
            _id: r._id,
            rating: r.rating,
            body: r.body,
            flagged: r.flagged,
            createdAt: r.createdAt,
            // include reviewer _id so frontend can detect the author
            user: r.user_id ? { _id: r.user_id._id, username: r.user_id.username, profilePicture: r.user_id.profilePicture } : null,
        }));

        const reviewCount = reviews.length;
        const rating =
            reviewCount > 0 ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviewCount : 0;

        res.json({
            ...game,
            media,
            tags,
            reviews,
            genres,
            rating,
            reviewCount,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
