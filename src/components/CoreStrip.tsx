import { CORE_WORDS } from '../data/defaults';

export function CoreStrip({ onTap }: { onTap: (word: string) => void }) {
  return (
    <section className="core-strip" aria-label="Core words">
      {CORE_WORDS.map((w) => (
        <button key={w.label} type="button" className="core" onClick={() => onTap(w.label)}>
          <span className="core-icon" aria-hidden="true">{w.emoji}</span>
          <span className="core-label">{w.label}</span>
        </button>
      ))}
    </section>
  );
}
