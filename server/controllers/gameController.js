// server/controllers/gameController.js
import { Game, GameMedia, Tag, AccessibilityGroup } from "../models/dbSetup.js";

// Get first 4 games for trending section
export const getTrendingGames = async (req, res) => {
    try {
        // Fetch first 4 games from DB
        const games = await Game.find().limit(4).populate("genre_id");

        // Fetch media (cover images) and accessibility tags for each game
        const trendingGames = await Promise.all(
            games.map(async (game) => {
                // Get cover image
                const media = await GameMedia.findOne({ game_id: game._id, type: "cover" });

                // Get tags with accessibility group names
                const tagsData = await Tag.find({ game_id: game._id }).populate("accessibility_group_id");
                const tags = tagsData.map((tag) => tag.accessibility_group_id.name);

                return {
                    id: game._id,
                    image: media?.url || "", // fallback if no cover
                    name: game.title,
                    description: game.body,
                    tags,
                };
            })
        );

        res.json(trendingGames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
