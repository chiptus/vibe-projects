import { BLOCK_NAME } from "../../program/basic";
import type { Day, Position, Program } from "../../program/types";

export function HeaderTitle({ pos, program }: { pos: Position; program: Program }) {
  return (
    <h1 className="text-3xl leading-none font-extrabold tracking-tight">
      {program.name}, Week {pos.w}, Day {pos.d}
    </h1>
  );
}

interface HeaderSubtitleProps {
  pos: Position;
  day: Day;
}

export function HeaderSubtitle({ pos, day }: HeaderSubtitleProps) {
  return (
    <p className="mt-2 text-sm font-medium tracking-wide text-mu">
      {BLOCK_NAME(pos.w)} block · {day.focus}
    </p>
  );
}
