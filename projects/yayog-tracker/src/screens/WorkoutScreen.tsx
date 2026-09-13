import { CARD_FOR } from "../components/cards";
import { RULES, TYPE_LABEL } from "../program/basic";
import type { Day, Entry } from "../program/types";

interface WorkoutScreenProps {
  day: Day;
  form: { entries: Entry[]; notes: string };
  loggedOn: string | undefined;
  onEntry: (i: number, patch: Partial<Entry>) => void;
  onNotes: (notes: string) => void;
}

export function WorkoutScreen({ day, form, loggedOn, onEntry, onNotes }: WorkoutScreenProps) {
  const CardComp = CARD_FOR[day.type];
  const exercises = "exercises" in day ? day.exercises : [];
  return (
    <>
      <p className="yg-rules">
        <b style={{ color: "var(--tx)" }}>{TYPE_LABEL[day.type]}.</b> {RULES[day.type]}
      </p>
      {loggedOn && <p className="yg-small">Logged on {loggedOn} — saving again overwrites it.</p>}
      {form.entries.map((entry, i) => (
        <CardComp key={i} entry={entry} exercises={exercises} onChange={(patch) => onEntry(i, patch)} />
      ))}
      <textarea
        className="yg-note"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => onNotes(e.target.value)}
      />
    </>
  );
}
