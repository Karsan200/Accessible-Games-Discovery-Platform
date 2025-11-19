// seed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
    User,
    Game,
    GameMedia,
    Genre,
    Wishlist,
    Review,
    Tag,
    AccessibilityGroup,
    connectDB,
} from "./models/dbSetup.js";

dotenv.config();

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("Seeding database...");

        // === Users ===
        const users = await User.insertMany([
            { username: "Alice", email: "alice@example.com", password: "pass123", salt: "random_salt" },
            { username: "Bob", email: "bob@example.com", password: "pass123", salt: "random_salt" },
        ]);

        // === Genres ===
        const genres = await Genre.insertMany([
            { name: "Action", description: "Action-packed games" },
            { name: "Puzzle", description: "Brain-teasing games" },
        ]);

        // === Games ===
        const games = await Game.insertMany([
            {
                title: "Super Fun Game",
                body: "An exciting adventure",
                release_date: new Date("2023-01-01"),
                publisher_id: users[0]._id,
                genre_id: genres[0]._id,
                last_update: new Date(),
                age_rating: 12,
            },
            {
                title: "Puzzle Mania",
                body: "Challenge your mind",
                release_date: new Date("2022-06-15"),
                publisher_id: users[1]._id,
                genre_id: genres[1]._id,
                last_update: new Date(),
                age_rating: 7,
            },
            {
                title: "Racing Thunder",
                body: "High-speed racing game",
                release_date: new Date("2023-03-20"),
                publisher_id: users[0]._id,
                genre_id: genres[0]._id,
                last_update: new Date(),
                age_rating: 10,
            },
            {
                title: "Mystery Quest",
                body: "Solve puzzles and uncover secrets",
                release_date: new Date("2022-11-10"),
                publisher_id: users[1]._id,
                genre_id: genres[1]._id,
                last_update: new Date(),
                age_rating: 9,
            },
        ]);

        // === Game Media === (2 per game: icon and cover)
        await GameMedia.insertMany([
            { game_id: games[0]._id, type: "icon", url: "https://example.com/superfun_icon.png" },
            { game_id: games[0]._id, type: "cover", url: "https://example.com/superfun_cover.jpg" },

            { game_id: games[1]._id, type: "icon", url: "https://example.com/puzzlemania_icon.png" },
            { game_id: games[1]._id, type: "cover", url: "https://example.com/puzzlemania_cover.jpg" },

            { game_id: games[2]._id, type: "icon", url: "https://example.com/racingthunder_icon.png" },
            { game_id: games[2]._id, type: "cover", url: "https://example.com/racingthunder_cover.jpg" },

            { game_id: games[3]._id, type: "icon", url: "https://example.com/mysteryquest_icon.png" },
            { game_id: games[3]._id, type: "cover", url: "https://example.com/mysteryquest_cover.jpg" },
        ]);


        // === Accessibility Groups ===
        const accessibilityGroups = await AccessibilityGroup.insertMany([
            { name: "Visual" },
            { name: "Audio" },
            { name: "Motor" },
            { name: "Cognitive" },
        ]);


        // === Tags ===
        await Tag.insertMany([
            // Game 1
            { game_id: games[0]._id, name: "High Contrast", description: "High contrast visuals", accessibility_group_id: accessibilityGroups.find(g => g.name === "Visual")._id },
            { game_id: games[0]._id, name: "One-Handed Mode", description: "Can be played with one hand", accessibility_group_id: accessibilityGroups.find(g => g.name === "Motor")._id },

            // Game 2
            { game_id: games[1]._id, name: "Subtitles", description: "Subtitles for all dialogue", accessibility_group_id: accessibilityGroups.find(g => g.name === "Hearing")._id },
            { game_id: games[1]._id, name: "Simplified UI", description: "Simplified interface for easier comprehension", accessibility_group_id: accessibilityGroups.find(g => g.name === "Cognitive")._id },

            // Game 3
            { game_id: games[2]._id, name: "Color Blind Mode", description: "Adjustable colors for color blind players", accessibility_group_id: accessibilityGroups.find(g => g.name === "Visual")._id },
            { game_id: games[2]._id, name: "Customizable Controls", description: "Fully remappable controls", accessibility_group_id: accessibilityGroups.find(g => g.name === "Motor")._id },

            // Game 4
            { game_id: games[3]._id, name: "Audio Cues", description: "Important events signaled with sound", accessibility_group_id: accessibilityGroups.find(g => g.name === "Hearing")._id },
            { game_id: games[3]._id, name: "Tutorial Assistance", description: "Extra guidance for new players", accessibility_group_id: accessibilityGroups.find(g => g.name === "Cognitive")._id },
        ]);



        // === Wishlist ===
        await Wishlist.insertMany([
            { user_id: users[0]._id, game_id: games[1]._id, status: "pending" },
            { user_id: users[1]._id, game_id: games[0]._id, status: "owned" },
            { user_id: users[0]._id, game_id: games[3]._id, status: "pending" },
            { user_id: users[1]._id, game_id: games[2]._id, status: "owned" },
        ]);

        // === Reviews ===
        await Review.insertMany([
            { user_id: users[0]._id, game_id: games[0]._id, rating: 8, body: "Really fun!" },
            { user_id: users[1]._id, game_id: games[1]._id, rating: 9, body: "Challenging puzzles!" },
            { user_id: users[0]._id, game_id: games[2]._id, rating: 7, body: "Exciting races!" },
            { user_id: users[1]._id, game_id: games[3]._id, rating: 8, body: "Loved the mystery!" },
        ]);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
}

seedDatabase();
