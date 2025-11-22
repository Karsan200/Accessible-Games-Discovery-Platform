import React, { useEffect, useState } from "react";
import { HeroHeader } from "../components/HeroHeader";
import { TrendingGames } from "../components/TrendingGames";
import { TopSellersSection } from "../components/TopSellersSection";
import { settings } from "../AppSettings.ts";

// Define the tag type
type TagType = "Visual" | "Audio" | "Motor" | "Cognitive";

interface TrendingGame {
    id: string;
    image: string;
    name: string;
    description: string;
    tagline?: string;
    tags: TagType[];
}

interface TopSellerGame {
    id: string;
    image: string;
    title: string;
    description: string;
    tagline?: string;
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

    useEffect(() => {
        // helper to ensure tags is always an array
        const normalize = <T extends { tags?: TagType[] }>(items?: T[] | null): T[] =>
            (items ?? []).map((it) => ({ ...it, tags: Array.isArray(it.tags) ? it.tags : ([] as TagType[]) }));
        // Top sellers
        fetch(settings.apiBaseUrl + "/api/home/top-sellers")
            .then((res) => res.json())
            .then((data) => {
                console.log("API /api/home/top-sellers →", data);
                setTopSellers(normalize(data) as TopSellerGame[]);
            })
            .catch((err) => console.error("Error fetching top sellers:", err));

        // Trending
        fetch(settings.apiBaseUrl + "/api/home/trending")
            .then((res) => res.json())
            .then((data) => {
                console.log("API /api/home/trending →", data);
                setTrendingGames(normalize(data) as TrendingGame[]);
            })
            .catch((err) => console.error("Error fetching trending games:", err));

        // Hero carousel (new)
        fetch(settings.apiBaseUrl + "/api/home/hero")
            .then((res) => res.json())
            .then((data) => {
                console.log("API /api/home/hero →", data);
                setHeroSlides(data || []);
            })
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
