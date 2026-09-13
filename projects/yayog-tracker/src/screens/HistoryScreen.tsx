import { DataPanel } from "../components/DataPanel";
import { metrics, TYPE_LABEL } from "../program/basic";
import type { Day, Position, WorkoutRecord } from "../program/types";
import type { useTracker } from "../hooks/useTracker";

interface ProgressStripProps {
  seq: Position[];
  isDone: (p: Position) => boolean;
  current: Position;
}

function ProgressStrip({ seq, isDone, current }: ProgressStripProps) {
  return (
    <div className="yg-grid">
      {seq.map((p) => (
        <div
          key={`${p.w}-${p.d}`}
          className={`yg-cell ${isDone(p) ? "done" : ""} ${p.w === current.w && p.d === current.d ? "now" : ""}`}
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
    <div className="yg-hist" onClick={onOpen}>
      <h3>
        W{rec.w} D{rec.d} · {TYPE_LABEL[day.type]}
        <span>{rec.date}</span>
      </h3>
      <ul>
        {metrics(day, rec.entries).map((m, i) => (
          <li key={i}>
            <span>{m.name}</span>
            <b>
              {m.value} <span style={{ color: "var(--mu)", fontWeight: 500 }}>{m.unit}</span>
            </b>
          </li>
        ))}
      </ul>
      {rec.notes && <p className="yg-small" style={{ margin: "6px 0 0" }}>{rec.notes}</p>}
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
      {t.done.length === 0 && <p className="yg-empty">Nothing logged yet. Do a workout and save it.</p>}
      {[...t.done].reverse().map((k) => {
        const r = t.logs[k];
        return r ? <HistoryEntry key={k} rec={r} day={t.dayAt(r)} onOpen={() => onOpen(r)} /> : null;
      })}
      <DataPanel t={t} />
      {t.done.length > 0 && (
        <button className="yg-danger" onClick={onReset}>
          Delete all logs
        </button>
      )}
    </>
  );
}
