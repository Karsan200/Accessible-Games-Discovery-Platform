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
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
