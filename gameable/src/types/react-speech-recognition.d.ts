declare module "react-speech-recognition" {
    export interface Command {
        command: string | string[];
        callback: (...args: any[]) => void;
        matchInterim?: boolean;
        isFuzzyMatch?: boolean;
        fuzzyMatchingThreshold?: number;
        bestMatchOnly?: boolean;
    }

    export interface UseSpeechRecognitionOptions {
        commands?: Command[];
    }

    export function useSpeechRecognition(
        options?: UseSpeechRecognitionOptions
    ): {
        transcript: string;
        listening: boolean;
        resetTranscript: () => void;
        browserSupportsSpeechRecognition: boolean;
        commands
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
