// server/controllers/gameController.js
import { Game } from "../models/dbSetup.js";

export async function addGame(req, res) {
    try {
        const { title, body, release_date, publisher_id, genre_id, age_rating } = req.body;

        const newGame = new Game({
            title,
            body,
            release_date,
            publisher_id,
            genre_id,
            age_rating,
            last_update: new Date()
        });

        await newGame.save();
        res.status(201).json({ message: "Game added successfully", game: newGame });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}