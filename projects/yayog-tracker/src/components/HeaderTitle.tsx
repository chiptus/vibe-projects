import { BLOCK_NAME } from "../program/basic";
import type { Day, Position, Program } from "../program/types";

interface HeaderTitleProps {
  pos: Position;
  day: Day;
  program: Program;
}

export function HeaderTitle({ pos, day, program }: HeaderTitleProps) {
  return (
    <h1 className="text-3xl leading-none font-extrabold tracking-tight">
      Week {pos.w}, Day {pos.d}
      <small className="mt-1.5 block text-sm font-medium tracking-wide text-mu">
        {program.name} · {BLOCK_NAME(pos.w)} block · {day.focus}
      </small>
    </h1>
  );
}
