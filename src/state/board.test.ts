import { describe, expect, it } from 'vitest';
import { boardReducer, sentenceReducer } from './board';
import { createDefaultBoard } from '../data/defaults';

describe('boardReducer', () => {
  it('adds and removes a card', () => {
    const board = createDefaultBoard();
    const card = { id: 'x', label: 'Grandma Rose', emoji: '📷', categoryId: 'people' };
    const added = boardReducer(board, { type: 'addCard', card });
    expect(added.cards.at(-1)).toEqual(card);
    const removed = boardReducer(added, { type: 'removeCard', id: 'x' });
    expect(removed.cards).toEqual(board.cards);
  });

  it('moves a card only within its category', () => {
    const board = createDefaultBoard();
    const foodLabels = (b: typeof board) => b.cards.filter((c) => c.categoryId === 'food').map((c) => c.label);
    const firstFood = board.cards.find((c) => c.categoryId === 'food')!;
    const moved = boardReducer(board, { type: 'moveCard', id: firstFood.id, delta: 1 });
    expect(foodLabels(moved).slice(0, 2)).toEqual(['milk', 'water']);
    expect(moved.cards.filter((c) => c.categoryId === 'people')).toEqual(
      board.cards.filter((c) => c.categoryId === 'people'),
    );
    // Moving past the start is a no-op.
    expect(boardReducer(board, { type: 'moveCard', id: firstFood.id, delta: -1 })).toBe(board);
  });

  it('ignores empty routines', () => {
    const board = createDefaultBoard();
    expect(boardReducer(board, { type: 'addRoutine', id: 'r', words: [] })).toBe(board);
  });

  it('merges settings', () => {
    const board = createDefaultBoard();
    const next = boardReducer(board, { type: 'updateSettings', settings: { rate: 1.2 } });
    expect(next.settings).toEqual({ ...board.settings, rate: 1.2 });
  });
});

describe('sentenceReducer', () => {
  it('builds, backs up and clears', () => {
    let s = sentenceReducer([], { type: 'push', word: 'I' });
    s = sentenceReducer(s, { type: 'push', word: 'want' });
    expect(s).toEqual(['I', 'want']);
    expect(sentenceReducer(s, { type: 'pop' })).toEqual(['I']);
    expect(sentenceReducer(s, { type: 'clear' })).toEqual([]);
  });
});
