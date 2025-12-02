import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../data/AuthContext.tsx";
import "./VoiceNav.css"
import { Button } from "react-bootstrap";

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

// Function for checking multiple matches of text
function checkClickMultipleMatches(
    elements: HTMLElement[],
    matchText?: string,
    index = 0
): boolean {
    const visibleElements = elements.filter(isVisible);
    const matchedElements = matchText
        ? visibleElements.filter(
            el => (el.innerText || "").trim().toLowerCase() === matchText.trim().toLowerCase()
        )
        : visibleElements;

    //console.log("All elements passed in:", elements.length);
    //console.log("Visible elements:", visibleElements.length);
    //console.log("All matched elements:", matchedElements.length);
    //console.log("MatchText", matchText)
    //console.log("Matched elements:", matchedElements)

    // Remove all but the clickable elements
    const clickableElements = matchedElements.filter(el =>
        el.tagName === "BUTTON" || el.tagName === "A" || el.getAttribute("role") === "button"
    );

    if (clickableElements.length === 0) return false;

    clickableElements.forEach((el, i) => {
        el.dataset.voiceIndex = String(i + 1);
    });

    const targetIndex = index >= clickableElements.length ? clickableElements.length - 1 : index;
    clickableElements[targetIndex].click();
    //console.log(`Clicked element "${clickableElements[targetIndex].innerText}" at visible position ${targetIndex + 1}`);

    return true;
}

// Clicks something based on the element
function clickBySelector(selector: string, index = 0): boolean {
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    return checkClickMultipleMatches(elements, undefined, index);
}

// Clicks something based on the text
function clickByText(text: string, index = 0): boolean {
    const elements = Array.from(document.querySelectorAll("*")) as HTMLElement[];
    return checkClickMultipleMatches(elements, text, index);
}

// Clicks the buttons based on the text inside them
function clickButtonByText(text: string, index = 0): boolean {
    const normalize = (str: string) =>
        str.toLowerCase().trim().replace(/[-_]/g, " ").replace(/[^\w\s]/g, "");

    const target = normalize(text);
    const buttons = Array.from(document.querySelectorAll("button, a, [role='button']")) as HTMLElement[];

    // Filter buttons whose text has the target
    const matchedButtons = buttons.filter(btn => normalize(btn.textContent || "").includes(target));

    return checkClickMultipleMatches(matchedButtons, undefined, index);
}

// Sanitises the spoken word
function safeClassFromSpeech(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
}

// Gets target text and optional index from voice input
function parseVoiceCommand(input: string): { text: string; index: number } {
    let normalized = input.trim().toLowerCase();

    normalized = normalized.replace(/[.,!?]+$/, "");

    // Map Spoken "numbers" to integers
    const numberMap: Record<string, number> = {
        "won": 1, "one": 1,
        "too": 2, "to": 2, "two": 2,
        "three": 3,
        "for": 4, "fore": 4, "four": 4,
        "five": 5,
        "sex": 6, "six": 6,
        "seven": 7,
        "ate": 8, "eight": 8,
        "nein": 9, "nine": 9,
        "tin": 10, "ten": 10,
    };

    // Match a number at the end
    let match = normalized.match(/(.+?)\s+(\d+)$/);
    if (match) {
        const text = match[1].trim();
        const index = parseInt(match[2], 10) - 1;
        return { text, index };
    }

    // Match a written form of the number at the end
    match = normalized.match(/(.+?)\s+(\w+)$/);
    if (match) {
        const text = match[1].trim();
        const spokenNum =  match[2].toLowerCase();
        const index = numberMap[spokenNum] ? numberMap[spokenNum] - 1 : 0;
        return { text, index };
    }

    return { text: normalized, index: 0 };
}

// Allows for react input fields to actually update with inputted text
function reactInput(element: HTMLInputElement | HTMLTextAreaElement, newText: string) {
    const setter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(element),
        "value"
    )?.set;

    if (!setter) return;

    // Clear first
    setter.call(element, "");

    // Trigger React input event so it picks up the change
    element.dispatchEvent(new Event("input", { bubbles: true }));

    // Set the new text
    setter.call(element, newText);

    // Trigger React input event again
    element.dispatchEvent(new Event("input", { bubbles: true }));
}

