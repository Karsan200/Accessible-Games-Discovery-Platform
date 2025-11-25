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
        command: ['*stop record*', '*stop listening*', '*stop mic*', '*stop mike*', '*end listening*', '*end record*', '*end mic*', '*end mike*'],
            callback: () => {
            SpeechRecognition.stopListening();
            console.log("stopped")
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
                } catch {
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
                } catch {
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
                } catch {
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
            command: '*start*',
            callback: () => {
                SpeechRecognition.startListening({ continuous: true });
                console.log("started")
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
        <div>
            <p>Microphone: {listening ? "ON" : "OFF"}</p>

            <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>
                Start
            </button>

            <button onClick={SpeechRecognition.stopListening}>Stop</button>

            <button onClick={resetTranscript}>Reset</button>

            <p>{transcript}</p>
        </div>
    );
}