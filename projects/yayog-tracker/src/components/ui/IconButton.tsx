import type { ComponentProps } from "react";
import { cx } from "./cx";

type Size = "sm" | "lg";

const SIZE: Record<Size, string> = {
  sm: "size-9 text-2xl leading-none",
  lg: "size-11 text-2xl font-semibold",
};

interface IconButtonProps extends ComponentProps<"button"> {
  size?: Size;
}

export function IconButton({ size = "sm", className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cx("shrink-0 cursor-pointer rounded-md bg-sf2 text-tx active:bg-ln", SIZE[size], className)}
      {...props}
    />
  );
}
