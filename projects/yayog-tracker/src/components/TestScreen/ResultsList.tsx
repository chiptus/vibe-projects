import { shortfalls, type TestResult } from "../../program/levelTests";
import { LEVEL_LABEL } from "../../program/registry";
import { Card } from "../Card";

interface ResultsListProps {
  results: TestResult[];
  onDelete: (index: number) => Promise<string | null>;
}

export function ResultsList({ results, onDelete }: ResultsListProps) {
  const del = async (r: TestResult, index: number) => {
    if (!window.confirm(`Delete the ${LEVEL_LABEL[r.level]} result from ${r.date}?`)) return;
    const err = await onDelete(index);
    if (err) window.alert(err);
  };

  return (
    <Card title="Results">
      {results.map((r, index) => ({ r, index })).reverse().map(({ r, index }) => {
        const ok = shortfalls(r.level, r.scores).length === 0;
        return (
          <div key={index} className="flex justify-between gap-2.5 border-t border-ln py-2 text-base first:border-t-0">
            <span>
              {LEVEL_LABEL[r.level]} · {r.date}
            </span>
            <span className="flex gap-2.5">
              <b className={ok ? "text-ac" : "text-mu"}>{ok ? "Passed" : "Not passed"}</b>
              <button type="button" className="text-mu underline" aria-label={`Delete ${LEVEL_LABEL[r.level]} result from ${r.date}`} onClick={() => del(r, index)}>
                Delete
              </button>
            </span>
          </div>
        );
      })}
    </Card>
  );
}
