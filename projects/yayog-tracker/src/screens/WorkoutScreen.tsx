import { Textarea } from "../components/ui/Textarea";
import { getCard } from "../components/cards";
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
  const CardComp = getCard(day.type);
  const exercises = "exercises" in day ? day.exercises : [];
  return (
    <>
      <p className="mb-4 border-l-3 border-ac py-0.5 pl-2.5 text-sm leading-snug text-mu">
        <b className="text-tx">{TYPE_LABEL[day.type]}.</b> {RULES[day.type]}
      </p>
      {loggedOn && <p className="-mt-2 mb-3.5 text-xs text-mu">Logged on {loggedOn} — saving again overwrites it.</p>}
      {form.entries.map((entry, i) => (
        <CardComp key={i} entry={entry} exercises={exercises} onChange={(patch) => onEntry(i, patch)} />
      ))}
      <Textarea
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => onNotes(e.target.value)}
      />
    </>
  );
}
