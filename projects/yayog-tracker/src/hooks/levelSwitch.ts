import { blankEntries } from "../program/basic";
import { LEVEL_LABEL } from "../program/registry";
import type { Day, Entry, Level } from "../program/types";

interface Form {
  entries: Entry[];
  notes: string;
}

// Switching Level is always the user's choice; ask first only when the
// current workout has unsaved entries that the switch would discard.
// The returned function says whether the switch went ahead.
export function levelSwitch(level: Level, day: Day, form: Form, onLevel: (l: Level) => void) {
  const hasEntries = form.notes !== "" || JSON.stringify(form.entries) !== JSON.stringify(blankEntries(day));
  return (next: Level): boolean => {
    if (next === level) return false;
    if (hasEntries && !window.confirm(`Switch to ${LEVEL_LABEL[next]}? Unsaved entries for this workout will be lost.`)) return false;
    onLevel(next);
    return true;
  };
}
