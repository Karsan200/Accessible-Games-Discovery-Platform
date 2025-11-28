import express from "express";
import {
    Game,
    Genre,
    Tag,
    AccessibilityGroup,
    Review,
} from "../models/dbSetup.js";

const router = express.Router();

// GET /api/search/options
router.get("/options", async (req, res) => {
    try {
        console.log("GET /api/search/options called");
        const [genres, accessibility] = await Promise.all([
            Genre.find({}, { name: 1 }).sort({ name: 1 }).lean(),
            AccessibilityGroup.find({}, { name: 1 }).sort({ name: 1 }).lean(),
        ]);
        console.log("Found genres:", genres.length, "accessibility groups:", accessibility.length);
        res.json({
            genres: genres.map((g) => g.name),
            accessibility: accessibility.map((a) => a.name),
        });
    } catch (err) {
        console.error("Failed to load options", err);
        res.status(500).json({ message: "Failed to load options" });
    }
});

// GET /api/search
// Query params: q, genre (CSV), accessibility (CSV), sort
router.get("/", async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        const genreCsv = req.query.genre || "";
        const accessibilityCsv = req.query.accessibility || "";
        const sort = req.query.sort || "relevance";

        // Basic match: if q present, title/tagline/description partial match
        const match = {};
        if (q) {
            const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            match.$or = [
                { title: { $regex: re } },
                { tagline: { $regex: re } },
                { description: { $regex: re } },
            ];
        }

        // If genre names provided, convert to ids and require intersection
        if (genreCsv) {
            const names = String(genreCsv).split(",").map(s => s.trim()).filter(Boolean);
            if (names.length) {
                const genres = await Genre.find({ name: { $in: names } }, { _id: 1 }).lean();
                const genreIds = genres.map(g => g._id);
                if (genreIds.length) match.genre_id = { $in: genreIds };
            }
        }

        // If accessibility names provided, find game ids that have tags referencing those groups
        let accessibilityGameIds = null;
        if (accessibilityCsv) {
            const names = String(accessibilityCsv).split(",").map(s => s.trim()).filter(Boolean);
            if (names.length) {
                const groups = await AccessibilityGroup.find({ name: { $in: names } }, { _id: 1 }).lean();
                const groupIds = groups.map(g => g._id);
                if (groupIds.length) {
                    const tags = await Tag.find({ accessibility_id: { $in: groupIds } }, { game_id: 1 }).lean();
                    accessibilityGameIds = tags.map(t => String(t.game_id));
                    if (accessibilityGameIds.length) match._id = { $in: accessibilityGameIds };
                    else match._id = { $in: [] }; // no matches
                }
            }
        }

        // Build simple aggregate to return required fields and compute avg rating
        const pipeline = [{ $match: match }];

        // lookup reviews to compute avgRating
        pipeline.push({
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "game_id",
                as: "reviews",
            },
        });
        pipeline.push({
            $addFields: {
                avgRating: { $cond: [{ $gt: [{ $size: "$reviews" }, 0] }, { $avg: "$reviews.rating" }, 0] },
            },
        });

        // project only necessary fields for frontend
        pipeline.push({
            $project: {
                title: 1,
                tagline: 1,
                description: 1,
                image: 1,
                genre_id: 1,
                avgRating: 1,
            },
        });

        // simple sorts
        if (sort === "rating") pipeline.push({ $sort: { avgRating: -1 } });
        else if (sort === "accessibility") pipeline.push({ $sort: { title: 1 } }); // placeholder - refine if needed
        else pipeline.push({ $sort: { title: 1 } });

        console.log("Running search pipeline, q:", q, "genre:", genreCsv, "accessibility:", accessibilityCsv, "sort:", sort);
        const games = await Game.aggregate(pipeline).allowDiskUse(true);
        console.log("Search returned:", games.length);
        res.json(games);
    } catch (err) {
        console.error("Search failed", err);
        res.status(500).json({ message: "Search failed" });
    }
});

export default router;
