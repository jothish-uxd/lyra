import type { Routine } from '../types';

export function Routines({ routines, onPick }: { routines: Routine[]; onPick: (r: Routine) => void }) {
  return (
    <section className="routines" aria-labelledby="routines-heading">
      <h2 id="routines-heading">Quick phrases</h2>
      {routines.length === 0 && <p className="hint">None yet.</p>}
      {routines.map((r) => (
        <button key={r.id} type="button" className="btn routine" onClick={() => onPick(r)}>
          {r.words.join(' ')}
        </button>
      ))}
    </section>
  );
}
