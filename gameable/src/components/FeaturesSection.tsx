import React from "react";
import "./FeaturesSection.css";

export const FeaturesSection: React.FC = () => {
    return (
        <section className="features-container">
            {/* Section Title */}
            <div className="section-title">
                <h2 className="heading">Search By Accessibility</h2>
                <p className="subtext">
                    Find games by accessibility features - Find titles that fit how you play
                </p>
            </div>

            {/* Content */}
            <div className="features-content">
                {/* Visual */}
                <div className="feature-card visual">
                    <div className="feature-icon">
                        <i className="bi bi-eye"></i>
                    </div>
                    <div className="feature-text">VISUAL</div>
                </div>

                {/* Audio */}
                <div className="feature-card audio">
                    <div className="feature-icon">
                        <i className="bi bi-volume-up"></i>
                    </div>
                    <div className="feature-text">AUDIO</div>
                </div>

                {/* Motor */}
                <div className="feature-card motor">
                    <div className="feature-icon">
                        <i className="bi bi-hand-index"></i>
                    </div>
                    <div className="feature-text">MOTOR</div>
                </div>

                {/* Cognitive */}
                <div className="feature-card cognitive">
                    <div className="feature-icon">
                        <i className="bi bi-infinity"></i>
                    </div>
                    <div className="feature-text">COGNITIVE</div>
                </div>
            </div>
        </section>
    );
};
