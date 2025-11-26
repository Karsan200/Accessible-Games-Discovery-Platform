import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {useNavigate} from "react-router-dom";


// Check the thing that is going to be clicked is on screen
function isVisible(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Clicks something based on the element
function clickBySelector(selector: string): boolean {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (element && isVisible(element)) {
        element.click();
        return true;
    }
    return false;
}

// Clicks something based on the text
function clickByText(text: string): boolean {
    const elements = Array.from(document.querySelectorAll("*")) as HTMLElement[];

    for (const el of elements) {
        if (!isVisible(el)) continue;
        if (!el.innerText) continue;

        if (el.innerText.trim().toLowerCase() === text.trim().toLowerCase()) {
            el.click();
            return true;
        }
    }
    return false;
}

// Clicks the buttons based on the text inside them
function clickButtonByText(text: string) {
    // Normalize BOTH spoken text and button text
    const normalize = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[-_]/g, " ")
            .replace(/[^\w\s]/g, "");

    const target = normalize(text);

    const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));

    for (const btn of buttons) {
        const btnText = normalize(btn.textContent || "");

        if (btnText.includes(target)) {
            (btn as HTMLElement).click();
            return true;
        }
    }

    console.warn("No clickable element found for:", target);
    return false;
}

// Sanitises the spoken word
function safeClassFromSpeech(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
}

export default function FloatingVoiceNavigation() {

    const navigate = useNavigate()

    const clickNavButton = (selector: string) => {
        const btn = document.querySelector(selector) as HTMLElement;
        if (btn) {
            btn.click();
        } else {
            console.error("Button not found:", selector);
            throw new Error(`Button not Found: ${selector}`)
        }
    };

    const commands = [
        {
        command: ['*click stop*', '*stop record*', '*stop listening*', '*stop mic*', '*stop mike*', '*end listening*', '*end record*', '*end mic*', '*end mike*',],
            callback: () => {
            SpeechRecognition.stopListening();
                resetTranscript();
            }
        },
        {
            command: ['*clear*', '*reset*', '*clear text*', '*reset text*'],
            callback: () => {
                resetTranscript();
            }
        },
        {
            command: ['*scroll down*', '*move down*', '*go down*', '*page down*'],
            callback: () => {
                window.scrollBy({ top: 300, left: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*scroll up*', '*move up*', '*go up*', '*page up*'],
            callback: () => {
                window.scrollBy({ top: -300, left: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*scroll down more*', '*move down more*', '*go down more*', '*page down more*'],
            callback: () => {
                window.scrollBy({ top: 600, left: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*scroll up more*', '*move up more*', '*go up more*', '*page up more*'],
            callback: () => {
                window.scrollBy({ top: -600, left: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*scroll down less*', '*move down less*', '*go down less*', '*page down less*'],
            callback: () => {
                window.scrollBy({ top: 100, left: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*scroll up less*', '*move up less*', '*go up less*', '*page up less*'],
            callback: () => {
                window.scrollBy({ top: -100, left: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*scroll to bottom*', '*move to bottom*', '*go down to bottom*', '*go to bottom*', '*page to bottom*'],
            callback: () => {
                window.scrollTo({
                    top: Math.max(
                        document.body.scrollHeight,
                        document.documentElement.scrollHeight
                    ),
                    left: 0,
                    behavior: 'smooth'
                });
                resetTranscript();
            }
        },
        {
            command: ['*scroll to top*', '*move to top*', '*go up to top*', '*go to top*', '*page to top*'],
            callback: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                resetTranscript();
            }
        },
        {
            command: ['*click home*', '*open home*', '*navigate home*', '*go to home*'],
            callback: () => {
                try {
                    resetTranscript();
                    clickNavButton(".home");
                } catch {
                    resetTranscript();
                    navigate("/")
                }

            }
        },
        {
            command: ['*click wishlist*', '*click wish list*', '*open wishlist*', '*navigate wishlist*', '*go to wishlist*', '*open wish list*', '*navigate wish list*', '*go to wish list*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".wishlist")
                } catch (err) {
                    resetTranscript();
                    navigate("/wishlist")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: ['*click profile*', '*open profile*', '*navigate profile*', '*go to profile*', '*open pro file*', '*navigate pro file*', '*go to pro file*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".profile")
                } catch (err) {
                    resetTranscript();
                    navigate("/profile")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: ['*click settings*', '*open setting*', '*navigate setting*', '*go to setting*', '*open to setting*', '*navigate to setting*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".settings")
                } catch (err) {
                    resetTranscript();
                    navigate("/settings")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: ['*click about us*', '*open about us*', '*navigate about us*', '*go to about us*', '*open to about us*', '*navigate to about us*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".aboutUs")
                } catch (err) {
                    resetTranscript();
                    navigate("/footerPages/aboutUs")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: [
                '*click accessibility statement*',
                '*click access ability statement*',
                '*open accessibility statement*',
                '*navigate accessibility statement*',
                '*go to accessibility statement*',
                '*open to accessibility statement*',
                '*navigate to accessibility statement*',
                '*open access ability statement*',
                '*navigate access ability statement*',
                '*go to access ability statement*',
                '*open to access ability statement*',
                '*navigate to access ability statement*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".accessibilityStatement")
                } catch (err) {
                    resetTranscript();
                    navigate("/footerPages/accessibilityStatement")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: ['*click contact us*', '*open contact us*', '*navigate contact us*', '*go to contact us*', '*open to contact us*', '*navigate to contact us*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".contactUs")
                } catch (err) {
                    resetTranscript();
                    navigate("/footerPages/contactUs")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: ['*click login*', '*click log in*', '*login*', '*log in*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".login-btn")
                } catch (err) {
                    resetTranscript();
                    navigate("/login")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: ['*click logout*', '*click log out*', '*logout*', '*log out*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".logout-btn")
                } catch (err) {
                    resetTranscript();
                    navigate("/logout")
                    console.warn("failed using backup")
                }
            }
        },
        {
            command: '*start*',
            callback: () => {
                SpeechRecognition.startListening({ continuous: true });
            }
        },
        {
            command: ["open *", "click *", "select *"],
            callback: (item: string) => {
                const className = safeClassFromSpeech(item);
                resetTranscript();

                // Try clicking a button/text first
                if (clickByText(className)) {
                    return;
                }

                // Try clicking by class name
                if (clickBySelector("." + className.toLowerCase().replace(/\s+/g, ""))) {
                    return;
                }

                // Try clicking by button text
                if (clickButtonByText(className)) {
                    return;
                }

                console.warn("No clickable element found for:", className);
            }
        }
        ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    if(!browserSupportsSpeechRecognition) {
        return <p>Browser Support Speech Recognition</p>
    }

    return (
        <div style={styles.box}>
            <div style={styles.container}>
                <p>Microphone: {listening ? "ON" : "OFF"}</p>

                <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>
                    Start
                </button>

                <button onClick={SpeechRecognition.stopListening}>Stop</button>

                <button onClick={resetTranscript}>Reset</button>
                <div style={styles.transcriptBox}>
                    <p>{transcript}</p>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    box: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        padding: "12px",
        borderRadius: "10px",
        border: "2px solid #007bff",
        background: "0 rgba(255, 255, 255, 0.87)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    },
    container: {
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
    },
    transcriptBox: {
        marginTop: "8px",
        padding: "10px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        maxWidth: "200px",
    }
};