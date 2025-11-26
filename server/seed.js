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

import crypto from "crypto";

function createSalt(size = 16) {
    return crypto.randomBytes(size).toString("hex");
}

function hashPassword(password, salt) {
    return crypto.createHash("sha256")
        .update(password + salt)
        .digest("hex");
}

const salt1 = createSalt();

dotenv.config();

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("Seeding database...");

        // === Users ===
        const [PixelPanda, RocketRaccoon, BouncyBear, GigglyGiraffe, pubMojang, pubRobTop, pubSupercell,        pubTapBlaze, pubPlayrix, pubBigDuckGamesLLC, pubPlaystack
        ] = await User.create([
            {
                username: "PixelPanda",
                email: "alice@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1995-04-12"),
                setting1: true,
                setting2: false,
                salt: salt1,
            },
            {
                username: "RocketRaccoon",
                email: "bob@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1990-09-01"),
                setting1: false,
                setting2: true,
                salt: salt1,
            },
            {
                username: "BouncyBear",
                email: "charlie@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1985-02-20"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "GigglyGiraffe",
                email: "josh@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "user",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "Mojang",
                email: "mojang@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "RobTop",
                email: "robtop@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "Supercell",
                email: "supercell@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "TapBlaze",
                email: "tapblaze@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "Playrix",
                email: "playrix@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "Big Duck Games LLC",
                email: "BigDuckGamesLLC@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
            {
                username: "Playstack",
                email: "Playstack@example.com",
                password: hashPassword("password123", salt1),
                profilePicture: "/uploads/profile_pics/profilepicTemp.png",
                role: "publisher",
                date_of_birth: new Date("1995-05-27"),
                setting1: true,
                setting2: true,
                salt: salt1,
            },
        ]);


        // === Genres ===
        const [sandbox, action, adventure, multiplayer, rhythm, platformer, strategy, simulation, casual, story, puzzle, logic, boardCardGames] = await Genre.create([
            { name: "Sandbox", description: "Freedom to build and play without strict rules." },
            { name: "Action", description: "Fight to survive" },
            { name: "Adventure", description: "Explore a vast world" },
            { name: "Multiplayer", description: "Play with friends" },
            { name: "Rhythm", description: "Play according to the beat" },
            { name: "Platformer", description: "Jump, run, and navigate levels to succeed." },
            { name: "Strategy", description: "Plan moves to win battles or challenges." },
            { name: "Simulation", description: "Experience realistic or fantastical scenarios by managing systems, characters, or environments." },
            { name: "Casual", description: "Easy-to-learn games designed for quick, relaxed play sessions." },
            { name: "Story", description: "Games focused on narrative, character development, and immersive storytelling." },
            { name: "Puzzle", description: "Challenge your mind with problem-solving, pattern recognition, or brain-teasing tasks." },
            { name: "Logic", description: "Test your reasoning and critical thinking with structured, rule-based challenges." },
            { name: "Board and Card Games", description: "Digital adaptations of tabletop games emphasizing strategy, turn-taking, or card mechanics." },
        ]);


        // === Games ===
        const games = await Game.insertMany([
            {
                title: "Minecraft",
                tagline: "Build anything, explore everywhere.",
                description: "Discover the world of Minecraft. Build anything you can imagine, uncover eerie mysteries, and survive the night in the ultimate sandbox adventure game. In Minecraft, every playthrough is different, and unforgettable adventures await behind every corner. Explore and craft your way through an infinite world that’s yours to shape, one block at a time.",
                details: "Gather Resources: The typical journey starts with punching a tree to gather wood. The rest of your Minecraft adventure is up to you, whether you mine for precious ores or seek out rare materials. Just make sure to stock up on food! Survive the Night: When the sun goes down, hostile mobs abound. Will you face them or sleep through the night? And remember: it’s always dark underground... Build Amazing Things: Minecraft is the ultimate building game. Craft tools, build a humble shelter, or engineer your base with redstone. Can you build a base in the Nether? Only one way to find out.",
                accessibility: "Minecraft includes a range of accessibility options that support players with vision, hearing, and cognitive impairments. The game offers a High Contrast Mode to improve visual clarity and readability, along with the Text-to-Speech Narrator, which can read menus and chat messages aloud for players with visual difficulties. Subtitles are available to provide visual cues for in-game sounds like footsteps, nearby mobs, or environmental effects, supporting those with hearing impairments. Minecraft also allows customizable controls and simplified interface settings to reduce cognitive load, helping players tailor gameplay to their individual needs and comfort levels.",
                release_date: new Date("2023-01-01"),
                publisher_id: pubMojang._id,
                genre_id: [sandbox._id, action._id, adventure._id, multiplayer._id],
                last_update: new Date(),
                age_rating: 12,
            },
            {
                title: "Geometry Dash",
                tagline: "Rhythm, timing, and precision.",
                description: "Geometry Dash is a fast-paced rhythm platformer that challenges your timing, reflexes, and precision as you jump, fly, and dodge obstacles in increasingly complex levels synced to energetic music.",
                details: "Master Levels: Navigate tricky obstacle courses with perfect timing. Each level is designed to test your reflexes and rhythm. Customization: Adjust controls, colors, and difficulty to match your comfort level. The game offers a colorblind mode to assist visually impaired players. Challenge Yourself: Unlock new levels, create custom stages, and compete with friends online to climb leaderboards.",
                accessibility: "Geometry Dash includes features to help players with visual and motor impairments. Customizable controls, colorblind mode, and adjustable input sensitivity ensure that players of all skill levels can enjoy the game without frustration.",
                release_date: new Date("2022-06-15"),
                publisher_id: pubRobTop._id,
                genre_id: [platformer._id, rhythm._id, action._id],
                last_update: new Date(),
                age_rating: 7,
            },
            {
                title: "Clash Royale",
                tagline: "High-speed strategy and thrills.",
                description: "Clash Royale is a real-time strategy card game where players collect and upgrade cards featuring Clash of Clans troops, spells, and defenses, and duel opponents in fast-paced arenas. Planning, strategy, and adaptability are key to victory.",
                details: "Build Your Deck: Select cards wisely to create a balanced and powerful deck. Combining troops, spells, and defenses is crucial. Real-Time Battles: Compete against players worldwide in multiplayer arenas. Observe and adapt to opponents’ strategies quickly. Progress and Rewards: Complete daily quests, earn chests, and unlock powerful cards to enhance your deck and climb the ladder.",
                accessibility: "Clash Royale includes accessibility options for players with hearing or cognitive challenges. Visual cues for actions, adjustable game speed, and simplified controls help ensure all players can participate in strategic gameplay.",
                release_date: new Date("2023-03-20"),
                publisher_id: pubSupercell._id,
                genre_id: [strategy._id, multiplayer._id, action._id],
                last_update: new Date(),
                age_rating: 10,
            },
            {
                title: "Good Pizza Great Pizza",
                tagline: "Where every pizza tells a story",
                description: "Ever wanted to know what it feels like to run your own Pizza shop? Now you can with TapBlaze’s newest cooking game, Good Pizza, Great Pizza! Do your best to fulfill pizza orders from customers while making enough money to keep your restuarant open. Upgrade your restaurant with new toppings, decor and kitchen equipment to compete against your pizza rival, Alicante!",
                details: "In Good Pizza, Great Pizza, you step into the shoes of a pizza chef running your very own pizzeria. From kneading dough and spreading sauce to layering toppings and sliding pies into the oven, every step is in your hands. Customers place their orders with unique preferences and quirky requests, so you’ll need to work fast and pay attention to detail to keep them happy. As you progress, you unlock new ingredients, upgrade your kitchen equipment, and experiment with creative recipes to craft the ultimate pizza masterpieces. Balancing speed, accuracy, and creativity is key. Serve up pizzas quickly, earn tips, and build your reputation as the town’s top pizza maker.",
                accessibility: "Good Pizza, Great Pizza is designed to be accessible to a wide range of players. The game includes colourblind-friendly visuals, ensuring toppings and ingredients are easily distinguishable for players with colour vision deficiencies. There’s adjustable text size for all menus and orders, making reading comfortable for those with visual impairments. The game also supports subtitles and visual cues for in-game sounds, so players with hearing impairments can track customer requests and timers. For players with motor challenges, touch-friendly controls and customisable input sensitivity allow for precise and comfortable gameplay. Additionally, the game provides pausable gameplay and slower time modes, helping players who need extra time to prepare orders without penalty.",
                release_date: new Date("2014-12-02"),
                publisher_id: pubTapBlaze._id,
                genre_id: [simulation._id, casual._id, strategy._id],
                last_update: new Date(),
                age_rating: 3,
            },
            {
                title: "Township",
                tagline: "Build your dream town, farm your way to success!",
                description: "Welcome to Township, a thrilling city-building and farming game where you become the mayor of your own town! Build houses, factories, and community buildings, grow crops on your farm, and decorate your town just the way you like. Take part in limited-time events, compete in exciting regattas, and earn exclusive prizes!",
                details: "In Township, players take on the role of a town mayor, managing and expanding their own unique town. You’ll plant and harvest crops, run factories to produce goods, and trade with neighboring towns to grow your economy. The game combines city-building with farming, allowing you to design layouts, construct public buildings, and decorate your town to your liking. You’ll also manage resources efficiently, complete quests, and participate in competitions and events to earn rewards. Every decision affects your town’s growth, making strategy and planning key to creating a thriving, bustling community.",
                accessibility: "Township includes several accessibility features to make the game enjoyable for a wide range of players. The interface offers clear visual cues with high-contrast icons and readable fonts, making it easier for players with visual impairments to navigate the town and manage resources. Interactive elements are large and well-spaced to assist players with motor difficulties, and drag-and-drop actions can be adjusted for precision. Audio cues accompany key events, while subtitles and notifications ensure that important information is not missed. Additionally, the game provides customizable controls and simplified task prompts to support players with cognitive challenges, helping everyone plan and expand their town at their own pace.",
                release_date: new Date("2011-02-01"),
                publisher_id: pubPlayrix._id,
                genre_id: [simulation._id, casual._id, strategy._id],
                last_update: new Date(),
                age_rating: 3,
            },
            {
                title: "Flow Free",
                tagline: "Connect the dots, master the flow!",
                description: "Flow Free® is a simple yet addictive puzzle game. Connect matching colors with pipe to create a Flow®. Pair all colors, and cover the entire board to solve each puzzle in Flow Free. But watch out, pipes will break if they cross or overlap! Free play through hundreds of levels, or race against the clock in Time Trial mode. Flow Free gameplay ranges from simple and relaxed, to challenging and frenetic, and everywhere in between. How you play is up to you. So, give Flow Free a try, and experience mind like water!",
                details: "In Flow Free, players are challenged to connect matching colored dots on a grid by drawing pipes that link them together. Each level increases in complexity, requiring careful planning to cover the entire board without overlapping paths. With hundreds of puzzles ranging from simple to brain-bending, Flow Free tests logic, strategy, and spatial reasoning. Players can race against the clock in timed challenges or take a relaxed approach in free play mode, making it a game suited for both casual and dedicated puzzle enthusiasts.",
                accessibility: "Flow Free includes several features to support accessibility. High-contrast mode ensures that colored pipes and dots are easily distinguishable for players with visual impairments. The game offers optional audio cues when connecting pipes or completing a level, assisting players who benefit from auditory feedback. Controls are simple and can be used with a single finger or mouse click, supporting those with limited motor control. Additionally, the intuitive grid layout and gradual difficulty progression help reduce cognitive load, making the game approachable for a wide range of players.",
                release_date: new Date("2012-06-07"),
                publisher_id: pubBigDuckGamesLLC._id,
                genre_id: [puzzle._id, casual._id, logic._id],
                last_update: new Date(),
                age_rating: 3,
            },
            {
                title: "Balatro",
                tagline: "Build your poker deck, beat the blinds, master the joker.",
                description: "Welcome to the official Balatro game! Hypnotic and endlessly satisfying, Balatro is a magical mix of card games like Solitaire and Poker, that lets you twist the rules in ways never seen before! Your goal is to beat Boss Blinds by making strong poker hands. Find new Jokers that change the game and create awesome and exciting combos! Take on challenging bosses, discover wild poker hands and unlock new decks as you play. You’ll need all the help you can get to beat the big boss, win the final challenge, and win the game.",
                details: "In Balatro, you enter a rogue like deck‑building world that revolves around classic poker hands—but played with a twist. Each run, you’re dealt a hand of cards from a standard 52‑card deck and must strategically form poker hands like straights, flushes, or full houses to score chips. You have a limited number of discards and draws per round, so planning and risk‑taking are key. Between rounds, you can purchase and upgrade powerful Joker cards, as well as other special Boost cards (like Tarot or Planet cards), each bringing unique effects to your deck. As you defeat increasingly difficult challenges called “blinds” (Small, Big, and Boss), your choice of cards and synergies determines whether you come out on top. The deep strategy and high replayability come from combining poker theory with deck‑building mechanics, making every session a new, risky puzzle.",
                accessibility: "Balatro offers several features to help make the experience more accessible. The game provides clear, high‑contrast card visuals to ensure that suits and card ranks are easily distinguishable for players with visual impairments. Action prompts and gameplay feedback are reinforced with strong visual indicators as well as optional audio cues when forming hands or triggering Joker effects. Input controls are simple and responsive, helping players with limited motor control to manage discards and card draws without frustration. For players who are new to poker, Balatro includes inline explanations of hand types, so you can learn as you play. Strategic complexity is introduced gradually, so you can build your understanding at your own pace and choose whether to engage with more advanced mechanics.",
                release_date: new Date("2024-02-20"),
                publisher_id: pubPlaystack._id,
                genre_id: [strategy._id, casual._id, boardCardGames._id],
                last_update: new Date(),
                age_rating: 12,
            },
        ]);

