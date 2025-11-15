import React from "react";
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
    return (
        <div className="my-5">

            {/* Full-width wrapper */}
            <div style={{ position: "relative", left: "50%", transform: "translateX(-50%)", width: "100vw" }}>
                <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">

                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                data-bs-target="#heroCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
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
                            left: "20px",           // add padding from left edge
                            transform: "translateY(-50%)",
                            border: "none",
                            zIndex: 2,
                        }}
                    >
            <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
                style={{ filter: "invert(1)" }}
            ></span>
                        <span className="visually-hidden">Previous</span>
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
                            right: "20px",          // add padding from right edge
                            transform: "translateY(-50%)",
                            border: "none",
                            zIndex: 2,
                        }}
                    >
            <span
                className="carousel-control-next-icon"
                aria-hidden="true"
                style={{ filter: "invert(1)" }}
            ></span>
                        <span className="visually-hidden">Next</span>
                    </button>

                </div>
            </div>

            {/* Text + Buttons BELOW */}
            <div className="text-center mt-4 px-3">
                <h5 className="fw-bold text-uppercase text-muted">
                    Accessibility Spotlight
                </h5>

                <h2 className="fw-bold display-6">
                    {slides[0].title}
                </h2>

                <div className="d-flex justify-content-center gap-3 mt-3">
                    <BlackButton text="Play Now" />
                    <WhiteButton text="Review" />
                </div>
            </div>
        </div>
    );
};
