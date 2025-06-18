import { useState, useEffect, useCallback } from 'react';
import { SpeechService, SpeechServiceResult } from '../services/speechService';

export interface UseSpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [speechService, setSpeechService] = useState<SpeechService | null>(null);

  useEffect(() => {
    const service = new SpeechService({
      language: options.language || 'en-US',
      continuous: options.continuous ?? true,
      interimResults: options.interimResults ?? true,
    });

    setSpeechService(service);
    setIsSupported(service.getIsSupported());

    return () => {
      if (service.getIsListening()) {
        service.stop();
      }
    };
  }, [options.language, options.continuous, options.interimResults]);

  const startListening = useCallback(() => {
    if (!speechService || !isSupported) {
      options.onError?.('Speech recognition is not supported in this browser.');
      return false;
    }

    const success = speechService.start(
      (result: SpeechServiceResult) => {
        options.onTranscript?.(result.transcript, result.isFinal);
      },
      (error: string) => {
        setIsListening(false);
        options.onError?.(error);
      },
      () => {
        setIsListening(false);
      }
    );

    if (success) {
      setIsListening(true);
    }

    return success;
  }, [speechService, isSupported, options]);

  const stopListening = useCallback(() => {
    if (speechService) {
      speechService.stop();
      setIsListening(false);
    }
  }, [speechService]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};
