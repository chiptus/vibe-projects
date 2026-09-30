import type { Position, Program } from "../program/types";
import { cx } from "./ui/cx";
import { ToggleButton } from "./ui/ToggleButton";

interface DayPickerProps {
  value: Position;
  program: Program;
  daysInWeek: Position[];
  isDone: (p: Position) => boolean;
  onChange: (p: Position) => void;
}

export function DayPicker({ value, program, daysInWeek, isDone, onChange }: DayPickerProps) {
  return (
    <div className="mt-3.5 flex gap-1.5">
      {daysInWeek.map((p) => {
        const on = p.d === value.d;
        const done = isDone(p);
        return (
          <ToggleButton
            key={p.d}
            selected={on}
            tone="accent"
            className={cx("min-w-0 pt-2 pb-1.5 text-base leading-tight font-bold", !on && done && "border-ac2 text-tx")}
            onClick={() => onChange(p)}
          >
            Day {p.d}
            <small
              className={cx(
                "mt-0.5 block truncate px-1 text-xs font-medium",
                on ? "text-bg" : done && "text-ac",
              )}
            >
              {program.weeks[p.w]![p.d]!.focus}
            </small>
          </ToggleButton>
        );
      })}
    </div>
  );
}
