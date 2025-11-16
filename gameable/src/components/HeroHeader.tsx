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
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    return (
        <section className="my-5" aria-label="Hero Carousel">
            {/* Full width section */}
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                controls
                indicators
                fade
                interval={5000}
                className="w-100"
                style={{ maxHeight: "650px" }}
            >
                {slides.map((slide) => (
                    <Carousel.Item key={slide.id}>
                        <div
                            style={{
                                height: "60vh",
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                            role="img"
                            aria-label={slide.title}
                        />
                        <Carousel.Caption></Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Text + Buttons BELOW */}
            <Container className="text-center mt-4">
                <h5 className="fw-bold text-uppercase text-muted">
                    Accessibility Spotlight
                </h5>

                <h2 className="fw-bold display-6">
                    {slides[index].title}
                </h2>

                <div className="d-flex justify-content-center gap-3 mt-3">
                    <BlackButton
                        text="Play Now"
                        aria-label={`Play ${slides[index].title}`}
                    />
                    <WhiteButton
                        text="Review"
                        aria-label={`Review ${slides[index].title}`}
                    />
                </div>
            </Container>
        </section>
    );
};
