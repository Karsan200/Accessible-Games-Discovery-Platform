import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {useNavigate} from "react-router-dom";

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
        command: ['*stop record*', '*stop listening*', '*stop mic*', '*stop mike*', '*end listening*', '*end record*', '*end mic*', '*end mike*',],
            callback: () => {
            SpeechRecognition.stopListening();
            }
        },
        {
            command: ['*clear*', '*reset*', '*clear text*', '*reset text*'],
            callback: () => {
                resetTranscript();
            }
        },
        {
            command: ['*open home*', '*navigate home*', '*go to home*'],
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
            command: ['*open wishlist*', '*navigate wishlist*', '*go to wishlist*', '*open wish list*', '*navigate wish list*', '*go to wish list*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".wishlist")
                } catch (err) {
                    resetTranscript();
                    navigate("/wishlist")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: ['*open profile*', '*navigate profile*', '*go to profile*', '*open pro file*', '*navigate pro file*', '*go to pro file*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".profile")
                } catch (err) {
                    resetTranscript();
                    navigate("/profile")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: ['*open setting*', '*navigate setting*', '*go to setting*', '*open to setting*', '*navigate to setting*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".settings")
                } catch (err) {
                    resetTranscript();
                    navigate("/settings")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: ['*open about us*', '*navigate about us*', '*go to about us*', '*open to about us*', '*navigate to about us*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".aboutUs")
                } catch (err) {
                    resetTranscript();
                    navigate("/footerPages/aboutUs")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: [
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
                    console.log("failed using backup")
                }
            }
        },
        {
            command: ['*open contact us*', '*navigate contact us*', '*go to contact us*', '*open to contact us*', '*navigate to contact us*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".contactUs")
                } catch (err) {
                    resetTranscript();
                    navigate("/footerPages/contactUs")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: ['*login*', '*log in*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".login-btn")
                } catch (err) {
                    resetTranscript();
                    navigate("/login")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: ['*logout*', '*log out*'],
            callback: () => {
                try {
                    resetTranscript()
                    clickNavButton(".logout-btn")
                } catch (err) {
                    resetTranscript();
                    navigate("/logout")
                    console.log("failed using backup")
                }
            }
        },
        {
            command: '*start*',
            callback: () => {
                SpeechRecognition.startListening({ continuous: true });
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