import { Card } from "../Card";
import { CountRow } from "../CountRow";
import type { SupersetEntry } from "../../program/types";

interface SupersetCardProps {
  entry: SupersetEntry;
  onChange: (patch: Partial<SupersetEntry>) => void;
}

export function SupersetCard({ entry, onChange }: SupersetCardProps) {
  const setAt = (k: number, side: 0 | 1, v: number) =>
    onChange({
      sets: entry.sets.map((pair, j) => (j === k ? (pair.map((x, s) => (s === side ? v : x)) as [number, number]) : pair)) as SupersetEntry["sets"],
    });
  return (
    <Card
      title={
        <>
          {entry.a} <span className="yg-sub">then</span> {entry.b}
        </>
      }
    >
      {entry.sets.map((pair, k) => (
        <div key={k}>
          <CountRow label={`Set ${k + 1} · first (1–5)`} value={pair[0]} onChange={(v) => setAt(k, 0, v)} />
          <CountRow label={`Set ${k + 1} · second (6–12)`} value={pair[1]} onChange={(v) => setAt(k, 1, v)} />
        </div>
      ))}
    </Card>
  );
}
