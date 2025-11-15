import React, { useState, useEffect, useRef } from "react";
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
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carouselEl = carouselRef.current;
        if (!carouselEl) return;

        const handleSlide = (event: CustomEvent & { to: number }) => {
            setActiveIndex(event.to);
        };

        carouselEl.addEventListener("slid.bs.carousel", handleSlide as EventListener);

        return () => {
            carouselEl.removeEventListener("slid.bs.carousel", handleSlide as EventListener);
        };
    }, []);

    return (
        <section className="my-5" aria-label="Hero Carousel">
            {/* Full-width wrapper */}
            <div
                style={{
                    position: "relative",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100vw",
                }}
            >
                <div
                    id="heroCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    ref={carouselRef}
                >
                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                data-bs-target="#heroCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-current={activeIndex === index ? "true" : undefined}
                                aria-label={`Slide ${index + 1}: ${slide.title}`}
                            />
                        ))}
                    </div>

                    {/* Slides */}
                    <div className="carousel-inner">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                            >
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
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#heroCarousel"
                        data-bs-slide="prev"
                        style={{
                            backgroundColor: "rgb(238,238,238)",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            top: "50%",
                            left: "20px",
                            transform: "translateY(-50%)",
                            border: "none",
                            zIndex: 2,
                        }}
                        aria-label="Previous Slide"
                    >
            <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
                style={{ filter: "invert(1)" }}
            ></span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#heroCarousel"
                        data-bs-slide="next"
                        style={{
                            backgroundColor: "rgb(238,238,238)",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            top: "50%",
                            right: "20px",
                            transform: "translateY(-50%)",
                            border: "none",
                            zIndex: 2,
                        }}
                        aria-label="Next Slide"
                    >
            <span
                className="carousel-control-next-icon"
                aria-hidden="true"
                style={{ filter: "invert(1)" }}
            ></span>
                    </button>
                </div>
            </div>

            {/* Text + Buttons BELOW */}
            <div className="text-center mt-4 px-3">
                <h5 className="fw-bold text-uppercase text-muted">
                    Accessibility Spotlight
                </h5>

                {/* Dynamic Title */}
                <h2 className="fw-bold display-6">{slides[activeIndex].title}</h2>

                <div className="d-flex justify-content-center gap-3 mt-3">
                    <BlackButton text="Play Now" aria-label={`Play ${slides[activeIndex].title}`} />
                    <WhiteButton text="Review" aria-label={`Review ${slides[activeIndex].title}`} />
                </div>
            </div>
        </section>
    );
};
