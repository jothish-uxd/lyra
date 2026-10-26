import type { Board, Card, CoreWord } from '../types';

// Core words stay in the same place on every page so they can be found by motor memory.
export const CORE_WORDS: CoreWord[] = [
  { label: 'I', emoji: '👤' },
  { label: 'want', emoji: '👉' },
  { label: 'need', emoji: '🙋' },
  { label: 'more', emoji: '➕' },
  { label: 'help', emoji: '🆘' },
  { label: 'yes', emoji: '✅' },
  { label: 'no', emoji: '❌' },
  { label: 'stop', emoji: '🛑' },
];

const CATEGORIES = [
  { id: 'people', name: 'People', icon: '👥' },
  { id: 'food', name: 'Food', icon: '🍽️' },
  { id: 'places', name: 'Places', icon: '🏠' },
  { id: 'actions', name: 'Actions', icon: '➡️' },
  { id: 'feelings', name: 'Feelings', icon: '😊' },
  { id: 'body', name: 'Body', icon: '🧍' },
  { id: 'school', name: 'School', icon: '🏫' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
  { id: 'routines', name: 'Routines', icon: '🗓️' },
];

const CARDS: Record<string, [string, string][]> = {
  people: [['Mom', '👩'], ['Dad', '👨'], ['Grandma', '👵'], ['Grandpa', '👴'], ['Teacher', '🧑‍🏫'], ['Friend', '🧒'], ['Doctor', '🩺'], ['Me', '🙂'], ['Brother', '👦'], ['Sister', '👧']],
  food: [['water', '💧'], ['milk', '🥛'], ['juice', '🧃'], ['snack', '🍎'], ['dinner', '🍽️'], ['rice', '🍚'], ['chicken', '🍗'], ['bread', '🍞'], ['fruit', '🍌'], ['cookie', '🍪'], ['yogurt', '🥣'], ['all done', '🏁'], ['hungry', '😋'], ['thirsty', '💦']],
  places: [['home', '🏠'], ['school', '🏫'], ['bathroom', '🚻'], ['bedroom', '🛏️'], ['kitchen', '🍳'], ['car', '🚗'], ['playground', '🛝'], ['outside', '🌳'], ['store', '🛒'], ['hospital', '🏥'], ['bus', '🚌'], ['library', '📚']],
  actions: [['go', '➡️'], ['come', '👋'], ['open', '📂'], ['close', '📕'], ['play', '🧸'], ['read', '📚'], ['look', '👀'], ['listen', '👂'], ['eat', '🍽️'], ['drink', '🥤'], ['sleep', '😴'], ['wait', '⏳'], ['again', '🔁'], ['change', '🔄'], ['finished', '🏁'], ['like', '❤️'], ["don't like", '💔']],
  feelings: [['happy', '😊'], ['sad', '😢'], ['angry', '😠'], ['scared', '😟'], ['tired', '😴'], ['sick', '🤒'], ['hurt', '🤕'], ['calm', '😌'], ['excited', '🤩'], ['frustrated', '😣'], ['too loud', '🔊'], ['quiet', '🤫']],
  body: [['head', '🙂'], ['stomach', '🫄'], ['hand', '✋'], ['foot', '🦶'], ['mouth', '👄'], ['ear', '👂'], ['eye', '👁️'], ['tooth', '🦷'], ['pain', '⚡'], ['medicine', '💊']],
  school: [['teacher', '🧑‍🏫'], ['desk', '🪑'], ['book', '📖'], ['pencil', '✏️'], ['computer', '💻'], ['circle time', '⭕'], ['recess', '🛝'], ['lunch', '🥪'], ['bus', '🚌'], ['homework', '📝'], ['friend', '🧒'], ['break', '🌿']],
  toys: [['ball', '⚽'], ['blocks', '🧱'], ['doll', '🪆'], ['toy car', '🚙'], ['tablet', '📱'], ['music', '🎵'], ['bubbles', '🫧'], ['puzzle', '🧩'], ['paint', '🎨'], ['swing', '🛝']],
  routines: [['morning', '🌅'], ['brush teeth', '🪥'], ['get dressed', '👕'], ['school time', '🏫'], ['after school', '🎒'], ['bath', '🛁'], ['pajamas', '🛌'], ['bedtime', '🌙'], ['first', '1️⃣'], ['then', '2️⃣'], ['now', '⏱️'], ['next', '➡️']],
};

export function createDefaultBoard(): Board {
  const cards: Card[] = Object.entries(CARDS).flatMap(([categoryId, items]) =>
    items.map(([label, emoji], i) => ({ id: `${categoryId}-${i}`, label, emoji, categoryId })),
  );
  return {
    version: 1,
    categories: CATEGORIES.map((c) => ({ ...c })),
    cards,
    routines: [
      { id: 'r-break', words: ['I', 'want', 'break'] },
      { id: 'r-help', words: ['I', 'need', 'help'] },
      { id: 'r-water', words: ['I', 'want', 'water'] },
      { id: 'r-tired', words: ['I', 'feel', 'tired'] },
      { id: 'r-bathroom', words: ['go', 'bathroom'] },
    ],
    settings: { voiceURI: null, rate: 0.85, pitch: 1, speakOnTap: true, cardSize: 'medium' },
  };
}
