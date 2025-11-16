import React, { useEffect, useState } from "react";
import { HeroHeader } from "../components/HeroHeader";
import { TrendingGames } from "../components/TrendingGames";
import { TopSellersSection } from "../components/TopSellersSection";

// Define the tag type
type TagType = "Visual" | "Audio" | "Motor" | "Cognitive";

interface TrendingGame {
    id: number;
    image: string;
    name: string;
    description: string;
    tags: TagType[];
}

interface TopSellerGame {
    id: number;
    image: string;
    title: string;
    description: string;
    tags: TagType[];
    rating: number;
}

export const Home: React.FC = () => {
    const [topSellers, setTopSellers] = useState<TopSellerGame[]>([]);
    const [trendingGames, setTrendingGames] = useState<TrendingGame[]>([]);

    // Fetch DB data
    useEffect(() => {
        fetch("http://localhost:5000/home/top-sellers")
            .then((res) => res.json())
            .then((data) => setTopSellers(data))
            .catch((err) => console.error("Error fetching top sellers:", err));

        fetch("http://localhost:5000/home/trending")
            .then((res) => res.json())
            .then((data) => setTrendingGames(data))
            .catch((err) => console.error("Error fetching trending games:", err));
    }, []);

    // Hero slides (still static)
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

    return (
        <div>
            <HeroHeader slides={slides} />
            <TrendingGames games={trendingGames} />
            <TopSellersSection games={topSellers} />
        </div>
    );
};
