import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { WhiteButton } from "./WhiteButton";

interface HeroSlide {
    id: string;
    image: string;
    title: string;
}

interface HeroHeaderProps {
    slides: HeroSlide[];
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Prevent crashes while loading
    if (!slides || slides.length === 0) {
        return null; // or a loading spinner
    }

    // Make sure activeIndex is within bounds (in case slides change dynamically)
    const safeIndex = Math.min(activeIndex, slides.length - 1);
    const activeSlide = slides[safeIndex];

    const arrowStyle: React.CSSProperties = {
        backgroundColor: "rgba(0,0,0,0.65)",
        borderRadius: "50%",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <section className="mb-5 overflow-hidden" aria-label="Hero Carousel">
            <Carousel
                activeIndex={safeIndex}
                onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
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
                                height: "60vh",
                                minHeight: "300px",
                                maxHeight: "650px",
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

            <Container className="text-center mt-4 px-2 px-md-3">
                <h5 className="fw-bold text-uppercase text-muted fs-6 fs-md-5 text-wrap">
                    Accessibility Spotlight
                </h5>

                <h2 className="fw-bold display-6 fs-4 fs-md-2 text-wrap" tabIndex={0}>
                    {activeSlide.title}
                </h2>

                <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-3 flex-wrap">
                    <BlackButton
                        text="Play Now"
                        aria-label={`Play ${activeSlide.title}`}
                    />
                    <WhiteButton
                        text="Review"
                        aria-label={`Review ${activeSlide.title}`}
                    />
                </div>
            </Container>
        </section>
    );
};
