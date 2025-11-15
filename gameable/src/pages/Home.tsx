import React from "react";
import { HeroHeader } from "../components/HeroHeader";
import { TrendingGames } from "../components/TrendingGames";

export const Home: React.FC = () => {
    const slides = [
        {
            id: 1,
            image: "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/0kRqUeSBIbQzz7cen3c989c6.jpg",
            title: "Blind-Friendly RPG"
        },
        {
            id: 2,
            image: "https://cdn1.epicgames.com/spt-assets/e56a7411805046d3b5b7253a6e4e0faa/monument-valley-1gys5.jpg",
            title: "One-Hand Accessible Platformer"
        },
        {
            id: 3,
            image: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Balatro.jpg",
            title: "Voice-Controlled Adventure"
        }
    ];
    const trendingGames = [
        {
            id: 1,
            image: "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/0kRqUeSBIbQzz7cen3c989c6.jpg",
            name: "Blind-Friendly RPG",
            description: "An epic RPG designed with screen reader accessibility in mind.",
        },
        {
            id: 2,
            image: "https://cdn1.epicgames.com/spt-assets/e56a7411805046d3b5b7253a6e4e0faa/monument-valley-1gys5.jpg",
            name: "One-Hand Platformer",
            description: "Challenging platforming with one-hand control.",
        },
        {
            id: 3,
            image: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Balatro.jpg",
            name: "Voice-Control Adventure",
            description: "Explore a rich world controlled entirely by voice commands.",
        },
        {
            id: 4,
            image: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_Doom.jpg",
            name: "Colorblind Puzzle",
            description: "Puzzle game optimized for colorblind players.",
        },
    ];

    return (
        <div>
            <HeroHeader slides={slides} />
            <TrendingGames games={trendingGames} />
        </div>
    );


};
