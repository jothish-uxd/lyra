interface Props {
  words: string[];
  onSpeak: () => void;
  onBack: () => void;
  onClear: () => void;
}

export function SentenceBar({ words, onSpeak, onBack, onClear }: Props) {
  const empty = words.length === 0;
  return (
    <div className="sentence">
      <button
        type="button"
        className="sentence-text"
        onClick={onSpeak}
        disabled={empty}
        aria-label={empty ? 'Sentence is empty' : `Speak: ${words.join(' ')}`}
      >
        <span aria-live="polite">{empty ? 'Tap pictures…' : words.join(' ')}</span>
      </button>
      <div className="sentence-actions">
        <button type="button" className="btn primary" onClick={onSpeak} disabled={empty}>
          <span aria-hidden="true">🔊</span> Speak
        </button>
        <button type="button" className="btn" onClick={onBack} disabled={empty}>
          <span aria-hidden="true">⌫</span> Back
        </button>
        <button type="button" className="btn danger" onClick={onClear} disabled={empty}>
          <span aria-hidden="true">✖</span> Clear
        </button>
      </div>
    </div>
  );
}
