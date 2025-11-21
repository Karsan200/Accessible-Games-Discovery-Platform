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
        const [PixelPanda, RocketRaccoon, BouncyBear, GigglyGiraffe, pubMojang, pubRobTop, pubSupercell] = await User.create([
            {
                username: "PixelPanda",
                email: "alice@example.com",
                password: "password123",
                profilePicture: "/images/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1995-04-12"),
                setting1: true,
                setting2: false,
                salt: "random_salt",
            },
            {
                username: "RocketRaccoon",
                email: "bob@example.com",
                password: "hunter2",
                profilePicture: "/images/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1990-09-01"),
                setting1: false,
                setting2: true,
                salt: "random_salt",
            },
            {
                username: "BouncyBear",
                email: "charlie@example.com",
                password: "password123",
                profilePicture: "/images/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1985-02-20"),
                setting1: true,
                setting2: true,
                salt: "random_salt",
            },
            {
                username: "GigglyGiraffe",
                email: "josh@example.com",
                password: "josh123",
                profilePicture: "/images/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: "random_salt",
            },
            {
                username: "Mojang",
                email: "mojang@example.com",
                password: "gaming222",
                profilePicture: "/images/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: "random_salt",
            },
            {
                username: "RobTop",
                email: "robtop@example.com",
                password: "gaming222",
                profilePicture: "/images/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: "random_salt",
            },

            {
                username: "Supercell",
                email: "supercell@example.com",
                password: "gaming222",
                profilePicture: "/images/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: "random_salt",
            },
        ]);



        // === Genres ===
        const genres = await Genre.insertMany([
            { name: "Action", description: "Action-packed games" },
            { name: "Puzzle", description: "Brain-teasing games" },
        ]);

        // === Games ===
        const games = await Game.insertMany([
            {
                title: "Minecraft",
                description: "Discover the world of Minecraft. Build anything you can imagine, uncover eerie mysteries, and survive the night in the ultimate sandbox adventure game. In Minecraft, every playthrough is different, and unforgettable adventures await behind every corner. Explore and craft your way through an infinite world that’s yours to shape, one block at a time.",
                details: "Gather Resources: The typical journey starts with punching a tree to gather wood. The rest of your Minecraft adventure is up to you, whether you mine for precious ores or seek out rare materials. Just make sure to stock up on food! Survive the Night: When the sun goes down, hostile mobs abound. Will you face them or sleep through the night? And remember: it’s always dark underground... Build Amazing Things: Minecraft is the ultimate building game. Craft tools, build a humble shelter, or engineer your base with redstone. Can you build a base in the Nether? Only one way to find out.",
                accessibility: "Minecraft includes a range of accessibility options that support players with vision, hearing, and cognitive impairments. The game offers a High Contrast Mode to improve visual clarity and readability, along with the Text-to-Speech Narrator, which can read menus and chat messages aloud for players with visual difficulties. Subtitles are available to provide visual cues for in-game sounds like footsteps, nearby mobs, or environmental effects, supporting those with hearing impairments. Minecraft also allows customizable controls and simplified interface settings to reduce cognitive load, helping players tailor gameplay to their individual needs and comfort levels.",

                release_date: new Date("2023-01-01"),
                publisher_id: pubMojang._id,
                genre_id: genres[0]._id,
                last_update: new Date(),
                age_rating: 12,
            },
            {
                title: "Puzzle Mania",
                description: "Geometry Dash is a fast-paced rhythm platformer that challenges your timing, reflexes, and precision as you jump, fly, and dodge obstacles in increasingly complex levels synced to energetic music.",
                details: "Master Levels: Navigate tricky obstacle courses with perfect timing. Each level is designed to test your reflexes and rhythm. Customization: Adjust controls, colors, and difficulty to match your comfort level. The game offers a colorblind mode to assist visually impaired players. Challenge Yourself: Unlock new levels, create custom stages, and compete with friends online to climb leaderboards.",
                accessibility: "Geometry Dash includes features to help players with visual and motor impairments. Customizable controls, colorblind mode, and adjustable input sensitivity ensure that players of all skill levels can enjoy the game without frustration.",
                release_date: new Date("2022-06-15"),
                publisher_id: pubMojang._id,
                genre_id: genres[1]._id,
                last_update: new Date(),
                age_rating: 7,
            },
            {
                title: "Racing Thunder",
                description: "Clash Royale is a real-time strategy card game where players collect and upgrade cards featuring Clash of Clans troops, spells, and defenses, and duel opponents in fast-paced arenas. Planning, strategy, and adaptability are key to victory.",
                details: "Build Your Deck: Select cards wisely to create a balanced and powerful deck. Combining troops, spells, and defenses is crucial. Real-Time Battles: Compete against players worldwide in multiplayer arenas. Observe and adapt to opponents’ strategies quickly. Progress and Rewards: Complete daily quests, earn chests, and unlock powerful cards to enhance your deck and climb the ladder.",
                accessibility: "Clash Royale includes accessibility options for players with hearing or cognitive challenges. Visual cues for actions, adjustable game speed, and simplified controls help ensure all players can participate in strategic gameplay.",
                release_date: new Date("2023-03-20"),
                publisher_id: pubMojang._id,
                genre_id: genres[0]._id,
                last_update: new Date(),
                age_rating: 10,
            },
            {
                title: "Mystery Quest",
                description: "Clash Royale is a real-time strategy card game where players collect and upgrade cards featuring Clash of Clans troops, spells, and defenses, and duel opponents in fast-paced arenas. Planning, strategy, and adaptability are key to victory.",
                details: "Build Your Deck: Select cards wisely to create a balanced and powerful deck. Combining troops, spells, and defenses is crucial. Real-Time Battles: Compete against players worldwide in multiplayer arenas. Observe and adapt to opponents’ strategies quickly. Progress and Rewards: Complete daily quests, earn chests, and unlock powerful cards to enhance your deck and climb the ladder.",
                accessibility: "Clash Royale includes accessibility options for players with hearing or cognitive challenges. Visual cues for actions, adjustable game speed, and simplified controls help ensure all players can participate in strategic gameplay.",
                release_date: new Date("2022-11-10"),
                publisher_id: pubMojang._id,
                genre_id: genres[1]._id,
                last_update: new Date(),
                age_rating: 9,
            },
        ]);

