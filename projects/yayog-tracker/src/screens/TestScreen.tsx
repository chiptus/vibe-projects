import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/Card";
import { Stepper } from "../components/Stepper";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  formatMinimum,
  highestPassed,
  LEVEL_TESTS,
  nextTest,
  shortfalls,
  type Category,
  type Scores,
  type TestResult,
} from "../program/levelTests";
import { LEVEL_LABEL } from "../program/registry";
import type { Level } from "../program/types";

const BLANK: Scores = { push: 0, pull: 0, legs: 0, core: 0 };

interface TestScreenProps {
  active: Level;
  results: TestResult[];
  onRecord: (result: TestResult) => Promise<string | null>;
  onSwitch: (level: Level) => void;
}

export function TestScreen({ active, results, onRecord, onSwitch }: TestScreenProps) {
  const [scores, setScores] = useState<Scores>(BLANK);
  const [error, setError] = useState("");
  const recommended = highestPassed(results);
  const next = nextTest(results);
  const latest = next ? [...results].reverse().find((r) => r.level === next) : undefined;
  const missed = latest ? shortfalls(latest.level, latest.scores) : [];

  const submit = async () => {
    if (!next) return;
    const err = await onRecord({ level: next, date: new Date().toISOString().slice(0, 10), scores });
    setError(err ?? "");
    if (!err) setScores(BLANK);
  };

  return (
    <>
      {recommended !== active && (
        <Card title={`Recommended: ${LEVEL_LABEL[recommended]}`}>
          <p className="mb-2.5 text-base text-mu">Your results qualify you for this program.</p>
          <Button className="w-full" onClick={() => onSwitch(recommended)}>
            Switch to {LEVEL_LABEL[recommended]}
          </Button>
        </Card>
      )}

      {next ? (
        <Card title={`${LEVEL_LABEL[next]} test`}>
          <p className="mb-3 text-sm text-mu">Meet all four minimums to pass. Record what you managed.</p>
          {CATEGORIES.map((c) => (
            <ScoreRow key={c} level={next} category={c} value={scores[c]} onChange={(v) => setScores({ ...scores, [c]: v })} />
          ))}
          {error && <p className="mt-2 text-sm text-red-500">Save failed: {error}</p>}
          <Button className="mt-3 w-full" onClick={submit}>
            Record result
          </Button>
          {latest && missed.length > 0 && (
            <div className="mt-3 border-t border-ln pt-3 text-base">
              <div className="text-mu">Last attempt, {latest.date}: not passed yet</div>
              <ul className="mt-1">
                {missed.map((c) => (
                  <li key={c}>
                    {CATEGORY_LABEL[c]}: {latest.scores[c]} of {formatMinimum(LEVEL_TESTS[next][c])} {LEVEL_TESTS[next][c].label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ) : (
        <Card title="No further test">
          <p className="text-base text-mu">You have passed every Level test.</p>
        </Card>
      )}

      {results.length > 0 && (
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
      )}
    </>
  );
}

interface ScoreRowProps {
  level: Exclude<Level, "basic">;
  category: Category;
  value: number;
  onChange: (value: number) => void;
}

function ScoreRow({ level, category, value, onChange }: ScoreRowProps) {
  const m = LEVEL_TESTS[level][category];
  return (
    <div className="mb-3">
      <div className="text-base font-semibold">
        {CATEGORY_LABEL[category]}: {m.label}
      </div>
      <div className="mb-1 text-sm text-mu">
        {m.how} Minimum {formatMinimum(m)}.
      </div>
      <div className="flex items-center gap-2">
        <Stepper value={value} onChange={onChange} />
        <span className="text-sm text-mu">{m.unit === "seconds" ? "seconds" : m.unit === "side" ? "per side" : "reps"}</span>
      </div>
    </div>
  );
}
