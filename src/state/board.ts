import type { Board, Card, Settings } from '../types';

export type BoardAction =
  | { type: 'addCard'; card: Card }
  | { type: 'removeCard'; id: string }
  | { type: 'moveCard'; id: string; delta: -1 | 1 }
  | { type: 'addRoutine'; id: string; words: string[] }
  | { type: 'removeRoutine'; id: string }
  | { type: 'updateSettings'; settings: Partial<Settings> }
  | { type: 'replace'; board: Board };

export function boardReducer(board: Board, action: BoardAction): Board {
  switch (action.type) {
    case 'addCard':
      return { ...board, cards: [...board.cards, action.card] };
    case 'removeCard':
      return { ...board, cards: board.cards.filter((c) => c.id !== action.id) };
    case 'moveCard': {
      // Swap with the neighbouring card in the same category so the order other categories see is unchanged.
      const card = board.cards.find((c) => c.id === action.id);
      if (!card) return board;
      const sameCategory = board.cards.filter((c) => c.categoryId === card.categoryId);
      const pos = sameCategory.indexOf(card);
      const neighbour = sameCategory[pos + action.delta];
      if (!neighbour) return board;
      const cards = [...board.cards];
      const a = cards.indexOf(card);
      const b = cards.indexOf(neighbour);
      [cards[a], cards[b]] = [cards[b], cards[a]];
      return { ...board, cards };
    }
    case 'addRoutine':
      if (!action.words.length) return board;
      return { ...board, routines: [...board.routines, { id: action.id, words: action.words }] };
    case 'removeRoutine':
      return { ...board, routines: board.routines.filter((r) => r.id !== action.id) };
    case 'updateSettings':
      return { ...board, settings: { ...board.settings, ...action.settings } };
    case 'replace':
      return action.board;
  }
}

export type SentenceAction =
  | { type: 'push'; word: string }
  | { type: 'pop' }
  | { type: 'clear' }
  | { type: 'set'; words: string[] };

export function sentenceReducer(words: string[], action: SentenceAction): string[] {
  switch (action.type) {
    case 'push':
      return [...words, action.word];
    case 'pop':
      return words.slice(0, -1);
    case 'clear':
      return [];
    case 'set':
      return [...action.words];
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
