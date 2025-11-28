import { useEffect, useRef } from 'react';

import bg from '../../../assets/aboutUsBackgroundImage.png';
import sideImage from '../../../assets/aboutUsSideImage.png';

import './AboutUs.css';

export default function AboutUs() {
    const missionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = missionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Toggle the class based on visibility so the animation can replay when the element leaves and re-enters.
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    } else {
                        entry.target.classList.remove('in-view');
                    }
                });
            },
            { threshold: 0.12 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <main className="about-page">
            <section
                className="about-hero"
                role="img"
                aria-label="About hero image"
                style={{
                    backgroundImage: `url(${bg})`,
                }}
            >
                <h1 className="about-hero-title">About</h1>
            </section>

            <section className="about-content">
                <div className="about-left" aria-hidden="false">
                    <img
                        src={sideImage}
                        alt="Placeholder graphic"
                    />
                </div>

                <div className="about-right">
                    <p className="green-subheading">About Us</p>
                    <h2 className="tagline">We provide accessibility insights so every gamer can find the right experience for them.
                    </h2>
                </div>
            </section>

            <section className="mission-bleed">
                <div ref={missionRef} className="mission-inner reveal">
                    <h3 className="mission-heading">Our Mission</h3>
                    <p className="mission-text">
                        Our mission is to make gaming more accessible, understandable, and enjoyable for everyone. We believe that every player regardless of ability, deserves the chance to discover games that truly work for them. Too often, accessibility information is hidden, incomplete, or inconsistent across platforms. We aim to change that by creating a space where accessibility details are clear, central, and easy to explore.
                    </p>
                    <p className="mission-text">
                        We are dedicated to helping players find games that fit their needs through meaningful accessibility tags, in-depth feature breakdowns, and honest community reviews. Whether someone is looking for visual clarity, audio alternatives, motor-friendly controls, or cognitive-supportive gameplay, our platform provides the tools to sort, compare, and understand games with confidence. We highlight what each game offers, not in vague terms, but in practical, real-world descriptions that matter to players.
                    </p>
                    <p className="mission-text">
                        At the heart of our mission is community. By giving players a voice to share their experiences, challenges, and successes, we help others make informed decisions based on lived experience and not just marketing claims. We’re not here to sell games; we’re here to make gaming more transparent, more inclusive, and more welcoming. Together, we’re reshaping the way accessibility is understood in the gaming world, one review and one discovery at a time.
                    </p>

                </div>

            </section>
        </main>
    );
}
