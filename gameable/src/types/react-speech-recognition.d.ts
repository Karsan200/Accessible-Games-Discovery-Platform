declare module "react-speech-recognition" {
    export function useSpeechRecognition(): {
        transcript: string;
        listening: boolean;
        resetTranscript: () => void;
        browserSupportsSpeechRecognition: boolean;
    };

    export interface ListeningOptions {
        continuous?: boolean;
        language?: string;
    }

    export default class SpeechRecognition {
        static startListening(options?: ListeningOptions): void;
        static stopListening(): void;
        static abortListening(): void;
    }
}
