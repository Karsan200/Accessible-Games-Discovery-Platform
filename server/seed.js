import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import {
    User,
    Game,
    GameMedia,
    Genre,
    Review,
    Tag,
    AccessibilityGroup,
} from "./models/dbSetup.js";

async function seed() {
    await mongoose.connect(process.env.MONGO_URI, {});

    // clear existing data
    await Promise.all([
        AccessibilityGroup.deleteMany({}),
        Genre.deleteMany({}),
        User.deleteMany({}),
        Game.deleteMany({}),
        GameMedia.deleteMany({}),
        Review.deleteMany({}),
        Tag.deleteMany({}),
    ]);

    // Accessibility groups
    const [visual, hearing, cognitive, motor] = await AccessibilityGroup.create([
        { name: "Visual", description: "Visual accessibility features" },
        { name: "Hearing", description: "Subtitles and audio alternatives" },
        { name: "Cognitive", description: "Supports focus and eases cognitive load." },
        { name: "Motor", description: "Supports limited motor control." },
    ]);

    // Genres
    const [sandbox, action, adventure, multiplayer, rhythm, platformer, strategy] = await Genre.create([
        { name: "Sandbox", description: "Freedom to build and play without strict rules." },
        { name: "Action", description: "Fight to survive" },
        { name: "Adventure", description: "Explore a vast world" },
        { name: "Multiplayer", description: "Play with friends" },
        { name: "Rhythm", description: "Play according to the beat" },
        { name: "Platformer", description: "Jump, run, and navigate levels to succeed." },
        { name: "Strategy", description: "Plan moves to win battles or challenges." },
    ]);

    // Users
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
        },
    ]);


    const [minecraft, geometryDash, clashRoyale] = await Game.create([
        {
            title: "Minecraft",
            description: "Discover the world of Minecraft. Build anything you can imagine, uncover eerie mysteries, and survive the night in the ultimate sandbox adventure game. In Minecraft, every playthrough is different, and unforgettable adventures await behind every corner. Explore and craft your way through an infinite world that’s yours to shape, one block at a time.",
            details: "Gather Resources: The typical journey starts with punching a tree to gather wood. The rest of your Minecraft adventure is up to you, whether you mine for precious ores or seek out rare materials. Just make sure to stock up on food! Survive the Night: When the sun goes down, hostile mobs abound. Will you face them or sleep through the night? And remember: it’s always dark underground... Build Amazing Things: Minecraft is the ultimate building game. Craft tools, build a humble shelter, or engineer your base with redstone. Can you build a base in the Nether? Only one way to find out.",
            accessibility: "Minecraft includes a range of accessibility options that support players with vision, hearing, and cognitive impairments. The game offers a High Contrast Mode to improve visual clarity and readability, along with the Text-to-Speech Narrator, which can read menus and chat messages aloud for players with visual difficulties. Subtitles are available to provide visual cues for in-game sounds like footsteps, nearby mobs, or environmental effects, supporting those with hearing impairments. Minecraft also allows customizable controls and simplified interface settings to reduce cognitive load, helping players tailor gameplay to their individual needs and comfort levels.",
            release_date: new Date("2009-05-07"),
            publisher_id: pubMojang._id,
            genre_ids:  [sandbox._id, action._id, adventure._id, multiplayer._id],
            last_update: new Date(),
            age_rating: 7,
        },
        {
            title: "Geometry Dash",
            description: "Geometry Dash is a fast-paced rhythm platformer that challenges your timing, reflexes, and precision as you jump, fly, and dodge obstacles in increasingly complex levels synced to energetic music.",
            details: "Master Levels: Navigate tricky obstacle courses with perfect timing. Each level is designed to test your reflexes and rhythm. Customization: Adjust controls, colors, and difficulty to match your comfort level. The game offers a colorblind mode to assist visually impaired players. Challenge Yourself: Unlock new levels, create custom stages, and compete with friends online to climb leaderboards.",
            accessibility: "Geometry Dash includes features to help players with visual and motor impairments. Customizable controls, colorblind mode, and adjustable input sensitivity ensure that players of all skill levels can enjoy the game without frustration.",
            release_date: new Date("2013-08-13"),
            publisher_id: pubRobTop._id,
            genre_ids:  [platformer._id, rhythm._id, action._id],
            last_update: new Date(),
            age_rating: 7,
        },
        {
            title: "Clash Royale",
            description: "Clash Royale is a real-time strategy card game where players collect and upgrade cards featuring Clash of Clans troops, spells, and defenses, and duel opponents in fast-paced arenas. Planning, strategy, and adaptability are key to victory.",
            details: "Build Your Deck: Select cards wisely to create a balanced and powerful deck. Combining troops, spells, and defenses is crucial. Real-Time Battles: Compete against players worldwide in multiplayer arenas. Observe and adapt to opponents’ strategies quickly. Progress and Rewards: Complete daily quests, earn chests, and unlock powerful cards to enhance your deck and climb the ladder.",
            accessibility: "Clash Royale includes accessibility options for players with hearing or cognitive challenges. Visual cues for actions, adjustable game speed, and simplified controls help ensure all players can participate in strategic gameplay.",
            release_date: new Date("2016-03-02"),
            publisher_id: pubSupercell._id,
            genre_ids:  [strategy._id, multiplayer._id, action._id],
            last_update: new Date(),
            age_rating: 9,
        },

    ]);


    // Game media
    await GameMedia.create([
        {
            game_id: minecraft._id,
            type: "screenshot",
            url: "/images/minecraft1.png",
            description: "minecraft screenshot",
        },
        {
            game_id: minecraft._id,
            type: "screenshot",
            url: "/images/minecraft2.png",
            description: "minecraft screenshot 2",
        },
        {
            game_id: minecraft._id,
            type: "screenshot",
            url: "/images/minecraft3.png",
            description: "minecraft screenshot 3",
        },
        {
            game_id: minecraft._id,
            type: "screenshot",
            url: "/images/minecraft4.png",
            description: "minecraft screenshot",
        },
        {
            game_id: minecraft._id,
            type: "screenshot",
            url: "/images/minecraft5.png",
            description: "minecraft screenshot 2",
        },
        {
            game_id: minecraft._id,
            type: "screenshot",
            url: "/images/minecraft6.png",
            description: "minecraft screenshot 3",
        },
        {
            game_id: clashRoyale._id,
            type: "screenshot",
            url: "https://cdn.example/bladerush/ss1.jpg",
            description: "clash royale screenshot",
        },
        {
            game_id: geometryDash._id,
            type: "screenshot",
            url: "https://cdn.example/puzzlegarden/cover.jpg",
            description: "geometry dash screenshot",
        },

    ]);

    // Reviews
    await Review.create([
        {
            user_id: PixelPanda._id,
            game_id: minecraft._id,
            rating: 5,
            body: "Minecraft is an incredible experience. The High Contrast Mode and text-to-speech features allowed me to easily navigate complex builds and menus, making exploration effortless. The variety of activities keeps me engaged for hours.",
        },
        {
            user_id: RocketRaccoon._id,
            game_id: minecraft._id,
            rating: 4,
            body: "Creative and endlessly entertaining. Subtitles and scaling options made it easier to focus on gameplay, although I wish some tutorials were more structured..",
        },
        {
            user_id: BouncyBear._id,
            game_id: minecraft._id,
            rating: 3,
            body: "Fun game but occasionally overwhelming. Accessibility settings helped with focus, but the complexity can be intimidating for new players.",
            flagged: false,
        },
        {
            user_id: GigglyGiraffe._id,
            game_id: minecraft._id,
            rating: 5,
            body: "Minecraft’s accessibility features make building and exploring so much easier. High contrast mode, adjustable text, and narrator support really improved my gameplay experience!",
            flagged: false,
        },
        {
            user_id: GigglyGiraffe._id,
            game_id: geometryDash._id,
            rating: 5,
            body: "Perfect combination of rhythm and platforming. Colorblind mode and adjustable controls made intense levels manageable and enjoyable.",
            flagged: false,
        },
        {
            user_id: BouncyBear._id,
            game_id: geometryDash._id,
            rating: 3,
            body: "Challenging but rewarding. Accessibility options helped me navigate tricky obstacles, though some levels remain difficult..",
            flagged: false,
        },
        {
            user_id: PixelPanda._id,
            game_id: clashRoyale._id,
            rating: 2,
            body: "I struggled to keep up with the fast-paced strategy. Visual cues helped somewhat, but overall the game is challenging for new players.",
            flagged: false,
        },
    ]);


    // Tags referencing accessibility groups
    await Tag.create([
        { game_id: minecraft._id, name: "Vision", accessibility_group_id: visual._id },
        { game_id: minecraft._id, name: "Hearing", accessibility_group_id: hearing._id },
        { game_id: minecraft._id, name: "Cognitive", accessibility_group_id: cognitive._id },

        { game_id: geometryDash._id, name: "Vision", accessibility_group_id: visual._id },
        { game_id: geometryDash._id, name: "Motor", accessibility_group_id: motor._id },
        { game_id: geometryDash._id, name: "Cognitive", accessibility_group_id: cognitive._id },

        { game_id: clashRoyale._id, name: "Hearing", accessibility_group_id: hearing._id },
        { game_id: clashRoyale._id, name: "Cognitive", accessibility_group_id: cognitive._id },
    ]);

    console.log("Seeding complete.");
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});
