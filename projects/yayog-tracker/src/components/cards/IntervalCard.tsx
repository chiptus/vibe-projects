import { Card } from "../Card";
import { CountRow } from "../CountRow";
import type { IntervalEntry } from "../../program/types";

interface IntervalCardProps {
  entry: IntervalEntry;
  onChange: (patch: Partial<IntervalEntry>) => void;
}

export function IntervalCard({ entry, onChange }: IntervalCardProps) {
  const setAt = (k: number, v: number) =>
    onChange({ sets: entry.sets.map((x, j) => (j === k ? v : x)) as IntervalEntry["sets"] });
  return (
    <Card title={entry.name}>
      {entry.sets.map((s, k) => (
        <CountRow key={k} label={`Set ${k + 1}`} value={s} onChange={(v) => setAt(k, v)} />
      ))}
    </Card>
  );
}
