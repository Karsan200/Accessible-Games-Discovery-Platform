import express from "express";
import mongoose from "mongoose";
import { Game, Genre, Tag, AccessibilityGroup } from "../models/dbSetup.js";

const router = express.Router();

// GET /api/search/options
router.get("/options", async (req, res) => {
    try {
        console.log("GET /api/search/options called");
        // Fetch genres and accessibility groups
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
        // Extract query parameters
        const q = (req.query.q || "").trim();
        const genreParam = req.query.genre;
        const accessibilityParam = req.query.accessibility;
        const sort = req.query.sort || "relevance";

        console.log("GET /api/search");
        console.log("Received query params:", req.query);

        // === STEP 1: Build base match filter for text search ===
        const match = {};

        if (q) {
            // Escape special regex characters
            const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escapedQ, "i");

            match.$or = [
                { title: { $regex: regex } },
                { tagline: { $regex: regex } },
                { description: { $regex: regex } },
            ];
        }

        // Parse genre filter
        let genreNames = [];
        if (Array.isArray(genreParam)) {
            genreNames = genreParam.map(g => String(g).trim()).filter(Boolean);
        } else if (genreParam) {
            genreNames = String(genreParam).split(",").map(g => g.trim()).filter(Boolean);
        }

        // Convert genre names to genre IDs and filter games
        if (genreNames.length > 0) {
            const genres = await Genre.find({ name: { $in: genreNames } }, { _id: 1 }).lean();
            const genreIds = genres.map(g => g._id);

            if (genreIds.length > 0) {
                // Match games where genre_ids contains at least one of the selected genres
                match.genre_ids = { $in: genreIds };
            } else {
                // No matching genres found - return empty result set
                match._id = { $in: [] };
            }
        }

        // === STEP 3: Parse accessibility filter (array or CSV string) ===
        let accessibilityNames = [];
        if (Array.isArray(accessibilityParam)) {
            accessibilityNames = accessibilityParam;
        } else if (typeof accessibilityParam === "string") {
            accessibilityNames = accessibilityParam.split(",").map((name) => name.trim()).filter(Boolean);
        }

        // Filter games by accessibility using the Tags collection
        // Games must have ALL selected accessibility features (AND logic)
        let filteredGameIds = null;
        if (accessibilityNames.length > 0) {
            console.log("  Looking up accessibility groups:", accessibilityNames);

            // Convert accessibility names to group IDs
            const accessibilityGroups = await AccessibilityGroup.find({
                name: { $in: accessibilityNames },
            }).select("_id");

            const groupIds = accessibilityGroups.map((g) => g._id);

            console.log("  Found accessibility group IDs:", groupIds);

            if (groupIds.length > 0) {
                // Find all tags that match any of the selected accessibility groups
                const tags = await Tag.find({
                    accessibility_group_id: { $in: groupIds },
                }).select("game_id accessibility_group_id");

                // Group tags by game_id and count how many different accessibility groups each game has
                const gameAccessibilityCounts = {};
                tags.forEach((tag) => {
                    const gameIdStr = tag.game_id.toString();
                    if (!gameAccessibilityCounts[gameIdStr]) {
                        gameAccessibilityCounts[gameIdStr] = new Set();
                    }
                    gameAccessibilityCounts[gameIdStr].add(tag.accessibility_group_id.toString());
                });

                // Only include games that have ALL selected accessibility features
                const requiredCount = groupIds.length;
                filteredGameIds = Object.keys(gameAccessibilityCounts).filter(
                    (gameId) => gameAccessibilityCounts[gameId].size >= requiredCount
                );

                console.log("  Found game IDs with ALL selected accessibility features:", filteredGameIds);

                // Add game ID filter to match query
                if (filteredGameIds.length > 0) {
                    // Convert string IDs to ObjectId for MongoDB
                    const ObjectId = mongoose.Types.ObjectId;
                    match._id = { $in: filteredGameIds.map((id) => new ObjectId(id)) };
                } else {
                    // No games found with all selected accessibility features - return empty result
                    match._id = { $in: [] };
                }
            } else {
                // Invalid accessibility group names - return empty result
                match._id = { $in: [] };
            }
        }



        console.log("Running search pipeline");
        console.log("  q:", q);
        console.log("  genres:", genreNames);
        console.log("  accessibility:", accessibilityNames);
        console.log("  sort:", sort);
        console.log("Match filter before aggregation:", JSON.stringify(match, null, 2));

        // Build aggregation pipeline
        const pipeline = [
            // Match games based on filters
            { $match: match },
        ];

        // Lookup media to get game images
        pipeline.push({
            $lookup: {
                from: "gamemedias",
                localField: "_id",
                foreignField: "game_id",
                as: "media",
            },
        });

        // Lookup reviews for calculating average rating
        pipeline.push({
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "game_id",
                as: "reviews",
            },
        });

        // Lookup tags to get accessibility features for each game
        pipeline.push({
            $lookup: {
                from: "tags",
                localField: "_id",
                foreignField: "game_id",
                as: "tagDocs",
            },
        });

        // Add calculated fields
        pipeline.push({
            $addFields: {
                // Calculate average rating
                avgRating: {
                    $cond: [
                        { $gt: [{ $size: "$reviews" }, 0] },
                        { $avg: "$reviews.rating" },
                        0,
                    ],
                },
                // Extract accessibility tag names
                tags: "$tagDocs.name",
                // Count how much selected accessibility features this game has
                accessibilityMatchCount: {
                    $size: {
                        $filter: {
                            input: "$tagDocs",
                            as: "tag",
                            cond: accessibilityNames.length > 0
                                ? { $in: ["$$tag.name", accessibilityNames] }
                                : true,
                        },
                    },
                },
            },
        });

        // project only necessary fields for frontend
        pipeline.push({
            $project: {
                id: { $toString: "$_id" },
                title: 1,
                tagline: 1,
                description: 1,
                media: 1,
                genre_ids: 1,
                avgRating: 1,
                accessibilityMatchCount: 1,
                tags: 1,
            },
        });

        // Sort results
        if (sort === "rating") {
            // Sort by average rating (descending), then by title (ascending)
            pipeline.push({ $sort: { avgRating: -1, title: 1 } });
        } else if (sort === "accessibility") {
            // Sort by number of matching accessibility features (descending), then by title
            pipeline.push({ $sort: { accessibilityMatchCount: -1, title: 1 } });
        } else {
            // Default: Sort by relevance (title alphabetically)
            pipeline.push({ $sort: { title: 1 } });
        }

        // Execute aggregation
        const games = await Game.aggregate(pipeline).allowDiskUse(true);

        console.log("Search returned:", games.length, "games");

        res.json(games);

    } catch (err) {
        console.error("Search failed", err);
        res.status(500).json({ message: "Search failed" });
    }
});

export default router;
