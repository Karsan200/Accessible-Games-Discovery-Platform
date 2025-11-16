import mongoose from "mongoose";

const { Schema } = mongoose;

export async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
}


/* User */
const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePicture: { type: String },
        role: { type: String, enum: ["user", "publisher", "admin"], default: "user" },
        date_of_birth: { type: Date },
        setting1: { type: Boolean, default: false },
        setting2: { type: Boolean, default: false },
    },
    { timestamps: true }
);

/* Genre */
const genreSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
    },
    { timestamps: true }
);

/* AccessibilityGroup */
const accessibilityGroupSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
    },
    { timestamps: true }
);

/* Game */
const gameSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        details: { type: String },
        accessibility: { type: String },
        release_date: { type: Date },
        publisher_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        genre_ids: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
        last_update: { type: Date },
        age_rating: { type: Number },
    },
    { timestamps: true }
);

/* GameMedia */
const gameMediaSchema = new Schema(
    {
        game_id: { type: Schema.Types.ObjectId, ref: "Game", required: true },
        type: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

/* Review */
const reviewSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        game_id: { type: Schema.Types.ObjectId, ref: "Game", required: true },
        rating: { type: Number, min: 0, max: 10 },
        body: { type: String },
        flagged: { type: Boolean, default: false },
    },
    { timestamps: true }
);

/* Tag */
const tagSchema = new Schema(
    {
        game_id: { type: Schema.Types.ObjectId, ref: "Game", required: true },
        name: { type: String, required: true },
        description: { type: String },
        accessibility_group_id: { type: Schema.Types.ObjectId, ref: "AccessibilityGroup" },
    },
    { timestamps: true }
);

/* Model exports */
export const User = mongoose.model("User", userSchema);
export const Genre = mongoose.model("Genre", genreSchema);
export const AccessibilityGroup = mongoose.model("AccessibilityGroup", accessibilityGroupSchema);
export const Game = mongoose.model("Game", gameSchema);
export const GameMedia = mongoose.model("GameMedia", gameMediaSchema);
export const Review = mongoose.model("Review", reviewSchema);
export const Tag = mongoose.model("Tag", tagSchema);
