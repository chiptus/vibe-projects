import { BLOCK_NAME } from "../program/basic";
import type { Day, Position, Program } from "../program/types";

interface HeaderTitleProps {
  pos: Position;
  day: Day;
  program: Program;
}

export function HeaderTitle({ pos, day, program }: HeaderTitleProps) {
  return (
    <h1 className="yg-h1">
      Week {pos.w}, Day {pos.d}
      <small>
        {program.name} · {BLOCK_NAME(pos.w)} block · {day.focus}
      </small>
    </h1>
  );
}
