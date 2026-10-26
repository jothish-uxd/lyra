import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Board, Settings } from '../types';
import type { BoardAction } from '../state/board';
import { newId } from '../state/board';
import { resizeImage, savePhoto } from '../lib/storage';
import { speak, speechSupported, useVoices } from '../lib/speech';

interface Props {
  open: boolean;
  onClose: () => void;
  board: Board;
  dispatch: (action: BoardAction) => void;
  activeCategoryId: string;
  sentence: string[];
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onReset: () => void;
}

export function CaregiverPanel(props: Props) {
  const { open, onClose, board, dispatch, editing, onEditingChange } = props;
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const setSettings = (settings: Partial<Settings>) => dispatch({ type: 'updateSettings', settings });

  return (
    <dialog ref={dialog} className="caregiver" onClose={onClose} aria-labelledby="caregiver-heading">
      <header className="caregiver-head">
        <h2 id="caregiver-heading">Caregiver settings</h2>
        <button type="button" className="btn" onClick={onClose}>
          Done
        </button>
      </header>

      <section className="panel">
        <label className="toggle">
          <span>
            <strong>Edit board</strong>
            <span className="hint">Reorder or remove cards right on the board.</span>
          </span>
          <input type="checkbox" checked={editing} onChange={(e) => onEditingChange(e.target.checked)} />
        </label>
      </section>

      <AddCardForm board={board} dispatch={dispatch} defaultCategoryId={props.activeCategoryId} />

      <section className="panel">
        <h3>Quick phrases</h3>
        <p className="hint">Build a sentence on the board, then save it here.</p>
        <button
          type="button"
          className="btn primary wide"
          disabled={props.sentence.length === 0}
          onClick={() => dispatch({ type: 'addRoutine', id: newId('r'), words: props.sentence })}
        >
          Save “{props.sentence.join(' ') || '…'}”
        </button>
        <ul className="phrase-list">
          {board.routines.map((r) => (
            <li key={r.id}>
              <span>{r.words.join(' ')}</span>
              <button type="button" className="mini" onClick={() => dispatch({ type: 'removeRoutine', id: r.id })} aria-label={`Remove phrase ${r.words.join(' ')}`}>
                🗑
              </button>
            </li>
          ))}
        </ul>
      </section>

      <VoiceSettings settings={board.settings} onChange={setSettings} />

      <section className="panel">
        <h3>Display</h3>
        <label>
          Card size
          <select value={board.settings.cardSize} onChange={(e) => setSettings({ cardSize: e.target.value as Settings['cardSize'] })}>
            <option value="small">Small (more cards)</option>
            <option value="medium">Medium</option>
            <option value="large">Large (easier to tap)</option>
          </select>
        </label>
      </section>

      <section className="panel">
        <h3>Reset</h3>
        <p className="hint">Puts back the starter board. Added cards, photos and phrases are removed.</p>
        <ResetButton onReset={props.onReset} />
      </section>

      <p className="hint privacy">Everything is saved on this device only. Nothing is uploaded.</p>
    </dialog>
  );
}

function AddCardForm({ board, dispatch, defaultCategoryId }: { board: Board; dispatch: Props['dispatch']; defaultCategoryId: string }) {
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => setCategoryId(defaultCategoryId), [defaultCategoryId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    const id = newId('card');
    let photoId: string | undefined;
    try {
      if (file) {
        photoId = newId('photo');
        await savePhoto(photoId, await resizeImage(file));
      }
    } catch {
      setStatus('That photo could not be read. Try another one.');
      return;
    }
    dispatch({ type: 'addCard', card: { id, label: trimmed, emoji: emoji.trim() || '🟦', categoryId, photoId } });
    setStatus(`Added “${trimmed}”.`);
    setLabel('');
    setEmoji('');
    setFile(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h3>Add a card</h3>
      <p className="hint">Familiar photos work best: people, favourite foods, toys, rooms.</p>
      <label>
        Word to say
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Grandma" required maxLength={40} />
      </label>
      <label>
        Category
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {board.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Photo (optional)
        <input ref={fileInput} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <label>
        Emoji if no photo (optional)
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🧸" maxLength={8} />
      </label>
      <button type="submit" className="btn primary wide">
        Add card
      </button>
      <p className="hint" role="status">
        {status}
      </p>
    </form>
  );
}

function VoiceSettings({ settings, onChange }: { settings: Settings; onChange: (s: Partial<Settings>) => void }) {
  const voices = useVoices();
  if (!speechSupported) {
    return (
      <section className="panel">
        <h3>Voice</h3>
        <p className="hint">This browser can't speak aloud. Try Chrome, Edge or Safari.</p>
      </section>
    );
  }
  return (
    <section className="panel">
      <h3>Voice</h3>
      <label>
        Voice
        <select value={settings.voiceURI ?? ''} onChange={(e) => onChange({ voiceURI: e.target.value || null })}>
          <option value="">Device default</option>
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </label>
      <label>
        Speed: {settings.rate.toFixed(2)}
        <input type="range" min={0.5} max={1.5} step={0.05} value={settings.rate} onChange={(e) => onChange({ rate: Number(e.target.value) })} />
      </label>
      <label>
        Pitch: {settings.pitch.toFixed(2)}
        <input type="range" min={0.5} max={2} step={0.05} value={settings.pitch} onChange={(e) => onChange({ pitch: Number(e.target.value) })} />
      </label>
      <label className="toggle">
        <span>
          <strong>Say each word when tapped</strong>
        </span>
        <input type="checkbox" checked={settings.speakOnTap} onChange={(e) => onChange({ speakOnTap: e.target.checked })} />
      </label>
      <button type="button" className="btn wide" onClick={() => speak('Hi, I am Lyra.', settings)}>
        Test voice
      </button>
    </section>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <button
      type="button"
      className="btn danger wide"
      onClick={() => {
        if (!confirming) return setConfirming(true);
        setConfirming(false);
        onReset();
      }}
      onBlur={() => setConfirming(false)}
    >
      {confirming ? 'Tap again to reset everything' : 'Reset board'}
    </button>
  );
}
