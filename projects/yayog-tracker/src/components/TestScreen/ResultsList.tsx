import { shortfalls, type TestResult } from "../../program/levelTests";
import { LEVEL_LABEL } from "../../program/registry";
import { Card } from "../Card";

export function ResultsList({ results }: { results: TestResult[] }) {
  return (
    <Card title="Results">
      {[...results].reverse().map((r, i) => {
        const ok = shortfalls(r.level, r.scores).length === 0;
        return (
          <div key={i} className="flex justify-between gap-2.5 border-t border-ln py-2 text-base first:border-t-0">
            <span>
              {LEVEL_LABEL[r.level]} · {r.date}
            </span>
            <b className={ok ? "text-ac" : "text-mu"}>{ok ? "Passed" : "Not passed"}</b>
          </div>
        );
      })}
    </Card>
  );
}
