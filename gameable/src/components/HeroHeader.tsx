import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { WhiteButton } from "./WhiteButton";
import { GameTags } from "./game/GameTags";
import { useNavigate } from "react-router-dom";
import "./HeroHeader.css";

interface HeroSlide {
    id: string;
    image: string;
    title: string;
    description?: string;
    tags?: ("Visual" | "Audio" | "Motor" | "Cognitive")[];
}

interface HeroHeaderProps {
    slides: HeroSlide[];
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    if (!slides || slides.length === 0) return null;

    const safeIndex = Math.min(activeIndex, slides.length - 1);
    const activeSlide = slides[safeIndex];

    const handlePlayNow = () => {
        navigate(`/games/${activeSlide.id}`);
    };

    const handleReview = () => {
        navigate(`/games/${activeSlide.id}`);
        setTimeout(() => {
            const el = document.getElementById("reviewCarousel");
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    return (
        <section className="hero-header" aria-label="Hero Carousel">
            <Carousel
                activeIndex={safeIndex}
                onSelect={(index) => setActiveIndex(index)}
                controls={true}
                indicators={true}
                interval={5000}
                slide={true}
                className="w-100"
                prevIcon={
                    <div className="hero-arrow">
                        <span aria-hidden="true" className="carousel-control-prev-icon" />
                    </div>
                }
                nextIcon={
                    <div className="hero-arrow">
                        <span aria-hidden="true" className="carousel-control-next-icon" />
                    </div>
                }
            >
                {slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <div
                            className="hero-slide-image"
                            style={{ backgroundImage: `url(${slide.image})` }}
                            role="img"
                            aria-label={slide.title}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            <Container className="hero-content-container">
                {/* Left Column */}
                <div className="hero-left">
                    <h1 className="hero-title" tabIndex={0}>
                        {activeSlide.title}
                    </h1>

                    <div className="hero-button-row">
                        <BlackButton
                            text="Play Now"
                            aria-label={`Play ${activeSlide.title}`}
                            onClick={handlePlayNow}
                        />
                        <WhiteButton
                            text="Review"
                            aria-label={`Review ${activeSlide.title}`}
                            onClick={handleReview}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="hero-right">
                    {activeSlide.tags && activeSlide.tags.length > 0 && (
                        <div>
                            <GameTags tags={activeSlide.tags} />
                        </div>
                    )}

                    {activeSlide.description && (
                        <p className="hero-description">
                            {activeSlide.description}
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
};
