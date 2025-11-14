// server/routes/gameRoutes.js
import express from "express";
import { Game, GameMedia } from "../models/dbSetup.js";

const router = express.Router();

// Get all games
router.get("/", async (req, res) => {
    const games = await Game.find().populate("game_id");
    res.json(games);
});

// Get single game + media
router.get("/:id", async (req, res) => {
    const game = await Game.findById(req.params.id).populate("game_id");
    const media = await GameMedia.find({ game_id: req.params.id });
    res.json({ ...game.toObject(), media });
});

export default router;
