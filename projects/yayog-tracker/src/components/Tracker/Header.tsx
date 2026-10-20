import type { ReactNode } from "react";
import type { Day, Position, Program } from "../../program/types";
import { DayPicker } from "./DayPicker";
import { HeaderSubtitle, HeaderTitle } from "./HeaderTitle";
import { WeekSelect } from "./WeekSelect";

interface HeaderProps {
  pos: Position;
  day: Day;
  program: Program;
  seq: Position[];
  isDone: (p: Position) => boolean;
  onPick: (p: Position) => void;
  menu: ReactNode;
}

export function Header({ pos, day, program, seq, isDone, onPick, menu }: HeaderProps) {
  const daysInWeek = seq.filter((p) => p.w === pos.w);
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <HeaderTitle pos={pos} program={program} />
        <div className="flex items-center gap-2">
          <WeekSelect week={pos.w} seq={seq} isDone={isDone} onPick={(w) => onPick({ w, d: 1 })} />
          {menu}
        </div>
      </div>
      <HeaderSubtitle pos={pos} day={day} />
      <DayPicker value={pos} program={program} daysInWeek={daysInWeek} isDone={isDone} onChange={onPick} />
    </>
  );
}
