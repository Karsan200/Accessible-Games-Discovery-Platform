import express from "express";
import { Genre } from "../models/dbSetup.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const genres = await Genre.find().lean();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ error: String(err?.message ?? err) });
    }
});

// POST new genre
router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });
        const newGenre = new Genre({ name, description });
        await newGenre.save();
        res.status(201).json({ message: "Genre added", genre: newGenre });
    } catch (err) {
        res.status(500).json({ error: String(err?.message ?? err) });
    }
});

export default router;
