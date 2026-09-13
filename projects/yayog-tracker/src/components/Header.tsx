import { BLOCK_NAME } from "../program/basic";
import type { Day, Position, Program } from "../program/types";

interface HeaderProps {
  pos: Position;
  day: Day;
  program: Program;
  seq: Position[];
  isDone: (p: Position) => boolean;
  onPick: (p: Position) => void;
}

export function Header({ pos, day, program, seq, isDone, onPick }: HeaderProps) {
  const daysInWeek = seq.filter((p) => p.w === pos.w);
  return (
    <>
      <div className="yg-top">
        <h1 className="yg-h1">
          Week {pos.w}, Day {pos.d}
          <small>
            {program.name} · {BLOCK_NAME(pos.w)} block · {day.focus}
          </small>
        </h1>
        <select
          className="yg-sel"
          value={pos.w}
          onChange={(e) => onPick({ w: Number(e.target.value), d: 1 })}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((w) => {
            const ws = seq.filter((p) => p.w === w);
            const n = ws.filter(isDone).length;
            return (
              <option key={w} value={w}>
                Week {w}
                {n ? ` · ${n}/${ws.length}` : ""}
              </option>
            );
          })}
        </select>
      </div>
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
    </>
  );
}
