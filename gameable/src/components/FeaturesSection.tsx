import React from "react";
import "./FeaturesSection.css";

export const FeaturesSection: React.FC = () => {
    return (
        <section className="features-container">
            {/* Section Title */}
            <div className="section-title">
                <h2 className="heading">Browse By Accessibility</h2>
                <p className="subtext">Browse games by accessibility features — find titles that fit how you love to play. </p>
            </div>

            {/* Content */}
            <div className="features-content">
                {/* Frame 2 */}
                <div className="feature-card visual">
                    <div className="feature-icon"></div>
                    <div className="feature-text">VISUAL</div>
                </div>

                {/* Frame 3 */}
                <div className="feature-card audio">
                    <div className="feature-icon"></div>
                    <div className="feature-text">AUDIO</div>
                </div>

                {/* Frame 4 */}
                <div className="feature-card motor">
                    <div className="feature-icon"></div>
                    <div className="feature-text">MOTOR</div>
                </div>

                {/* Frame 5 */}
                <div className="feature-card cognitive">
                    <div className="feature-icon"></div>
                    <div className="feature-text">COGNITIVE</div>
                </div>
            </div>
        </section>
    );
};
