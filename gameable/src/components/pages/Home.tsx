import React, { useEffect, useState } from "react";
import { HeroHeader } from "../HeroHeader.tsx";
import { TrendingGames } from "../TrendingGames.tsx";
import { TopSellersSection } from "../TopSellersSection.tsx";
import { settings } from "../../AppSettings.ts";

// Define the tag type
type TagType = "Visual" | "Audio" | "Motor" | "Cognitive";

interface TrendingGame {
    id: string;
    image: string;
    name: string;
    description: string;
    tags: TagType[];
}

interface TopSellerGame {
    id: string;
    image: string;
    title: string;
    description: string;
    tags: TagType[];
    rating: number;
}

interface HeroSlide {
    id: string;
    image: string;
    title: string;
}

export const Home: React.FC = () => {
    const [topSellers, setTopSellers] = useState<TopSellerGame[]>([]);
    const [trendingGames, setTrendingGames] = useState<TrendingGame[]>([]);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

    // Fetch DB data
    useEffect(() => {
        // Top sellers
        fetch(settings.apiBaseUrl + "/api/home/top-sellers")
            .then((res) => res.json())
            .then((data) => setTopSellers(data))
            .catch((err) => console.error("Error fetching top sellers:", err));

        // Trending
        fetch(settings.apiBaseUrl + "/api/home/trending")
            .then((res) => res.json())
            .then((data) => setTrendingGames(data))
            .catch((err) => console.error("Error fetching trending games:", err));

        // Hero carousel (new)
        fetch(settings.apiBaseUrl + "/api/home/hero")
            .then((res) => res.json())
            .then((data) => setHeroSlides(data))
            .catch((err) => console.error("Error fetching hero slides:", err));
    }, []);

    return (
        <div>
            <HeroHeader slides={heroSlides} />
            <TrendingGames games={trendingGames} />
            <TopSellersSection games={topSellers} />
        </div>
    );
};
