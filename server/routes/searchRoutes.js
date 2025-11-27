import express from "express";
import { Game, GameMedia, Tag } from "../models/dbSetup.js";

const router = express.Router();


// Removing special characters from the search
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Learning resources used:
https://portswigger.net/web-security/nosql-injection,
https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection,
https://medium.com/@kater_akeren/data-sanitization-against-nosql-query-injection-in-mongodb-and-node-js-application-dad2ffca5f01
 */

// Validating the search query
function validateQuery(query) {
    if (!query || typeof query !== "string") return null;
    let search = query.trim();
    if (search.length === 0 || search.length > 100) return null;

    // Removing characters that could be used for injection
    search = search.replace(/[{};`|^\\<>]/g, "");
    // Removing the $, which is used in MongoDB queries
    search = search.replace(/\$/g, "");
    // Removing leading dots
    search = search.replace(/(^|\s)\./g, "$1");

    return search.length === 0 ? null : search;
}

// Getting search results
router.get("/", async (req, res) => {
    try {
        const raw = req.query.q;
        const q = validateQuery(raw);
        if (!q) {
            return res.status(400).json({ error: "Invalid query" });
        }
        // Regex for upper and lower case search
        const regex = new RegExp(escapeRegex(q), "i");
        try {
            const totalGames = await Game.countDocuments();
            const sample = await Game.find({}).limit(20).select("title body").lean();
        } catch (err) {
            console.warn("[search] failure reason:", err?.message || err);
        }

        // Checking title and body for matches to the search query
        const filter = { $or: [{ title: regex }, { body: regex }] };
        const games = await Game.find(filter).limit(50).lean();

        const formatted = await Promise.all(
            games.map(async (game) => {
                const gameId = game._id;
                const media = await GameMedia.findOne({ game_id: gameId, type: "icon" }).lean().catch(() => null);

                const tagsForGame = await Tag.find({ game_id: gameId })
                    .populate("accessibility_group_id")
                    .lean()
                    .catch(() => []);

                const simplifiedTags = (tagsForGame || [])
                    .map((tag) => tag.accessibility_group_id?.name)
                    .filter((name) => ["Visual", "Audio", "Motor", "Cognitive"].includes(name));

                return {
                    id: gameId?.toString(),
                    image: media?.url || "",
                    title: game.title,
                    description: game.body,
                    tags: simplifiedTags,
                };
            })
        );
        return res.json(formatted);
    } catch (err) {
        console.error("[search] Search error:", err);
        return res.status(500).json({ error: "Search failed" });
    }
});

export default router;
