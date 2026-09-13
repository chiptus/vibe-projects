import { Card } from "../Card";
import { CountRow } from "../CountRow";
import type { TabataEntry } from "../../program/types";

interface TabataCardProps {
  entry: TabataEntry;
  onChange: (patch: Partial<TabataEntry>) => void;
}

export function TabataCard({ entry, onChange }: TabataCardProps) {
  return (
    <Card title={entry.name}>
      <CountRow label="Total reps (8 rounds)" value={entry.reps} onChange={(reps) => onChange({ reps })} />
    </Card>
  );
}
