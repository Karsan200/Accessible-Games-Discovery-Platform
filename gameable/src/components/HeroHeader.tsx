import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { BlackButton } from "./BlackButton";
import { WhiteButton } from "./WhiteButton";

interface HeroSlide {
    id: number;
    image: string;
    title: string;
}

interface HeroHeaderProps {
    slides: HeroSlide[];
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="mb-5" aria-label="Hero Carousel">
            <Carousel
                activeIndex={activeIndex}
                onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
                controls={true}
                indicators={true}
                interval={5000}
                slide={true}
                className="w-100"
            >
                {slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <div
                            style={{
                                width: "100%",
                                height: "60vh",
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

            {/* Dynamic Text + Buttons Below */}
            <Container className="text-center mt-4 px-3">
                <h5 className="fw-bold text-uppercase text-muted">
                    Accessibility Spotlight
                </h5>

                <h2 className="fw-bold display-6" tabIndex={0}>
                    {slides[activeIndex].title}
                </h2>

                <div className="d-flex justify-content-center gap-3 mt-3">
                    <BlackButton
                        text="Play Now"
                        aria-label={`Play ${slides[activeIndex].title}`}
                    />
                    <WhiteButton
                        text="Review"
                        aria-label={`Review ${slides[activeIndex].title}`}
                    />
                </div>
            </Container>
        </section>
    );
};
