import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { WhiteButton } from "./WhiteButton";
import { GameTags } from "./game/GameTags";
import { useNavigate } from "react-router-dom";

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

    const arrowStyle: React.CSSProperties = {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1px solid #000",
        backgroundColor: "#151515",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px",
    };

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
        <section
            style={{
                width: "100%",
                maxWidth: "1440px",
                margin: "0 auto",
                background: "#FFFFFF",
                marginTop: "-128px",
            }}
            aria-label="Hero Carousel"
        >
            {/* Carousel */}
            <Carousel
                activeIndex={safeIndex}
                onSelect={(index) => setActiveIndex(index)}
                controls={true}
                indicators={true}
                interval={5000}
                slide={true}
                className="w-100"
                prevIcon={
                    <div style={arrowStyle}>
                        <span aria-hidden="true" className="carousel-control-prev-icon" />
                    </div>
                }
                nextIcon={
                    <div style={arrowStyle}>
                        <span aria-hidden="true" className="carousel-control-next-icon" />
                    </div>
                }
            >
                {slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <div
                            style={{
                                width: "100%",
                                height: "345px",
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                            role="img"
                            aria-label={slide.title}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Content Below Carousel */}
            <Container
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    maxWidth: "1280px",
                    width: "100%",
                    marginTop: "32px",
                    padding: "0 16px",
                    gap: "40px",
                }}
            >
                {/* Left Column: Title + Buttons */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "16px",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            fontSize: "64px",
                            lineHeight: "120%",
                            color: "#000000",
                            margin: 0,
                            textAlign: "left",
                        }}
                        tabIndex={0}
                    >
                        {activeSlide.title}
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "16px",
                            marginTop: "16px",
                        }}
                    >
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

                {/* Right Column: Tags + Description */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        gap: "12px",
                    }}
                >
                    {/* Accessibility Tags */}
                    {activeSlide.tags && activeSlide.tags.length > 0 && (
                        <div>
                            <GameTags tags={activeSlide.tags} />
                        </div>
                    )}

                    {/* Description */}
                    {activeSlide.description && (
                        <p
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "150%",
                                color: "#000000",
                                margin: 0,
                                textAlign: "left",
                            }}
                        >
                            {activeSlide.description}
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
};
