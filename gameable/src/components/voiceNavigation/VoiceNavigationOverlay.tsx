import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function Recognition() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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