import type { Day, Position, Program } from "../program/types";
import { DayPicker } from "./DayPicker";
import { HeaderTitle } from "./HeaderTitle";
import { WeekSelect } from "./WeekSelect";

interface HeaderProps {
  pos: Position;
  day: Day;
  program: Program;
  seq: Position[];
  isDone: (p: Position) => boolean;
  onPick: (p: Position) => void;
}

export function Header({ pos, day, program, seq, isDone, onPick }: HeaderProps) {
  const daysInWeek = seq.filter((p) => p.w === pos.w);
  return (
    <>
      <div className="yg-top">
        <HeaderTitle pos={pos} day={day} program={program} />
        <WeekSelect week={pos.w} seq={seq} isDone={isDone} onPick={(w) => onPick({ w, d: 1 })} />
      </div>
      <DayPicker value={pos} program={program} daysInWeek={daysInWeek} isDone={isDone} onChange={onPick} />
    </>
  );
}
