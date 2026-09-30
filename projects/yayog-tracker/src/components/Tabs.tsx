import { ToggleButton } from "./ui/ToggleButton";

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: [T, string][];
}

export function Tabs<T extends string>({ value, onChange, items }: TabsProps<T>) {
  return (
    <div className="mt-4 mb-3.5 flex gap-1.5">
      {items.map(([id, label]) => (
        <ToggleButton key={id} selected={value === id} className="py-2.5 text-base" onClick={() => onChange(id)}>
          {label}
        </ToggleButton>
      ))}
    </div>
  );
}
