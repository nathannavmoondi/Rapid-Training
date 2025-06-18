// Speech recognition service for handling voice input

// Define speech recognition types that match the actual Web Speech API
interface SpeechRecognitionResult {
  readonly transcript: string;
  readonly confidence: number;
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export interface SpeechServiceResult {
  transcript: string;
  isFinal: boolean;
}

export interface SpeechServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor(config: SpeechServiceConfig = {}) {
    this.isSupported = this.checkSupport();
    
    if (this.isSupported) {
      this.initializeRecognition(config);
    }
  }
  private checkSupport(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  private initializeRecognition(config: SpeechServiceConfig): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    if (this.recognition) {
      this.recognition.continuous = config.continuous ?? true;
      this.recognition.interimResults = config.interimResults ?? true;
      this.recognition.lang = config.language ?? 'en-US';
    }
  }
  public start(
    onResult: (result: SpeechServiceResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition || this.isListening) {
      return false;
    }    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        // Try multiple ways to get the transcript
        let transcript = '';
        
        if (result[0] && result[0].transcript) {
          transcript = result[0].transcript;
        } else if (result.transcript) {
          transcript = result.transcript;
        } else if (result.length > 0 && result.item) {
          const item = result.item(0);
          transcript = item.transcript;
        } else {
          continue;
        }
        
        if (transcript && transcript.trim()) {
          onResult({ 
            transcript: transcript.trim(), 
            isFinal: !!result.isFinal 
          });
        }
      }
    };    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      this.isListening = false;
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
  public getIsSupported(): boolean {
    return this.isSupported;
  }
}
