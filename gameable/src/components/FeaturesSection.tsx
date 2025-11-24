import React from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturesSection.css";

export const FeaturesSection: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/games");
    };

    return (
        <section
            className="features-container"
            role="region"
            aria-labelledby="accessibility-feature-heading"
        >
            {/* Section Title */}
            <div className="section-title">
                <h2 id="accessibility-feature-heading" className="heading">
                    Search By Accessibility
                </h2>
                <p className="subtext">
                    Find games by accessibility features - Find titles that fit how you play
                </p>
            </div>

            {/* Content */}
            <div className="features-content">

                {/* Visual */}
                <button className="feature-card visual" onClick={handleClick}>
                    <div className="feature-icon">
                        <i className="bi bi-eye"></i>
                    </div>
                    <div className="feature-text">VISUAL</div>
                </button>

                {/* Audio */}
                <button className="feature-card audio" onClick={handleClick}>
                    <div className="feature-icon">
                        <i className="bi bi-volume-up"></i>
                    </div>
                    <div className="feature-text">AUDIO</div>
                </button>

                {/* Motor */}
                <button className="feature-card motor" onClick={handleClick}>
                    <div className="feature-icon">
                        <i className="bi bi-hand-index"></i>
                    </div>
                    <div className="feature-text">MOTOR</div>
                </button>

                {/* Cognitive */}
                <button className="feature-card cognitive" onClick={handleClick}>
                    <div className="feature-icon">
                        <i className="bi bi-infinity"></i>
                    </div>
                    <div className="feature-text">COGNITIVE</div>
                </button>

            </div>
        </section>
    );
};
