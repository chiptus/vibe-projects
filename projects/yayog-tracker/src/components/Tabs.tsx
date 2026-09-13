interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: [T, string][];
}

export function Tabs<T extends string>({ value, onChange, items }: TabsProps<T>) {
  return (
    <div className="yg-tabs">
      {items.map(([id, label]) => (
        <button key={id} className={`yg-tab ${value === id ? "on" : ""}`} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}
