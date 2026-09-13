import { Card } from "../Card";
import { CountRow } from "../CountRow";
import type { LadderEntry } from "../../program/types";

interface LadderCardProps {
  entry: LadderEntry;
  onChange: (patch: Partial<LadderEntry>) => void;
}

export function LadderCard({ entry, onChange }: LadderCardProps) {
  return (
    <Card title={entry.name}>
      <CountRow label="Top of ladder" value={entry.top} onChange={(top) => onChange({ top })} />
    </Card>
  );
}
