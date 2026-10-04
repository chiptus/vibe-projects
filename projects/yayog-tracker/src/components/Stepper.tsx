import { IconButton } from "./ui/IconButton";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
}

export function Stepper({ value, onChange }: StepperProps) {
  const set = (v: number) => onChange(Math.max(0, Math.min(999, Number.isFinite(v) ? v : 0)));
  return (
    <div className="flex items-center gap-0.5">
      <IconButton size="lg" aria-label="minus" onClick={() => set(value - 1)}>
        −
      </IconButton>
      <input
        type="number"
        inputMode="numeric"
        className="h-11 w-16 border-b-2 border-ln bg-transparent text-center text-3xl font-extrabold text-ac focus:border-ac focus:outline-none"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => set(parseInt(e.target.value || "0", 10))}
      />
      <IconButton size="lg" aria-label="plus" onClick={() => set(value + 1)}>
        +
      </IconButton>
    </div>
  );
}
