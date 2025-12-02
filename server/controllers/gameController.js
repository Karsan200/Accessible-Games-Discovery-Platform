import { Game, GameMedia } from "../models/dbSetup.js";

export async function addGameWithMedia(req, res) {
    try {
        const {
            title,
            tagline,
            description,
            details,
            accessibility,
            release_date,
            publisher_id,
            genre_ids,
            age_rating,
            media, // array of { type, url }
        } = req.body;

        // 1) Create the game
        const newGame = new Game({
            title,
            tagline,
            description,
            details,
            accessibility,
            release_date,
            publisher_id,
            genre_ids,
            age_rating,
            last_update: new Date(),
        });

        await newGame.save();

        // 2) Create media if provided
        let createdMedia = [];
        if (Array.isArray(media) && media.length > 0) {
            const docs = media.map((m) => ({
                game_id: newGame._id,
                type: m.type,
                url: m.url,
                description: m.description ?? "",
            }));
            createdMedia = await GameMedia.insertMany(docs);
        }

        // 3) Return combined result
        res.status(201).json({
            message: "Game and media added successfully",
            game: newGame,
            media: createdMedia,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
