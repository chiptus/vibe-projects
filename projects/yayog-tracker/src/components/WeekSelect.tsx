import type { Position } from "../program/types";

interface WeekSelectProps {
  week: number;
  seq: Position[];
  isDone: (p: Position) => boolean;
  onPick: (w: number) => void;
}

export function WeekSelect({ week, seq, isDone, onPick }: WeekSelectProps) {
  return (
    <select className="rounded-md border border-ln bg-sf px-2.5 py-2 text-base text-tx" value={week} onChange={(e) => onPick(Number(e.target.value))}>
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
  );
}
