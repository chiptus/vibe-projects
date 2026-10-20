import { LEVEL_LABEL } from "../../program/registry";
import { LEVELS, type Level } from "../../program/types";
import { ToggleButton } from "../ui/ToggleButton";

interface LevelPickerProps {
  value: Level;
  onChange: (level: Level) => void;
}

// Two by two on a phone so the longer names stay readable; one row from sm up.
export function LevelPicker({ value, onChange }: LevelPickerProps) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {LEVELS.map((l) => (
        <ToggleButton key={l} selected={value === l} className="py-2 text-sm" onClick={() => onChange(l)}>
          {LEVEL_LABEL[l]}
        </ToggleButton>
      ))}
    </div>
  );
}
