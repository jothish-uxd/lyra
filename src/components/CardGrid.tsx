import { useState } from 'react';
import type { Card } from '../types';
import { usePhotoUrl } from '../lib/usePhotoUrl';

interface Props {
  cards: Card[];
  editing: boolean;
  onTap: (card: Card) => void;
  onRemove: (card: Card) => void;
  onMove: (card: Card, delta: -1 | 1) => void;
}

export function CardGrid({ cards, editing, onTap, onRemove, onMove }: Props) {
  if (cards.length === 0) {
    return <p className="empty">No cards here yet. A caregiver can add some.</p>;
  }
  return (
    <ul className="grid" aria-label="Cards">
      {cards.map((card, i) => (
        <li key={card.id} className="grid-item">
          <CardTile card={card} onTap={() => onTap(card)} />
          {editing && (
            <CardEditBar
              card={card}
              isFirst={i === 0}
              isLast={i === cards.length - 1}
              onRemove={() => onRemove(card)}
              onMove={(d) => onMove(card, d)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function CardTile({ card, onTap }: { card: Card; onTap: () => void }) {
  const photoUrl = usePhotoUrl(card.photoId);
  return (
    <button type="button" className="card" onClick={onTap}>
      <span className="pic" aria-hidden="true">
        {photoUrl ? <img src={photoUrl} alt="" /> : card.emoji}
      </span>
      <span className="card-label">{card.label}</span>
    </button>
  );
}

interface EditBarProps {
  card: Card;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  onMove: (delta: -1 | 1) => void;
}

function CardEditBar({ card, isFirst, isLast, onRemove, onMove }: EditBarProps) {
  // Removing takes two taps so a stray touch can't delete a card.
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="edit-bar">
      <button type="button" className="mini" onClick={() => onMove(-1)} disabled={isFirst} aria-label={`Move ${card.label} earlier`}>
        ◀
      </button>
      <button
        type="button"
        className={`mini${confirming ? ' danger' : ''}`}
        onClick={() => (confirming ? onRemove() : setConfirming(true))}
        onBlur={() => setConfirming(false)}
        aria-label={confirming ? `Tap again to remove ${card.label}` : `Remove ${card.label}`}
      >
        {confirming ? 'Sure?' : '🗑'}
      </button>
      <button type="button" className="mini" onClick={() => onMove(1)} disabled={isLast} aria-label={`Move ${card.label} later`}>
        ▶
      </button>
    </div>
  );
}