// === Game Media ===
        await GameMedia.insertMany([
            // Game 1
            { game_id: games[0]._id, type: "icon", url: "https://images.icon-icons.com/3053/PNG/512/minecraft_macos_bigsur_icon_189943.png", description: "minecraft icon", },
            { game_id: games[0]._id, type: "cover", url: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_Minecraft_image1600w.jpg", description: "minecraft cover", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/E3ae4Jm7cLqmGEHg4In5rXdKrMAwDPPNb26coEAESZw4RjvkgS_bBJtRwFNGZrBMfw=w1052-h592-rw", description: "minecraft screenshot 1", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/ZSMzOOE-yQt2I2VjA1rqZ2hkQ1PzWBDXUnqkW6sCQMGs2d_H6X2UBVB-LF-B6Gm4VjYz=w5120-h2880-rw", description: "minecraft screenshot 2", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/Va5XplRkZCroi-q8NZI5TLd1vHHndW1ps6o98X4fvtnSMwmS4iOHxwxB2B7fri-lOGA=w5120-h2880-rw", description: "minecraft screenshot 3", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/V1CnCHYr1JP9pYrJLs53qS3YG9rbJVhxmLApqXY_pWt17ZQIwbXIibXeC2gGeckksy8=w5120-h2880-rw", description: "minecraft screenshot 4", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/nZTKxyLI6340xoPhTTLMODDCCb9GW5tdb-_7rcOsN350fnGd7c2ph7-0RgC8Ot_-E4s=w5120-h2880-rw", description: "minecraft screenshot 5", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/srkig0NrEF-DQI067-yYDRWmtDGyMWet_ocNu7GBU0fnoElm6WVmCXBgMZYJ8H4kfQ=w5120-h2880-rw", description: "minecraft screenshot 6", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/zsJ6j0KZTru9deKTA4cI2NXzsFNgD-Qd-fl3B4TVItRlVSwVibo7q8gNcFysvx51sso=w5120-h2880-rw",description: "minecraft screenshot 7", },
            { game_id: games[0]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/dqCRCJb1nRGv5XtuA2Ml4mTDYuGRaD68juil4wfFHsYWiV0kvjG1mgDpiZHTMWG0-WD1=w5120-h2880-rw", description: "minecraft screenshot 8", },

            // Game 2
            { game_id: games[1]._id, type: "icon", url: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c7/94/b0/c794b0e9-ea7b-310f-80fd-af369492cd83/AppIcon-1x_U007emarketing-0-11-0-85-220-0.png/512x512bb.jpg", description: "Geometry Dash icon", },
            { game_id: games[1]._id, type: "cover", url: "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/geometrydash23.png", description: "Geometry Dash cover", },
            { game_id: games[1]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/QPS_wlJHQgy3G6KgWAcjjoXKOWJURujcw0LK70mzqBOCtFxoz0LSscWgoy0IYH97Dg=w5120-h2880-rw", description: "Geometry Dash screenshot 1", },
            { game_id: games[1]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/sq0hNhqNiuA6j0JW5nMOQCv_wJ6XBq1KpeMNkPN6TsGrrYNsaPrfZ-GiOkk1ap4SqBDA=w5120-h2880-rw", description: "Geometry Dash screenshot 2", },
            { game_id: games[1]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/ys1QONuCD-Cn20E7qy03rrBAM5UE-PIUKnosWxYkJGnj2LROYAJ_5KZVv22UEKAbRDk=w5120-h2880-rw", description: "Geometry Dash screenshot 3", },
            { game_id: games[1]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/WC1ktmQTv49vSOYNNoscsE0Q14djF1ifRDLc-Eacidzq-mtzkyBRgMbIzmC6TcqxasI=w5120-h2880-rw", description: "Geometry Dash screenshot 4", },
            { game_id: games[1]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/jeXVA_HnpbOiffYUUMvFpfVKA2DTMPCDtGejF4CGB4IRw3PoYi9n_O7H45h3mu5_iQ=w5120-h2880-rw", description: "Geometry Dash screenshot 5", },
            { game_id: games[1]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/er0-hnwfHoAx8PsU4ARsONOogw45KnYP3oxayWdwQOXfo6le8XlGBATnInvXs5r78c8=w5120-h2880-rw", description: "Geometry Dash screenshot 6", },

            // Game 3
            { game_id: games[2]._id, type: "icon", url: "https://cdnb.artstation.com/p/assets/images/images/029/816/241/large/brice-laville-saint-martin-clash-royale-app-icon-2020.jpg?1598728017", description: "Clash Royale icon", },
            { game_id: games[2]._id, type: "cover", url: "https://supercell.com/images/8654bffbaa77efb91243d3706b739c25/og_clashroyale.d235f90b.jpg", description: "Clash Royale cover", },
            { game_id: games[2]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/UOJ0N42bDu2lUbZIx4n9UCnHtnY5IEyG1jOLXByCbbCvi6wammxVR4XC9endWA5rAA=w5120-h2880-rw", description: "Clash Royale screenshot 1", },
            { game_id: games[2]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/-H9tX-JiL-u169fW5aPKBOO2kIO20HIPdLcuSE-VKH3UPzhg5225q6OPy-If0pu_c1o=w5120-h2880-rw", description: "Clash Royale screenshot 2", },
            { game_id: games[2]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/KJyB5262htBywP40LmNgt3WCr0yGjXDkiaY2t1T3FL71Ph_Dk5iYqd5UJC6NIaUbf-w=w5120-h2880-rw", description: "Clash Royale screenshot 3", },
            { game_id: games[2]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/4xvy3712rgooE8zG-b3ePxPXU5eWFa78q57TClvKQcHtEn9yFVHq_By3do9wqzyy18Ig=w5120-h2880-rw", description: "Clash Royale screenshot 4", },
            { game_id: games[2]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/KMU1IyCAbHzfNVzihvyedCDXDW3uIpKbaWNj2BPSxhrTyCnzWH88lRUIX2BnMyRD888=w5120-h2880-rw", description: "Clash Royale screenshot 5", },

            // Game 4
            { game_id: games[3]._id, type: "icon", url: "https://img.utdstc.com/icon/cb5/463/cb54633f43741ca40ea541b578f6a11df1cbc5d3d1ceaa97c210a63bd5fae73b:200", description: "Good Pizza Great Pizza icon", },
            { game_id: games[3]._id, type: "cover", url: "https://play-lh.googleusercontent.com/ZzYEP8XxMsWXDtx7IgyN1Znb8mBLlP2qmzZq1-sUmMCn_sSkq6w7qDfcAnykV7ATpykS=w5120-h2880-rw", description: "Good Pizza Great Pizza cover",  },
            { game_id: games[3]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/nql4gdcnUHpbLw1Ovdac2zO4cecusV7OAG2TYZs3S6y7CI0Fy77P1-4fZSptAc2w4S4=w5120-h2880-rw", description: "Good Pizza Great Pizza screenshot 1", },
            { game_id: games[3]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/M9aKbe2auHme98DK9G64JeNx-sk_uM8PWrJ86z4Val8FPKDCD8b6qofrY26dIEiRQg=w5120-h2880-rw", description: "Good Pizza Great Pizza screenshot 2",  },
            { game_id: games[3]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/oLfW7JdNf5jUpegvo_RF-ib4FcSq1BwhKBi5aeOheJrKAEkK5Xu9fFXfnJuHeTS6OZI=w5120-h2880-rw", description: "Good Pizza Great Pizza screenshot 3",  },
            { game_id: games[3]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/SfSne1dnZbDLtCT9PNT3-5ChIEq4ZBXZiHFU7HYIfKazxSjk8FBpVKK2ceMcPE-XeNs=w5120-h2880-rw", description: "Good Pizza Great Pizza screenshot 4",  },
            { game_id: games[3]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/x_Eb3mtsnlZKTnnC-b_lQDz5u1twd7_pMge1seiCQ6w6MaqKO7NP_pugysn0pOpUYIxq=w5120-h2880-rw", description: "Good Pizza Great Pizza screenshot 5",  },

            //Game 5
            { game_id: games[4]._id, type: "icon", url: "https://play-lh.googleusercontent.com/9KAPlokfzeEFb34Mwm7juoiC5-yjpf4JlRLguuAgn5fV7JcTECwJnu6guLxbaZBWDA", description: "Township icon",  },
            { game_id: games[4]._id, type: "cover", url: "https://miro.medium.com/1*DYUlPBBjbkU9eQXthL0lNw.jpeg", description: "Township cover", },
            { game_id: games[4]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/bW2mxlLK5L65zTPCkMVhObnJb3wkweTO3zTHpqJTf6ekPQYNM2OWrfDrhQI-jaH-ILv_=w5120-h2880-rw", description: "Township screenshot 1", },
            { game_id: games[4]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/hBSrS83qhc_TNNaJsxDHu89NRpr1EQ9_Hvv8sDoip5QFLYF4ENLGa-24lYHZB2TAZQ=w5120-h2880-rw", description: "Township screenshot 2",  },
            { game_id: games[4]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/tn2CGAjRh6uAsGMrgT8x2LsH8ZvWTeacz8vZoR5WXLWw_T5j4pQ9J_5zs4cc58FAPWtD=w5120-h2880-rw", description: "Township screenshot 3",  },
            { game_id: games[4]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/3deeZTVI7dMp1LpSpQZZivwMlquv7VTKbmcXB6VcqW3XIrsYQEJNHO9pUC7DlTPxfwI=w5120-h2880-rw", description: "Township screenshot 4",  },
            { game_id: games[4]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/cW3oJICJ5jsweoMZBgLRVS8A0CCYqS0pr3emVNsNkBD4U06xpRogbqoMKMI8Z-PSE8Fj=w5120-h2880-rw", description: "Township screenshot 5",  },

            //Game 6
            { game_id: games[5]._id, type: "icon", url: "https://play-lh.googleusercontent.com/cKgJRbFkjVAm6XkkSILGleGkT317BLLD8erTsrI1vo240a991MGJzbMryBKFG7Zw7tU=w480-h960-rw", description: "Flow Free icon",  },
            { game_id: games[5]._id, type: "cover", url: "https://images.squarespace-cdn.com/content/v1/586beec5e58c624be9f7b5a2/1483733488663-JYE1NGU7MZCBOTGO9JQI/image-asset.jpeg", description: "Flow Free cover", },
            { game_id: games[5]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/1ot0p3gFHecZ0uFwZt0lwNXx_3pBP8oynSRgELpob3x-SpNLOdaLJ9eQDiQinpPA2nI=w5120-h2880-rw", description: "Flow Free screenshot 1", },
            { game_id: games[5]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/Rd3ucLvZipCvAFiMOFGpMKA-zG7MeCfUIYXQBladLqCls5ubpTrbA0lBlVX1qBqP9Ng=w5120-h2880-rw", description: "Flow Free screenshot 2", },
            { game_id: games[5]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/BqsrF96JJKlSakgWNAxagzNbP2CGnx4qhijPcM7r-exIZ9EY48yZpa8RtS2vrl8sne8=w5120-h2880-rw", description: "Flow Free screenshot 3", },
            { game_id: games[5]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/ZvMJNX8HJhGZgGRMlh9XOiCLztWDnS8CKH7o57luUq7kHr17zaru7pTjmGU5Gsx141no=w5120-h2880-rw", description: "Flow Free screenshot 4", },
            { game_id: games[5]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/PtJaKTUkTgWaWks_KRiLdO8gs9pFzWCfLRtkY9F7G_0XGSlU_gOYfNjBHZ72siqI6nM=w5120-h2880-rw", description: "Flow Free screenshot 5", },

            //Game 7
            { game_id: games[6]._id, type: "icon", url: "https://play-lh.googleusercontent.com/RSPv_SMlA3Lun8VHaJD7xCBQg29eCJR9sNJtZNJGlybVs8byYVLz4WnohrbLScC9srg", description: "Balatro icon", },
            { game_id: games[6]._id, type: "cover", url: "https://assetsio.gnwcdn.com/balatro1080-(1).png?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp", description: "Balatro cover", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/E9VzNlpxotPon4WKhQNAEMom1BHceqFlsXe-f8qTE6G2vG-4FP2Qqq8rha2k9X9RxKx8=w5120-h2880-rw", description: "Balatro screenshot 1", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/Vu5aRdaCotyYPJBgNFqFPDGd06Bi5FKuPseDNhInukRPlIu6K7v3kZ4_FK1ikgeP5ro=w5120-h2880-rw", description: "Balatro screenshot 2", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/DGylQ-S9bvV5adgteR603GjgEMYPgqJTKBsSCwJb0-ASQplLxjOvKEqOzz_7adJHufs=w5120-h2880-rw", description: "Balatro screenshot 3", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/Lu4edvvD16NtfHU5UUSnlpD09QnrVQxB_hiixai4glx_5LcFM4jNB3lJTTonGxS4c8A=w5120-h2880-rw", description: "Balatro screenshot 4", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/_x-SSL59ksRpqDMKqW509qqP3s3Kiw1L7B6cd-r7gJREWRm8wAZExtC51DXo2k-E3A=w5120-h2880-rw", description: "Balatro screenshot 5", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/WeeJ6n4yRfPgIH6N3bj85WhaTZ5kqv3-qvq6qsNmasxfqnY7OGz-T-FY0SIk4jFYAww=w5120-h2880-rw", description: "Balatro screenshot 6", },
            { game_id: games[6]._id, type: "screenshot", url: "https://play-lh.googleusercontent.com/XQSVFg-5Euu2qxHLbXJiKvF2PEdhQRt95RRn-iXDR-rjaGn0Vv624ERmN5dTmvuABw=w5120-h2880-rw", description: "Balatro screenshot 7",},

        ]);



        // === Accessibility Groups ===
        const [visual, hearing, cognitive, motor] = await AccessibilityGroup.create([
            { name: "Visual", description: "Visual accessibility features" },
            { name: "Hearing", description: "Subtitles and audio alternatives" },
            { name: "Cognitive", description: "Supports focus and eases cognitive load." },
            { name: "Motor", description: "Supports limited motor control." },
        ]);


        // === Tags ===
        await Tag.create([
            { game_id: games[0]._id, name: "Vision", accessibility_group_id: visual._id },
            { game_id: games[0]._id, name: "Hearing", accessibility_group_id: hearing._id },
            { game_id: games[0]._id, name: "Cognitive", accessibility_group_id: cognitive._id },

            { game_id: games[1]._id, name: "Vision", accessibility_group_id: visual._id },
            { game_id: games[1]._id, name: "Motor", accessibility_group_id: motor._id },
            { game_id: games[1]._id, name: "Cognitive", accessibility_group_id: cognitive._id },

            { game_id: games[2]._id, name: "Hearing", accessibility_group_id: hearing._id },
            { game_id: games[2]._id, name: "Cognitive", accessibility_group_id: cognitive._id },
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
            //game 1 reviews
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
            //game 2 reviews
            {
                user_id: GigglyGiraffe._id,
                game_id: games[1]._id,
                rating: 5,
                body: "Geometry Dash is challenging but rewarding, and I really appreciate the accessibility options it provides. The ability to adjust colorblind settings and customize input controls makes it easier for players with visual or motor impairments to enjoy the game without feeling left behind. The rhythm-based platforming is tough, but the practice mode and clear visual cues help me progress steadily without frustration.",
                flagged: false,
            },
            {
                user_id: BouncyBear._id,
                game_id: games[1]._id,
                rating: 4,
                body: "I love the fast-paced levels, and the accessibility features make it much more enjoyable. The visual aids and simplified interface options allow me to focus on timing and reflexes rather than struggling with confusing layouts. It’s a perfect mix of fun and inclusivity.",
                flagged: false,
            },
            {
                user_id: PixelPanda._id,
                game_id: games[1]._id,
                rating: 4,
                body: "Geometry Dash’s accessibility options really stand out for a game of this type. Subtle color adjustments and the ability to customize controls mean I can tackle each level at my own pace, making the experience rewarding instead of stressful. The gameplay remains intense, but I never feel excluded.",
                flagged: false,
            },
            // game 3 reviews
            {
                user_id: PixelPanda._id,
                game_id: games[2]._id,
                rating: 4,
                body: "Clash Royale is engaging and strategic, and its accessibility features make it approachable for all types of players. The adjustable game speed and simplified UI elements allow me to plan my moves without being overwhelmed. Even with hearing or cognitive challenges, I can follow what’s happening in real time and enjoy competing against others.",
                flagged: false,
            },
            {
                user_id: BouncyBear._id,
                game_id: games[2]._id,
                rating: 3,
                body: "I’ve spent hours in Clash Royale, and the accessibility options truly improve gameplay. Notifications, visual cues, and text alternatives help me stay on top of fast battles. I love that the game allows everyone to compete fairly, regardless of physical or sensory limitations.",
                flagged: false,
            },
            {
                user_id: RocketRaccoon._id,
                game_id: games[2]._id,
                rating: 3,
                body: "The game’s strategic depth could be intimidating, but the accessibility settings make it manageable. Features like adjustable card timers, clear visual indicators, and readable text ensure I never miss a beat, making every match fun and fair.",
                flagged: false,
            },
            // game 4 reviews
            {
                user_id: GigglyGiraffe._id,
                game_id: games[3]._id,
                rating: 5,
                body: "Good Pizza, Great Pizza is a delight to play, and the accessibility options make it even better. Text-to-speech for orders, large readable fonts, and simple touch controls ensure that players with vision or motor difficulties can run their pizzeria smoothly. Managing orders and toppings feels satisfying without being overwhelming",
                flagged: false,
            },
            {
                user_id: RocketRaccoon._id,
                game_id: games[3]._id,
                rating: 4,
                body: "The game’s charm comes alive thanks to the accessible design. I love that I can customize controls and rely on visual and audio cues for completing orders. Accessibility features ensure I can focus on strategy and customer satisfaction without struggling with interface issues.",
                flagged: false,
            },
            {
                user_id: BouncyBear._id,
                game_id: games[3]._id,
                rating: 5,
                body: "Good Pizza, Great Pizza balances fun and accessibility perfectly. The clear UI, optional audio prompts, and high-contrast mode make it possible to enjoy the game fully, even with visual challenges. I never feel left out, and gameplay remains immersive.",
                flagged: false,
            },
            // game 5 reviews
            {
                user_id: GigglyGiraffe._id,
                game_id: games[4]._id,
                rating: 4,
                body: "Township is a relaxing city-building game, and the accessibility features make it very inclusive. Large buttons, readable fonts, and visual progress indicators allow me to manage my town without stress. Even complex farming or production tasks are easy to follow thanks to these thoughtful design choices.",
                flagged: false,
            },
            {
                user_id: RocketRaccoon._id,
                game_id: games[4]._id,
                rating: 3,
                body: "I enjoy constructing my town, and Township’s accessibility options make it even better. Subtitles, clear tutorials, and customizable interface settings ensure that gameplay is understandable for players with visual, cognitive, or motor challenges",
                flagged: false,
            },
            {
                user_id: BouncyBear._id,
                game_id: games[4]._id,
                rating: 3,
                body: "Township offers both creativity and inclusivity. The accessible design, including adjustable font sizes and simple interaction controls, lets me focus on strategy and planning without missing key game elements.",
                flagged: false,
            },
            // game 6 reviews
            {
                user_id: GigglyGiraffe._id,
                game_id: games[5]._id,
                rating: 5,
                body: "Flow Free is simple but addictive, and the accessibility features make it approachable for everyone. Colorblind modes and adjustable puzzle difficulty allow me to connect the pipes without struggling to distinguish colors. The game’s smooth interface makes it easy for players with motor difficulties to enjoy at their own pace.",
                flagged: false,
            },
            {
                user_id: RocketRaccoon._id,
                game_id: games[5]._id,
                rating: 4,
                body: "I love solving the puzzles in Flow Free, and accessibility features make it even more satisfying. Visual cues, optional hints, and adaptive controls allow me to focus on completing levels without frustration, making it perfect for players of all abilities.",
                flagged: false,
            },
            {
                user_id: PixelPanda._id,
                game_id: games[5]._id,
                rating: 4,
                body: "Flow Free’s minimalist design is great, and its accessibility options take it to the next level. The game supports colorblind modes and responsive touch controls, which make puzzle-solving intuitive and inclusive.",
                flagged: false,
            },
            // game 7 reviews
            {
                user_id: PixelPanda._id,
                game_id: games[6]._id,
                rating: 5,
                body: "Balatro is a clever strategy game, and I really appreciate the accessibility options. The high-contrast mode and large text settings make it easy to follow game mechanics, and simplified controls ensure I can focus on planning my moves without feeling overwhelmed.",
                flagged: false,
            },
            {
                user_id: RocketRaccoon._id,
                game_id: games[6]._id,
                rating: 4,
                body: "I enjoy the tactical depth of Balatro, and accessibility features make it playable for a wide range of users. Visual indicators for possible moves, optional audio cues, and clear UI elements allow players with visual or cognitive challenges to stay fully engaged.",
                flagged: false,
            },
            {
                user_id: BouncyBear._id,
                game_id: games[6]._id,
                rating: 4,
                body: "Balatro is challenging yet accessible. Features like adjustable fonts, visual feedback, and intuitive interface design allow me to concentrate on strategy and game flow without being hindered by physical or sensory limitations.",
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
