import { Fragment } from "react";
import { Card } from "../Card";
import { ExerciseName } from "../ExerciseName";
import { CountRow } from "../CountRow";
import type { StappersEntry } from "../../program/types";

interface StappersCardProps {
  entry: StappersEntry;
  exercises: string[];
  onChange: (patch: Partial<StappersEntry>) => void;
}

export function StappersCard({ entry, exercises, onChange }: StappersCardProps) {
  return (
    <Card
      title={exercises.map((name, i) => (
        <Fragment key={name}>
          {i > 0 && " · "}
          <ExerciseName name={name} />
        </Fragment>
      ))}
    >
      <CountRow label="Rounds in 20 min" value={entry.rounds} onChange={(rounds) => onChange({ rounds })} />
    </Card>
  );
}
