// server/routes/userRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { User, Game } from "../models/dbSetup.js";

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Serve static files for profile pictures
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// GET public profile by username
router.get("/username/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        // Only return public info
        const publicUser = {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
        };
        res.json(publicUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update user by ID
router.put("/:id", async (req, res) => {
    try {
        const { username, email, date_of_birth, setting1, setting2 } = req.body;

        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: req.params.id } });
            if (existingUser) return res.status(400).json({ error: "Username already taken." });
        }

        if (email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingEmail) return res.status(400).json({ error: "Email already in use." });
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, date_of_birth, setting1, setting2 },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "User not found." });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Favourite game routes

// GET favorite games
router.get("/:id/favorites", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("favorite_games", "title");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ favorite_games: user.favorite_games });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update favorite games
router.put("/:id/favorites", async (req, res) => {
    try {
        const { favorite_games } = req.body;

        if (!Array.isArray(favorite_games) || favorite_games.length > 4) {
            return res.status(400).json({ error: "You can select up to 4 favorite games." });
        }

        // Validate all games exist
        const validGames = await Game.find({ _id: { $in: favorite_games } }).select("_id").lean();
        if (validGames.length !== favorite_games.length) {
            return res.status(400).json({ error: "One or more selected games are invalid." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { favorite_games },
            { new: true }
        ).populate("favorite_games", "title");

        res.json({ favorite_games: updatedUser.favorite_games });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Multer for profile picture upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads/profile_pics");
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.id}${ext}`);
    },
});

const upload = multer({ storage });

// POST upload profile picture
router.post("/:id/profile-picture", upload.single("profilePicture"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded." });

        const filePath = `/uploads/profile_pics/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profilePicture: filePath },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "Profile picture updated.", profilePicture: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
