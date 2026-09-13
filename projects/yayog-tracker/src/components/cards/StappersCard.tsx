import { Card } from "../Card";
import { CountRow } from "../CountRow";
import type { StappersEntry } from "../../program/types";

interface StappersCardProps {
  entry: StappersEntry;
  exercises: string[];
  onChange: (patch: Partial<StappersEntry>) => void;
}

export function StappersCard({ entry, exercises, onChange }: StappersCardProps) {
  return (
    <Card title={exercises.join(" · ")}>
      <CountRow label="Rounds in 20 min" value={entry.rounds} onChange={(rounds) => onChange({ rounds })} />
    </Card>
  );
}
