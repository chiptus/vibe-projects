interface SaveBarProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function SaveBar({ label, disabled, onClick }: SaveBarProps) {
  return (
    <div className="yg-bar">
      <div>
        <button className="yg-btn" onClick={onClick} disabled={disabled}>
          {label}
        </button>
      </div>
    </div>
  );
}
