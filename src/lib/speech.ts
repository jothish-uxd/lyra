import { useEffect, useState } from 'react';
import type { Settings } from '../types';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

export const speechSupported = Boolean(synth);

export function speak(text: string, settings: Settings): void {
  if (!synth || !text.trim()) return;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  const voice = synth.getVoices().find((v) => v.voiceURI === settings.voiceURI);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  synth.speak(utterance);
}

/** Voices load asynchronously in most browsers, so listen for the change event. */
export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => synth?.getVoices() ?? []);
  useEffect(() => {
    if (!synth) return;
    const update = () => setVoices(synth.getVoices());
    update();
    synth.addEventListener('voiceschanged', update);
    return () => synth.removeEventListener('voiceschanged', update);
  }, []);
  return voices;
}
