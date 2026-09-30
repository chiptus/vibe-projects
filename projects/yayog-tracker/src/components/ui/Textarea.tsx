import type { ComponentProps } from "react";
import { cx } from "./cx";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cx("mt-1.5 min-h-11 w-full resize-y rounded-lg border border-ln bg-sf p-2.5 text-base text-tx", className)}
      {...props}
    />
  );
}
