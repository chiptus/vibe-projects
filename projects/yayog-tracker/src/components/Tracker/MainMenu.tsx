import { useEffect, useRef, useState, type ReactNode } from "react";
import { LEVEL_LABEL } from "../../program/registry";
import { LEVELS, type Level } from "../../program/types";
import { cx } from "../ui/cx";

export type View = "today" | "history" | "test";

interface MainMenuProps {
  level: Level;
  view: View;
  historyLabel: string;
  onLevel: (level: Level) => void;
  onView: (view: View) => void;
}

// One place for everything that is not "which workout": the Program (Level)
// and the Workout / History / Test views.
export function MainMenu({ level, view, historyLabel, onLevel, onView }: MainMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        className="grid size-11 cursor-pointer place-items-center rounded-md border border-ln bg-sf text-tx"
        onClick={() => setOpen(!open)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-64 rounded-lg border border-ln bg-sf p-2 shadow-xl shadow-black/40">
          <Section title="Program">
            {LEVELS.map((l) => (
              <Item key={l} selected={l === level} onClick={choose(() => onLevel(l))}>
                {LEVEL_LABEL[l]}
              </Item>
            ))}
          </Section>
          <Section title="View" divided>
            <Item selected={view === "today"} onClick={choose(() => onView("today"))}>
              Workout
            </Item>
            <Item selected={view === "history"} onClick={choose(() => onView("history"))}>
              {historyLabel}
            </Item>
            <Item selected={view === "test"} onClick={choose(() => onView("test"))}>
              Level test
            </Item>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, divided, children }: { title: string; divided?: boolean; children: ReactNode }) {
  return (
    <div className={cx(divided && "mt-2 border-t border-ln pt-2")}>
      <div className="px-3 pt-1 pb-1 text-xs font-semibold tracking-wider text-mu uppercase">{title}</div>
      {children}
    </div>
  );
}

function Item({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-current={selected || undefined}
      className={cx(
        "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-left text-base",
        selected ? "bg-sf2 font-semibold text-tx" : "text-mu active:bg-sf2",
      )}
      onClick={onClick}
    >
      {children}
      {selected && <span className="text-ac">✓</span>}
    </button>
  );
}
