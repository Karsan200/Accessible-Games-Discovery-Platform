import React from "react";
import { HeroHeader } from "../components/HeroHeader";
import { TrendingGames } from "../components/TrendingGames";
import { TopSellersSection } from "../components/TopSellersSection";

// Define the tag type
type TagType = "Visual" | "Audio" | "Motor" | "Cognitive";

// Define the Game type for top sellers
interface TopSellerGame {
    id: number;
    image: string;
    title: string;
    description: string;
    tags: TagType[];
    rating: number;
}

export const Home: React.FC = () => {
    // Hero slides
    const slides = [
        {
            id: 1,
            image: "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/0kRqUeSBIbQzz7cen3c989c6.jpg",
            title: "Blind-Friendly RPG",
        },
        {
            id: 2,
            image: "https://cdn1.epicgames.com/spt-assets/e56a7411805046d3b5b7253a6e4e0faa/monument-valley-1gys5.jpg",
            title: "One-Hand Accessible Platformer",
        },
        {
            id: 3,
            image: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Balatro.jpg",
            title: "Voice-Controlled Adventure",
        },
    ];

    // Trending games
    const trendingGames = [
        {
            id: 1,
            image: "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/0kRqUeSBIbQzz7cen3c989c6.jpg",
            name: "Blind-Friendly RPG",
            description: "An epic RPG designed with screen reader accessibility in mind.",
            tags: ["Visual"] as TagType[],
        },
        {
            id: 2,
            image: "https://cdn1.epicgames.com/spt-assets/e56a7411805046d3b5b7253a6e4e0faa/monument-valley-1gys5.jpg",
            name: "One-Hand Platformer",
            description: "Challenging platforming with one-hand control.",
            tags: ["Visual", "Cognitive"] as TagType[],
        },
        {
            id: 3,
            image: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Balatro.jpg",
            name: "Voice-Control Adventure",
            description: "Explore a rich world controlled entirely by voice commands.",
            tags: ["Visual", "Motor"] as TagType[],
        },
        {
            id: 4,
            image: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_Doom.jpg",
            name: "Colorblind Puzzle",
            description: "Puzzle game optimized for colorblind players.",
            tags: ["Audio", "Cognitive", "Motor"] as TagType[],
        },
    ];

    // Top sellers with fixed TagType
    const topSellers: TopSellerGame[] = [
        {
            id: 1,
            image: "https://play-lh.googleusercontent.com/cKbYQSRgvec6n2oMJLVRWqHS8BsH9AxBp-cFGrGqve3CpE4EmI3Ofej1RCUciQbqhebCfiDIomUQINqzIL4I7kk",
            title: "Blind-Friendly RPG",
            description: "An epic RPG designed with screen reader accessibility in mind.",
            tags: ["Visual", "Audio"] as TagType[],
            rating: 5,
        },
        {
            id: 2,
            image: "https://cdn.jim-nielsen.com/ios/512/monument-valley-2015-03-03.png?rf=1024",
            title: "One-Hand Platformer",
            description: "Challenging platforming game that can be played with one hand.",
            tags: ["Motor"] as TagType[],
            rating: 4,
        },
        {
            id: 3,
            image: "https://i.pinimg.com/736x/f0/44/83/f04483bbad609167bf64d0fd5dd7c0d8.jpg",
            title: "Voice-Control Adventure",
            description: "Explore a rich world entirely controlled by your voice commands.",
            tags: ["Cognitive", "Audio"] as TagType[],
            rating: 5,
        },
        {
            id: 4,
            image: "https://play-lh.googleusercontent.com/aHnvdFTx0LVyfVHQLX51VcWBYkSVGvggr4FvIiP-iwBu4pKBiOQA1OnRi_nyFdCWqlU8",
            title: "Colorblind Puzzle",
            description: "Puzzle game optimized for colorblind players. Solve Puzzles!",
            tags: ["Visual", "Cognitive"] as TagType[],
            rating: 4,
        },
    ];

    return (
        <div>
            <HeroHeader slides={slides} />
            <TrendingGames games={trendingGames} />
            <TopSellersSection games={topSellers} />
        </div>
    );
};
