import sideImg from '../../../assets/accessibilityStatementSideImage.jpg';
import logo from '../../../assets/gameAbleLogoBlack.png';
import './AccessibilityStatement.css';

export default function AccessibilityStatement() {
    return (
        <main className="accessibility-page" role="main">
            <aside className="access-left" aria-hidden="true">
                <img src={sideImg} alt="Decorative gaming accessibility graphic" />
            </aside>

            <section className="access-right" aria-labelledby="access-title">
                <img src={logo} alt="Gameable logo" className="access-logo" />
                <h1 id="access-title">Accessibility Statement</h1>

                <p className="access-body">
                    We are committed to ensuring that our platform is accessible, inclusive, and usable for all players. Our website is fully compatible with voice-control navigation tools, allowing users to search, browse, and interact with content hands-free. Every page has been designed with screen-reader compatibility in mind, using clear semantic structure, descriptive labels, and alt text to ensure that essential information is accessible to users with visual impairments. Captions are also available for all platform audio, making our content understandable to those who rely on visual or textual alternatives.
                </p>
                <p className="access-body">
                    To support a wide range of visual needs, we provide several customisation options that allow users to tailor their browsing experience. This includes high-contrast display modes for improved readability, colour-blind–friendly palettes, and scalable text so users can adjust content to suit their comfort. These enhancements ensure that every visitor can interact with the site in a way that feels natural, clear, and accessible, regardless of their vision requirements or device settings.
                </p>
                <p className="access-body">
                    Accessibility is also built into the core of our mission. Our platform exists to help players discover games through meaningful accessibility tags, detailed breakdowns of in-game features, and community-driven reviews. Because of this, it’s important that our website itself reflects the same principles of usability and inclusivity we promote in games. We continuously test, refine, and improve our accessibility features, and we welcome feedback from users so we can keep making the platform better. Our goal is simple: to create a space where every player can explore gaming with confidence and without barriers.
                </p>

            </section>
        </main>
    );
}