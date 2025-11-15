// server/controllers/gameController.js
import { Genre } from "../models/dbSetup.js";

export async function addGenre(req, res) {
    try {
        const { name, description } = req.body;

        const newGenre = new Genre({
            name,
            description
        });

        await newGenre.save();
        res.status(201).json({ message: "Genre added successfully", genre: newGenre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}