import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { User } from "../models/dbSetup.js";

const router = express.Router();

// Enable CORS for all routes (frontend on different port)
router.use(cors());

// Serve static files for profile pictures
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// GET public profile by username
router.get("/username/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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

// PUT update user by ID with unique username and email check
router.put("/:id", async (req, res) => {
    try {
        const { username, email, date_of_birth, setting1, setting2 } = req.body;

        // Check if username is taken by another user
        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({ error: "Username already taken." });
            }
        }

        // Check if email is taken by another user (optional if email must be unique)
        if (email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingEmail) {
                return res.status(400).json({ error: "Email already in use." });
            }
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

// Multer setup for profile pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), "uploads/profile_pics");
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
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

        if (!user) return res.status(404).json({ error: "User not found." });

        res.json({ message: "Profile picture updated.", profilePicture: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
