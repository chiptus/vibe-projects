import { Card } from "../Card";
import { ExerciseNameList } from "../exercise/ExerciseNameList";
import { CountRow } from "../CountRow";
import type { StappersEntry } from "../../program/types";

interface StappersCardProps {
  entry: StappersEntry;
  exercises: string[];
  onChange: (patch: Partial<StappersEntry>) => void;
}

export function StappersCard({ entry, exercises, onChange }: StappersCardProps) {
  return (
    <Card title={<ExerciseNameList names={exercises} />}>
      <CountRow label="Rounds in 20 min" value={entry.rounds} onChange={(rounds) => onChange({ rounds })} />
    </Card>
  );
}
