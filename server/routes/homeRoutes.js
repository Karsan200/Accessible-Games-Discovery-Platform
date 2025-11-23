import express from "express";
import { Game, GameMedia, Review, Tag } from "../models/dbSetup.js";

const router = express.Router();

async function loadImagesForGames(gameIds) {
    const media = await GameMedia.find({ game_id: { $in: gameIds }, type: { $in: ["icon", "cover"] } }).lean();
    const map = {};
    media.forEach((m) => {
        const key = String(m.game_id);
        // prefer icon, fall back to cover; first seen wins otherwise
        if (!map[key] || m.type === "icon") map[key] = m.url;
    });
    return map;
}

async function loadTagsForGames(gameIds) {
    const tags = await Tag.find({ game_id: { $in: gameIds } }).lean();

    // Map stored tag names to the client's expected labels
    const mapTagNameToLabel = (name) => {
        if (!name) return null;
        switch (name.toLowerCase()) {
            case "vision": return "Visual";
            case "hearing": return "Audio";
            case "motor": return "Motor";
            case "cognitive": return "Cognitive";
            default: return null;
        }
    };


    const map = {};
    tags.forEach((t) => {
        const key = String(t.game_id);
        const label = mapTagNameToLabel(t.name);
        if (!label) return;
        if (!map[key]) map[key] = [];
        if (!map[key].includes(label)) map[key].push(label);
    });

    return map;
}

// /api/home/trending
router.get("/trending", async (req, res) => {
    try {
        const games = await Game.find({}, "title tagline description release_date age_rating").lean();
        const ids = games.map((g) => g._id);
        const [images, tagsMap] = await Promise.all([loadImagesForGames(ids), loadTagsForGames(ids)]);

        const payload = games.map((g) => ({
            id: g._id,
            image: images[String(g._id)] || "",
            name: g.title,
            description: g.description || "",
            tagline: g.tagline || "",
            tags: tagsMap[String(g._id)] || [],
        }));

        res.json(payload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /api/home/top-sellers
// Fetches the 10 highest rated games
router.get("/top-sellers", async (req, res) => {
    try {
        // Aggregate reviews to get avg ratings
        const ratingAgg = await Review.aggregate([
            {
                $group: {
                    _id: "$game_id",
                    avgRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 }
                }
            },
            { $sort: { avgRating: -1 } },
            { $limit: 8 }
        ]);

        // extract the top 10 game IDs
        const topGameIds = ratingAgg.map(r => r._id);

        // convert agg to map for easy lookup later
        const ratingMap = Object.fromEntries(
            ratingAgg.map(r => [
                String(r._id),
                { rating: r.avgRating || 0, reviewCount: r.reviewCount }
            ])
        );

        // Fetch Games
        const games = await Game.find(
            { _id: { $in: topGameIds } },
            "title tagline description release_date age_rating"
        ).lean();

        // Load images tags for these games
        const [images, tagsMap] = await Promise.all([
            loadImagesForGames(topGameIds),
            loadTagsForGames(topGameIds)
        ]);

        // Construct payload
        const payload = games.map((g) => {
            const rm = ratingMap[String(g._id)] || { rating: 0, reviewCount: 0 };
            return {
                id: g._id,
                image: images[String(g._id)] || "",
                title: g.title,
                description: g.description || "",
                tagline: g.tagline || "",
                tags: tagsMap[String(g._id)] || [],
                rating: rm.rating,
                reviewCount: rm.reviewCount,
            };
        });

        // Sort rating from highest to lowest
        payload.sort((a, b) => b.rating - a.rating);

        res.json(payload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/hero", async (req, res) => {
    try {
        // return a few featured slides (limit 3)
        const games = await Game.find({}, "title tagline").limit(3).lean();
        const ids = games.map((g) => g._id);
        const images = await loadImagesForGames(ids);

        const slides = games.map((g) => ({
            id: g._id,
            image: images[String(g._id)] || "",
            title: g.title || g.tagline || "",
        }));

        res.json(slides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
