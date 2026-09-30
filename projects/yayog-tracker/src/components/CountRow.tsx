import { Stepper } from "./Stepper";

interface CountRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function CountRow({ label, value, onChange }: CountRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 [&+&]:mt-1.5">
      <span className="text-sm text-mu">{label}</span>
      <Stepper value={value} onChange={onChange} />
    </div>
  );
}
