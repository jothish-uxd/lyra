import { useCallback, useEffect, useReducer, useState } from 'react';
import type { Board, Card } from './types';
import { boardReducer, sentenceReducer } from './state/board';
import { createDefaultBoard } from './data/defaults';
import { clearPhotos, deletePhoto, loadBoard, requestPersistentStorage, saveBoard } from './lib/storage';
import { speak } from './lib/speech';
import { SentenceBar } from './components/SentenceBar';
import { CoreStrip } from './components/CoreStrip';
import { CategoryRail } from './components/CategoryRail';
import { CardGrid } from './components/CardGrid';
import { Routines } from './components/Routines';
import { HoldButton } from './components/HoldButton';
import { CaregiverPanel } from './components/CaregiverPanel';

export function App() {
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    loadBoard()
      .catch(() => createDefaultBoard())
      .then(setBoard);
    requestPersistentStorage();
  }, []);

  if (!board) return <div className="loading">Loading Lyra…</div>;
  return <LyraBoard initial={board} />;
}

function LyraBoard({ initial }: { initial: Board }) {
  const [board, dispatch] = useReducer(boardReducer, initial);
  const [sentence, dispatchSentence] = useReducer(sentenceReducer, []);
  const [activeId, setActiveId] = useState(initial.categories[0]?.id ?? '');
  const [caregiverOpen, setCaregiverOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    saveBoard(board).catch((err) => console.error('Could not save board', err));
  }, [board]);

  const tap = useCallback(
    (word: string) => {
      dispatchSentence({ type: 'push', word });
      if (board.settings.speakOnTap) speak(word, board.settings);
    },
    [board.settings],
  );

  const removeCard = (card: Card) => {
    dispatch({ type: 'removeCard', id: card.id });
    if (card.photoId) deletePhoto(card.photoId);
  };

  const reset = async () => {
    await clearPhotos();
    const fresh = createDefaultBoard();
    dispatch({ type: 'replace', board: fresh });
    setActiveId(fresh.categories[0].id);
    setEditing(false);
  };

  const cards = board.cards.filter((c) => c.categoryId === activeId);

  return (
    <div className={`app size-${board.settings.cardSize}${editing ? ' editing' : ''}`}>
      <header className="top">
        <div className="brand">
          <h1>Lyra</h1>
          <HoldButton label="Caregiver settings, press and hold to open" onHold={() => setCaregiverOpen(true)}>
            <span aria-hidden="true">⚙️</span>
            <span className="hold-hint">Hold</span>
          </HoldButton>
        </div>
        <SentenceBar
          words={sentence}
          onSpeak={() => speak(sentence.join(' '), board.settings)}
          onBack={() => dispatchSentence({ type: 'pop' })}
          onClear={() => dispatchSentence({ type: 'clear' })}
        />
      </header>

      <div className="body">
        <CategoryRail categories={board.categories} activeId={activeId} onSelect={setActiveId} />
        <main className="main">
          <CoreStrip onTap={tap} />
          {editing && (
            <div className="edit-banner" role="status">
              Editing the board.
              <button type="button" className="btn" onClick={() => setEditing(false)}>
                Finish editing
              </button>
            </div>
          )}
          <CardGrid
            cards={cards}
            editing={editing}
            onTap={(card) => tap(card.label)}
            onRemove={removeCard}
            onMove={(card, delta) => dispatch({ type: 'moveCard', id: card.id, delta })}
          />
        </main>
        <aside className="side">
          <Routines
            routines={board.routines}
            onPick={(r) => {
              dispatchSentence({ type: 'set', words: r.words });
              speak(r.words.join(' '), board.settings);
            }}
          />
        </aside>
      </div>

      <CaregiverPanel
        open={caregiverOpen}
        onClose={() => setCaregiverOpen(false)}
        board={board}
        dispatch={dispatch}
        activeCategoryId={activeId}
        sentence={sentence}
        editing={editing}
        onEditingChange={setEditing}
        onReset={reset}
      />
    </div>
  );
}
