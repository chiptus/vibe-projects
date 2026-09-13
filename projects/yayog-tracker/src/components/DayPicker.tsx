import type { Position, Program } from "../program/types";

interface DayPickerProps {
  value: Position;
  program: Program;
  daysInWeek: Position[];
  isDone: (p: Position) => boolean;
  onChange: (p: Position) => void;
}

export function DayPicker({ value, program, daysInWeek, isDone, onChange }: DayPickerProps) {
  return (
    <div className="yg-days">
      {daysInWeek.map((p) => (
        <button
          key={p.d}
          className={`yg-day ${p.d === value.d ? "on" : ""} ${isDone(p) ? "done" : ""}`}
          onClick={() => onChange(p)}
        >
          Day {p.d}
          <small>{program.weeks[p.w]![p.d]!.focus}</small>
        </button>
      ))}
    </div>
  );
}
