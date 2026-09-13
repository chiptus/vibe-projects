interface StepperProps {
  value: number;
  onChange: (value: number) => void;
}

export function Stepper({ value, onChange }: StepperProps) {
  const set = (v: number) => onChange(Math.max(0, Math.min(999, Number.isFinite(v) ? v : 0)));
  return (
    <div className="yg-step">
      <button type="button" aria-label="minus" onClick={() => set(value - 1)}>
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => set(parseInt(e.target.value || "0", 10))}
      />
      <button type="button" aria-label="plus" onClick={() => set(value + 1)}>
        +
      </button>
    </div>
  );
}
