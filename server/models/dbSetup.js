// server/models/dbSetup.js
import mongoose from "mongoose";

// Connect to MongoDB
export async function connectDB() {
    await mongoose.connect("mongodb://localhost:27017/gameDatabase", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
}

// === SCHEMAS ===

// Users collection
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    role: String,
    date_of_birth: Date,
    setting1: { type: Boolean, default: false },
    setting2: { type: Boolean, default: false }, // Editable settings add more where needed
});

// Games collection
const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: String, // Description of the game
    release_date: Date,
    publisher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
    last_update: Date,
    age_rating: Number,
});

// Game Media collection
const gameMediaSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    type: {
        type: String,
        enum: ["trailer", "screenshot", "cover", "concept_art", "other"],
        required: true,
    },
    url: { type: String, required: true },
    description: String, // Alt text or caption
});

// Genre collection
const genreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String, // Description for alt text
});

// Wishlist collection
const wishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    status: String,
    created_at: { type: Date, default: Date.now },
});

// Reviews collection
const reviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    body: String, // Review Text
    flagged: { type: Boolean, default: false },
});

// Accessibility Group collection
const accessibilityGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

// Tags collection
const tagSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    name: { type: String, required: true },
    description: String,
    accessibility_group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AccessibilityGroup",
        required: true,
    },
});

// === MODELS ===
export const User = mongoose.model("User", userSchema);
export const Game = mongoose.model("Game", gameSchema);
export const GameMedia = mongoose.model("GameMedia", gameMediaSchema);
export const Genre = mongoose.model("Genre", genreSchema);
export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export const Review = mongoose.model("Review", reviewSchema);
export const Tag = mongoose.model("Tag", tagSchema);
export const AccessibilityGroup = mongoose.model(
    "AccessibilityGroup",
    accessibilityGroupSchema
);

console.log("Schemas and Models created successfully");
