import express from "express";
import { User } from "../models/dbSetup.js";

const router = express.Router();

// Get current user
router.get("/me", async (req, res) => {
    try {
        if (!req.currentUser) return res.status(401).json({ error: "Not logged in" });
        const user = await User.findById(req.currentUser._id).lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("GET /users/me error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update dyslexic font
router.patch("/me/font", async (req, res) => {
    try {
        if (!req.currentUser) return res.status(401).json({ error: "Not logged in" });
        const { fontType } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.currentUser._id,
            { fontType: Boolean(fontType) },
            { new: true }
        ).lean();
        res.json(updated);
    } catch (err) {
        console.error("PATCH /users/me/font error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update font size (boolean)
router.patch("/me/fontSize", async (req, res) => {
    console.log("PATCH /me/fontSize body:", req.body);
    try {
        if (!req.currentUser) return res.status(401).json({ error: "Not logged in" });
        const { fontSize } = req.body;
        console.log("fontSize type:", typeof fontSize, "value:", fontSize);
        if (typeof fontSize !== "boolean") return res.status(400).json({ error: "Invalid fontSize value" });

        const updated = await User.findByIdAndUpdate(
            req.currentUser._id,
            { fontSize },
            { new: true }
        ).lean();
        res.json(updated);
    } catch (err) {
        console.error("PATCH /users/me/fontSize error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


export default router;
