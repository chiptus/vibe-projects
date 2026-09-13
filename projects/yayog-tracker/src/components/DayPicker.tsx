import type { Position, Program } from "../program/types";

interface DayPickerProps {
  pos: Position;
  program: Program;
  daysInWeek: Position[];
  isDone: (p: Position) => boolean;
  onPick: (p: Position) => void;
}

export function DayPicker({ pos, program, daysInWeek, isDone, onPick }: DayPickerProps) {
  return (
    <div className="yg-days">
      {daysInWeek.map((p) => (
        <button
          key={p.d}
          className={`yg-day ${p.d === pos.d ? "on" : ""} ${isDone(p) ? "done" : ""}`}
          onClick={() => onPick(p)}
        >
          Day {p.d}
          <small>{program.weeks[p.w]![p.d]!.focus}</small>
        </button>
      ))}
    </div>
  );
}
