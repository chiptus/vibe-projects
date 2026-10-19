import { CATEGORY_LABEL, formatMinimum, LEVEL_TESTS, type Category, type TestedLevel } from "../../program/levelTests";
import { Stepper } from "../Stepper";

interface ScoreRowProps {
  level: TestedLevel;
  category: Category;
  value: number;
  onChange: (value: number) => void;
}

export function ScoreRow({ level, category, value, onChange }: ScoreRowProps) {
  const m = LEVEL_TESTS[level][category];
  return (
    <div className="mb-3">
      <div className="text-base font-semibold">
        {CATEGORY_LABEL[category]}: {m.label}
      </div>
      <div className="mb-1 text-sm text-mu">
        {m.how} Minimum {formatMinimum(m)}.
      </div>
      <div className="flex items-center gap-2">
        <Stepper value={value} onChange={onChange} />
        <span className="text-sm text-mu">{m.unit === "seconds" ? "seconds" : m.unit === "side" ? "per side" : "reps"}</span>
      </div>
    </div>
  );
}
