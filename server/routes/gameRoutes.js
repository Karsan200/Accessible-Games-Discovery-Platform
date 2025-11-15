// server/routes/gameRoutes.js
import express from "express";
import { Game, GameMedia } from "../models/dbSetup.js";
import {addGame} from "../controllers/gameController";
import {addPublisher} from "../controllers/publisherController";
import {addGenre} from "../controllers/genreController";

const router = express.Router();

// Get all games
router.get("/", async (req, res) => {
    const games = await Game.find().populate("genre_id");
    res.json(games);
});

// Get single game + media
router.get("/:id", async (req, res) => {
    const game = await Game.findById(req.params.id).populate("genre_id");
    const media = await GameMedia.find({ game_id: req.params.id });
    res.json({ ...game.toObject(), media });
});

router.post("/", addGame);
router.post("/", addPublisher);
router.put("/", addGenre);
export default router;
