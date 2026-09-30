import type { ComponentProps } from "react";
import { cx } from "./cx";

type Tone = "light" | "accent";

const SELECTED: Record<Tone, string> = {
  light: "border-tx bg-tx text-bg",
  accent: "border-ac bg-ac text-bg",
};

interface ToggleButtonProps extends ComponentProps<"button"> {
  selected: boolean;
  tone?: Tone;
}

// One option of a row of mutually exclusive buttons (tabs, day picker).
export function ToggleButton({ selected, tone = "light", className, ...props }: ToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "flex-1 cursor-pointer rounded-md border font-semibold",
        selected ? SELECTED[tone] : "border-ln text-mu",
        className,
      )}
      {...props}
    />
  );
}
