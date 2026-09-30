import { Button } from "../components/ui/Button";
import { DataPanel } from "../components/DataPanel";
import { metrics, TYPE_LABEL } from "../program/basic";
import { cx } from "../components/ui/cx";
import type { Day, Position, WorkoutRecord } from "../program/types";
import type { useTracker } from "../hooks/useTracker";

interface ProgressStripProps {
  seq: Position[];
  isDone: (p: Position) => boolean;
  current: Position;
}

function ProgressStrip({ seq, isDone, current }: ProgressStripProps) {
  return (
    <div className="mb-4 grid grid-cols-10 gap-1">
      {seq.map((p) => (
        <div
          key={`${p.w}-${p.d}`}
          className={cx(
            "h-2 rounded-xs",
            p.w === current.w && p.d === current.d ? "bg-tx" : isDone(p) ? "bg-ac" : "bg-sf2",
          )}
          title={`W${p.w} D${p.d}`}
        />
      ))}
    </div>
  );
}

interface HistoryEntryProps {
  rec: WorkoutRecord;
  day: Day;
  onOpen: () => void;
}

function HistoryEntry({ rec, day, onOpen }: HistoryEntryProps) {
  return (
    <div className="border-t border-ln py-3" onClick={onOpen}>
      <h3 className="flex justify-between text-lg font-bold">
        W{rec.w} D{rec.d} · {TYPE_LABEL[day.type]}
        <span className="text-sm font-medium text-mu">{rec.date}</span>
      </h3>
      <ul className="mt-2 text-base">
        {metrics(day, rec.entries).map((m, i) => (
          <li key={i} className="flex justify-between gap-2.5 py-0.5 text-mu">
            <span>{m.name}</span>
            <b className="font-extrabold whitespace-nowrap text-ac">
              {m.value} <span className="font-medium text-mu">{m.unit}</span>
            </b>
          </li>
        ))}
      </ul>
      {rec.notes && <p className="mt-1.5 text-xs text-mu">{rec.notes}</p>}
    </div>
  );
}

interface HistoryScreenProps {
  t: ReturnType<typeof useTracker>;
  onOpen: (p: Position) => void;
  onReset: () => void;
}

export function HistoryScreen({ t, onOpen, onReset }: HistoryScreenProps) {
  if (!t.pos) return null;
  return (
    <>
      <ProgressStrip seq={t.seq} isDone={t.isDone} current={t.pos} />
      {t.done.length === 0 && <p className="py-6 text-center text-base text-mu">Nothing logged yet. Do a workout and save it.</p>}
      {[...t.done].reverse().map((k) => {
        const r = t.logs[k];
        return r ? <HistoryEntry key={k} rec={r} day={t.dayAt(r)} onOpen={() => onOpen(r)} /> : null;
      })}
      <DataPanel t={t} />
      {t.done.length > 0 && (
        <Button variant="outline" className="mt-6" onClick={onReset}>
          Delete all logs
        </Button>
      )}
    </>
  );
}
