
import express from "express";
import { Publisher } from "../models/dbSetup.js";
import { addPublisher } from "../controllers/publisherController.js"; // uses your controller

const router = express.Router();

// GET /api/publishers -> list all publishers
router.get("/", async (req, res) => {
    try {
        const pubs = await Publisher.find().lean();
        res.json(pubs);
    } catch (err) {
        console.error("Error fetching publishers:", err);
        res.status(500).json({ error: String(err?.message ?? err) });
    }
});

// POST /api/publishers -> create a publisher
router.post("/", addPublisher);

export default router;
