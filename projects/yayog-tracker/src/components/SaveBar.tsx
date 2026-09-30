import { Button } from "./ui/Button";

interface SaveBarProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function SaveBar({ label, disabled, onClick }: SaveBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-linear-to-b from-transparent to-bg to-30% px-3.5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+--spacing(2.5))]">
      <div className="mx-auto flex max-w-lg gap-2">
        <Button className="flex-1" onClick={onClick} disabled={disabled}>
          {label}
        </Button>
      </div>
    </div>
  );
}
