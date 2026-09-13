import { Stepper } from "./Stepper";

interface CountRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function CountRow({ label, value, onChange }: CountRowProps) {
  return (
    <div className="yg-row">
      <span className="yg-lab">{label}</span>
      <Stepper value={value} onChange={onChange} />
    </div>
  );
}
