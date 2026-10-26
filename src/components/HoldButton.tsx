import { useRef, useState, type ReactNode } from 'react';

interface Props {
  onHold: () => void;
  holdMs?: number;
  children: ReactNode;
  className?: string;
  label: string;
}

/**
 * A button that only fires after being held, so a child exploring the board
 * doesn't wander into caregiver settings. Works with touch, mouse and keyboard.
 */
export function HoldButton({ onHold, holdMs = 1500, children, className = '', label }: Props) {
  const timer = useRef<number>(undefined);
  const [holding, setHolding] = useState(false);

  const start = () => {
    if (timer.current !== undefined) return;
    setHolding(true);
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      setHolding(false);
      onHold();
    }, holdMs);
  };
  const cancel = () => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    setHolding(false);
  };

  return (
    <button
      type="button"
      className={`hold ${holding ? 'holding' : ''} ${className}`}
      style={{ ['--hold-ms' as string]: `${holdMs}ms` }}
      aria-label={label}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start();
      }}
      onKeyUp={cancel}
    >
      {children}
    </button>
  );
}