// === Game Media ===
        await GameMedia.insertMany([
            // Game 1
            { game_id: games[0]._id, type: "icon", url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/capsule_616x353.jpg?t=1750959031" },
            { game_id: games[0]._id, type: "cover", url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/capsule_616x353.jpg?t=1750959031" },

            // Game 2
            { game_id: games[1]._id, type: "icon", url: "https://gaming-cdn.com/images/news/articles/7191/cover/minecraft-gets-a-new-artwork-cover66856ea7d02ad.jpg" },
            { game_id: games[1]._id, type: "cover", url: "https://gaming-cdn.com/images/news/articles/7191/cover/minecraft-gets-a-new-artwork-cover66856ea7d02ad.jpg" },

            // Game 3
            { game_id: games[2]._id, type: "icon", url: "https://gaming-cdn.com/images/products/5661/orig/disco-elysium-the-final-cut-pc-game-gog-com-cover.jpg?v=1701269736" },
            { game_id: games[2]._id, type: "cover", url: "https://gaming-cdn.com/images/products/5661/orig/disco-elysium-the-final-cut-pc-game-gog-com-cover.jpg?v=1701269736" },

            // Game 4
            { game_id: games[3]._id, type: "icon", url: "https://m.media-amazon.com/images/I/51tOYuCeiEL._UXNaN_FMjpg_QL85_.jpg" },
            { game_id: games[3]._id, type: "cover", url: "https://m.media-amazon.com/images/I/51tOYuCeiEL._UXNaN_FMjpg_QL85_.jpg" },

            {
                game_id: games[0]._id,
                type: "screenshot",
                url: "/images/minecraft1.png",
                description: "minecraft screenshot",
            },
            {
                game_id: games[0]._id,
                type: "screenshot",
                url: "/images/minecraft2.png",
                description: "minecraft screenshot 2",
            },
            {
                game_id: games[0]._id,
                type: "screenshot",
                url: "/images/minecraft3.png",
                description: "minecraft screenshot 3",
            },
            {
                game_id: games[0]._id,
                type: "screenshot",
                url: "/images/minecraft4.png",
                description: "minecraft screenshot",
            },
            {
                game_id: games[0]._id,
                type: "screenshot",
                url: "/images/minecraft5.png",
                description: "minecraft screenshot 2",
            },
            {
                game_id: games[0]._id,
                type: "screenshot",
                url: "/images/minecraft6.png",
                description: "minecraft screenshot 3",
            },
            {
                game_id: games[1]._id,
                type: "screenshot",
                url: "https://cdn.example/bladerush/ss1.jpg",
                description: "clash royale screenshot",
            },
            {
                game_id: games[2]._id,
                type: "screenshot",
                url: "https://cdn.example/puzzlegarden/cover.jpg",
                description: "geometry dash screenshot",
            },


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
            { game_id: games[1]._id, name: "Subtitles", description: "Subtitles for all dialogue", accessibility_group_id: accessibilityGroups.find(g => g.name === "Audio")._id },
            { game_id: games[1]._id, name: "Simplified UI", description: "Simplified interface for easier comprehension", accessibility_group_id: accessibilityGroups.find(g => g.name === "Cognitive")._id },

            // Game 3
            { game_id: games[2]._id, name: "Color Blind Mode", description: "Adjustable colors for color blind players", accessibility_group_id: accessibilityGroups.find(g => g.name === "Visual")._id },
            { game_id: games[2]._id, name: "Customizable Controls", description: "Fully remappable controls", accessibility_group_id: accessibilityGroups.find(g => g.name === "Motor")._id },

            // Game 4
            { game_id: games[3]._id, name: "Audio Cues", description: "Important events signaled with sound", accessibility_group_id: accessibilityGroups.find(g => g.name === "Audio")._id },
            { game_id: games[3]._id, name: "Tutorial Assistance", description: "Extra guidance for new players", accessibility_group_id: accessibilityGroups.find(g => g.name === "Cognitive")._id },
        ]);



        // === Wishlist ===
        await Wishlist.insertMany([
            { user_id: PixelPanda._id, game_id: games[1]._id, status: "pending" },
            { user_id: RocketRaccoon._id, game_id: games[0]._id, status: "owned" },
            { user_id: PixelPanda._id, game_id: games[3]._id, status: "pending" },
            { user_id: RocketRaccoon._id, game_id: games[2]._id, status: "owned" },
        ]);

// === Reviews ===
        await Review.create([
            {
                user_id: PixelPanda._id,
                game_id: games[0]._id,
                rating: 5,
                body: "Minecraft is an incredible experience. The High Contrast Mode and text-to-speech features allowed me to easily navigate complex builds and menus, making exploration effortless. The variety of activities keeps me engaged for hours.",
            },
            {
                user_id: RocketRaccoon._id,
                game_id: games[0]._id,
                rating: 4,
                body: "Creative and endlessly entertaining. Subtitles and scaling options made it easier to focus on gameplay, although I wish some tutorials were more structured..",
            },
            {
                user_id: BouncyBear._id,
                game_id: games[0]._id,
                rating: 3,
                body: "Fun game but occasionally overwhelming. Accessibility settings helped with focus, but the complexity can be intimidating for new players.",
                flagged: false,
            },
            {
                user_id: GigglyGiraffe._id,
                game_id: games[0]._id,
                rating: 5,
                body: "Minecraft’s accessibility features make building and exploring so much easier. High contrast mode, adjustable text, and narrator support really improved my gameplay experience!",
                flagged: false,
            },
            {
                user_id: GigglyGiraffe._id,
                game_id: games[1]._id,
                rating: 5,
                body: "Perfect combination of rhythm and platforming. Colorblind mode and adjustable controls made intense levels manageable and enjoyable.",
                flagged: false,
            },
            {
                user_id: BouncyBear._id,
                game_id: games[1]._id,
                rating: 3,
                body: "Challenging but rewarding. Accessibility options helped me navigate tricky obstacles, though some levels remain difficult..",
                flagged: false,
            },
            {
                user_id: PixelPanda._id,
                game_id: games[2]._id,
                rating: 2,
                body: "I struggled to keep up with the fast-paced strategy. Visual cues helped somewhat, but overall the game is challenging for new players.",
                flagged: false,
            },
        ]);



        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
}

seedDatabase();
