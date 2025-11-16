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
            { username: "Alice", email: "alice@example.com", password: "pass123" },
            { username: "Bob", email: "bob@example.com", password: "pass123" },
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

        // === Game Media ===
        await GameMedia.insertMany([
            { game_id: games[0]._id, type: "cover", url: "https://example.com/cover1.jpg" },
            { game_id: games[1]._id, type: "trailer", url: "https://example.com/trailer2.mp4" },
            { game_id: games[2]._id, type: "screenshot", url: "https://example.com/screenshot3.jpg" },
            { game_id: games[3]._id, type: "cover", url: "https://example.com/cover4.jpg" },
        ]);

        // === Accessibility Groups ===
        const accessibilityGroups = await AccessibilityGroup.insertMany([
            { name: "Visual" },
            { name: "Hearing" },
        ]);

        // === Tags ===
        await Tag.insertMany([
            { game_id: games[0]._id, name: "Exciting", description: "High-paced gameplay", accessibility_group_id: accessibilityGroups[0]._id },
            { game_id: games[1]._id, name: "Mind-bending", description: "Puzzle challenges", accessibility_group_id: accessibilityGroups[1]._id },
            { game_id: games[2]._id, name: "Fast", description: "High-speed racing", accessibility_group_id: accessibilityGroups[0]._id },
            { game_id: games[3]._id, name: "Mysterious", description: "Hidden secrets", accessibility_group_id: accessibilityGroups[1]._id },
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
