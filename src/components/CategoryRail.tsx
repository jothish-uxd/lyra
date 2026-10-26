import type { Category } from '../types';

interface Props {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function CategoryRail({ categories, activeId, onSelect }: Props) {
  return (
    <nav className="rail" aria-label="Categories">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`rail-btn${c.id === activeId ? ' active' : ''}`}
          aria-pressed={c.id === activeId}
          onClick={() => onSelect(c.id)}
        >
          <span className="rail-icon" aria-hidden="true">{c.icon}</span>
          <span>{c.name}</span>
        </button>
      ))}
    </nav>
  );
}
