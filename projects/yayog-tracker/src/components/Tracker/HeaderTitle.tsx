import { BLOCK_NAME } from "../../program/basic";
import type { Day, Position, Program } from "../../program/types";

export function HeaderTitle({ pos }: { pos: Position }) {
  return (
    <h1 className="text-3xl leading-none font-extrabold tracking-tight">
      Week {pos.w}, Day {pos.d}
    </h1>
  );
}

interface HeaderSubtitleProps {
  pos: Position;
  day: Day;
  program: Program;
}

export function HeaderSubtitle({ pos, day, program }: HeaderSubtitleProps) {
  return (
    <p className="mt-2 text-sm font-medium tracking-wide text-mu">
      {program.name} · {BLOCK_NAME(pos.w)} block · {day.focus}
    </p>
  );
}
