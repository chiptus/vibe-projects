import { LEVEL_LABEL } from "../../program/registry";
import type { Level } from "../../program/types";
import { ToggleButton } from "../ui/ToggleButton";

interface LevelPickerProps {
  value: Level;
  levels: Level[];
  onChange: (level: Level) => void;
}

// Only unlocked Levels are listed; with one there is nothing to pick.
export function LevelPicker({ value, levels, onChange }: LevelPickerProps) {
  if (levels.length < 2) return null;
  return (
    <div className="mb-3 flex gap-1.5">
      {levels.map((l) => (
        <ToggleButton key={l} selected={value === l} className="py-1.5 text-sm" onClick={() => onChange(l)}>
          {LEVEL_LABEL[l]}
        </ToggleButton>
      ))}
    </div>
  );
}
