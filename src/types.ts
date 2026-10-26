export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Card {
  id: string;
  label: string;
  categoryId: string;
  /** Emoji shown when there is no photo. */
  emoji: string;
  /** Key of a photo blob in IndexedDB, for caregiver-added picture cards. */
  photoId?: string;
}

export interface CoreWord {
  label: string;
  emoji: string;
}

export interface Routine {
  id: string;
  words: string[];
}

export interface Settings {
  voiceURI: string | null;
  rate: number;
  pitch: number;
  /** Say each word aloud as it is tapped, not only when Speak is pressed. */
  speakOnTap: boolean;
  cardSize: 'small' | 'medium' | 'large';
}

export interface Board {
  version: 1;
  categories: Category[];
  cards: Card[];
  routines: Routine[];
  settings: Settings;
}
