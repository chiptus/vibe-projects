import type { ComponentProps } from "react";
import { cx } from "./cx";

type Variant = "primary" | "outline";

const VARIANT: Record<Variant, string> = {
  primary: "h-13 rounded-lg bg-ac text-lg font-bold text-bg",
  outline: "rounded-md border border-ln px-3.5 py-2.5 text-sm text-mu",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button type="button" className={cx("cursor-pointer disabled:opacity-50", VARIANT[variant], className)} {...props} />;
}