let activeTextarea: HTMLInputElement | HTMLTextAreaElement | null = null;
let fieldWordCount = 0;

export default function FloatingVoiceNavigation() {
    const [active] = useState(true);

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
            command: ['*click search*', '*enter search*', '*go search*'],
            callback: () => {
                const searchBtn = document.querySelector(".search-btn") as HTMLElement;
                if (searchBtn) {
                    searchBtn.click();
                } else {
                    console.warn("Search button not found");
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
                const { text, index } = parseVoiceCommand(item);
                const className = safeClassFromSpeech(text);
                //console.log("Voice text:", text);
                //console.log("Index:", index);
                //console.log("Class selector:", className);
                resetTranscript();

                // Try clicking a button/text first
                if (clickByText(text, index)) {
                    return;
                }

                // Try clicking by class name
                if (clickBySelector("." + className, index)) {
                    return;
                }

                // Try clicking by button text
                if (clickButtonByText(text, index)) {
                    return;
                }

                console.warn("No clickable element found for:", className);
            }
        },
        {
            command: ["write in *", "type in *"],
            callback: (spoken: string) => {
                // @ts-ignore
                const { text, index } = parseVoiceCommand(spoken);

                // Find visible textareas
                const textareas = Array.from(document.querySelectorAll("textarea, input")) as (HTMLTextAreaElement | HTMLInputElement)[];
                const visibleTextareas = textareas.filter(isVisible);

                if (!visibleTextareas.length) {
                    console.warn("No visible textareas found");
                    return;
                }

                const targetIndex = Math.min(index, visibleTextareas.length - 1);
                activeTextarea = visibleTextareas[targetIndex];

                reactInput(activeTextarea, "");
                activeTextarea.focus();

                // Counts words after type in
                fieldWordCount = spoken.trim().split(/\s+/).length;

                //console.log(`Recording for textarea ${targetIndex + 1}`);
            }
        },
        {
            command: ["*paste*"],
            callback: () => {
                //console.log(activeTextarea)
                if (!activeTextarea) {
                    console.warn("No textarea active for writing");
                    return;
                }

                const text = transcript
                    .replace(/write in/gi, "")
                    .replace(/type in/gi, "")
                    .replace(/paste/gi, "")
                    .replace(/\./gi, "")
                    .trim();

                const words = text.trim().split(/\s+/);
                const textToPaste = words.slice(fieldWordCount).join(" ");

                //console.log(fieldWordCount)
                //console.log(words)
                //console.log(textToPaste)

                reactInput(activeTextarea, activeTextarea.value + textToPaste + " ");

                //console.log("Pasted:", text);

                resetTranscript();
                activeTextarea = null;
            }
        }
        ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (browserSupportsSpeechRecognition && active) {
            SpeechRecognition.startListening({ continuous: true });
        } else {
            SpeechRecognition.stopListening();
        }
    }, [active, browserSupportsSpeechRecognition]);

    if(!browserSupportsSpeechRecognition) {
        return <p>Browser Support Speech Recognition</p>
    }

    const { prefs } = useAuth();
    //console.log(prefs.voiceNavEnabled)
    //console.log(prefs.voiceNavLeft)

    const className = [
        "vn-box",
        prefs.voiceNavEnabled ? "vn-visible" : "vn-hidden",
        prefs.voiceNavLeft ? "vn-left" : "vn-right",
    ].join(" ");

    return (
        <div className={className}>
            <div className="vn-box-inner">
                <p>Microphone: {listening ? "ON" : "OFF"}</p>

                <div className="vn-actions-row">
                    <Button
                        variant={listening ? "danger" : "success"}
                        onClick={() => {
                            if (listening) {
                                SpeechRecognition.stopListening();
                            } else {
                                SpeechRecognition.startListening({ continuous: true });
                            }
                        }}
                    >
                        {listening ? "Stop" : "Start"}
                    </Button>
                    <Button onClick={resetTranscript}>Reset</Button>
                </div>
                <div className="vn-transcript">
                    <p>{transcript}</p>
                </div>
            </div>
        </div>
    );
}