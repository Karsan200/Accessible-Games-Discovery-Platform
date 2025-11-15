// importing components
import { GameBreadcrumbs } from "../components/game/GameBreadcrumbs";
import { GameTags } from "../components/game/GameTags";
import { GameStars } from "../components/game/GameStars";
import { Carousel } from "../components/game/Carousel";
import "./GamePage.css";

//importing images (temporary placeholders)
import img1 from "../assets/temporaryGamePageImages/game1.png";
import img2 from "../assets/temporaryGamePageImages/game2.png";
import img3 from "../assets/temporaryGamePageImages/game3.png";
import img4 from "../assets/temporaryGamePageImages/game4.png";
import img5 from "../assets/temporaryGamePageImages/game5.png";
import img6 from "../assets/temporaryGamePageImages/game6.png";
import profileImg from "../assets/temporaryGamePageImages/profilepicTemp.png";

// Page component showing a game's details and customer reviews
export function GamePage() {
    // Static game for now as placeholder until backend is ready
    const game = {
        title: "Minecraft",
        images: [img1, img2, img3, img4, img5, img6],
        rating: 4.5,
        reviewCount: 10,
        tags: ["Vision", "Hearing", "Cognitive"],
        description:
            "Discover the world of Minecraft. Build anything you can imagine, uncover eerie mysteries, and survive the night in the ultimate sandbox adventure game. In Minecraft, every playthrough is different, and unforgettable adventures await behind every corner. Explore and craft your way through an infinite world that’s yours to shape, one block at a time.",
        details:
            "Gather Resources\nThe typical journey starts with punching a tree to gather wood. The rest of your Minecraft adventure is up to you, whether you mine for precious ores or seek out rare materials. Just make sure to stock up on food!\n\nSurvive the Night\nWhen the sun goes down, hostile mobs abound. Will you face them or sleep through the night? And remember: it’s always dark underground...\n\nBuild Amazing Things\nMinecraft is the ultimate building game. Craft tools, build a humble shelter, or engineer your base with redstone. Can you build a base in the Nether? Only one way to find out.",

        accessibility:
            "Minecraft includes a range of accessibility options that support players with vision, hearing, and cognitive impairments. The game offers a High Contrast Mode to improve visual clarity and readability, along with the Text-to-Speech Narrator, which can read menus and chat messages aloud for players with visual difficulties. Subtitles are available to provide visual cues for in-game sounds like footsteps, nearby mobs, or environmental effects, supporting those with hearing impairments. Minecraft also allows customizable controls and simplified interface settings to reduce cognitive load, helping players tailor gameplay to their individual needs and comfort levels.",
    };

    // Array of customer reviews shown in the review carousel (temporary static data)
    const reviews = [
        {
            rating: "★★★★★",
            text: "The High Contrast Mode and adjustable UI scale made a huge difference for me. I could finally distinguish blocks and HUD elements during intense moments, and the ability to increase text size without breaking the layout meant menus remained usable. Accessibility options felt thoughtfully implemented rather than tacked on.",
            user: "EllieFan99",
            img: profileImg,
        },
        {
            rating: "★★★★☆",
            text: "Subtitles with speaker labels and environmental cues helped me follow multiplayer sessions and story moments. The captioning includes directional hints which is especially useful when I can’t rely on audio — clear, detailed, and configurable.",
            user: "GamerGirl",
            img: profileImg,
        },
        {
            rating: "★★★★★",
            text: "The Text-to-Speech Narrator and keyboard remapping allowed me to play comfortably without muscle strain. I mapped essential actions to a simplified layout and used narration for chat and menus. These features enabled longer play sessions and made navigation straightforward.",
            user: "JoelLives",
            img: profileImg,
        },
        {
            rating: "★★★★☆",
            text: "Customization for control sensitivity and toggle options for accessibility reduced cognitive load. The simplified interface mode removed clutter and highlighted essential actions, which helped me focus on building and exploring without being overwhelmed by UI noise.",
            user: "BuilderBob",
            img: profileImg,
        },
        {
            rating: "★★★☆☆",
            text: "Good accessibility foundations, but some tooltips and third‑party mods don’t always respect the high-contrast palette. Overall the in-game options are strong, but consistency across add-ons would push this from good to excellent.",
            user: "Critic123",
            img: profileImg,
        },
    ];

    // Map images to carousel items
    const imageItems = game.images.map((img, i) => (
        <img
            key={i}
            src={img}
            className="d-block w-100 rounded"
            alt={`Game screenshot ${i + 1}`}
        />
    ));

    // Map reviews to review-box elements used inside the review carousel
    const reviewItems = reviews.map((review, i) => (
        <div className="review-box w-100 h-100" key={i}>
            <h4 className="mb-1">{review.rating}</h4>
            <p className="mb-2">{review.text}</p>
            <div className="review-meta">
                <img
                    src={review.img}
                    alt={review.user}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
                <strong>{review.user}</strong>
            </div>
        </div>
    ));

    return (
        <div className="container my-5">
            <div className="game-page-flex">
                <div className="game-images-col">

                    <Carousel id="gameImages" items={imageItems} visibleCount={1} step={1} />

                    <div className="game-details-left mt-3">
                        <h3 className="mb-2">Details</h3>
                        <p className="game-details">{game.details}</p>
                    </div>
                </div>

                <div className="game-info-col">
                    <div className="game-breadcrumbs">
                        <GameBreadcrumbs gameTitle={game.title} />
                    </div>

                    <h1 className="game-title">{game.title}</h1>

                    <div className="game-tags-wrapper">
                        <GameTags tags={game.tags} />
                    </div>

                    <div className="game-rating-row">
                        <GameStars rating={game.rating} />
                        <span className="ms-2">({game.rating} stars)</span>
                        <span className="mx-2">•</span>
                        <span>{game.reviewCount} reviews</span>
                    </div>

                    <p className="game-description">{game.description}</p>

                    <button className="btn btn-primary game-fav-btn">Add to favourites</button>

                    <h3 className="mt-4 mb-2">Accessibility</h3>
                    <p className="game-accessibility">{game.accessibility}</p>

                    <hr className="mt-4 mb-4" />
                </div>
            </div>

            <hr className="my-5 full-width-hr" />

            <h2 className="mb-2">Customer Reviews</h2>
            <p className="text-muted mb-4">This is what the customers have to say.</p>

            <Carousel id="reviewCarousel" items={reviewItems} visibleCount={3} step={1} />
        </div>
    );
}
