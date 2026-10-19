import { useState } from "react";
import { CATEGORIES, type Scores, type TestedLevel, type TestResult } from "../../program/levelTests";
import { LEVEL_LABEL } from "../../program/registry";
import { Card } from "../Card";
import { Button } from "../ui/Button";
import { ScoreRow } from "./ScoreRow";
import { Shortfalls } from "./Shortfalls";

const BLANK: Scores = { push: 0, pull: 0, legs: 0, core: 0 };

interface TestFormProps {
  level: TestedLevel;
  latest?: TestResult;
  onRecord: (result: TestResult) => Promise<string | null>;
}

export function TestForm({ level, latest, onRecord }: TestFormProps) {
  const [scores, setScores] = useState<Scores>(BLANK);
  const [error, setError] = useState("");

  const submit = async () => {
    const err = await onRecord({ level, date: new Date().toISOString().slice(0, 10), scores });
    setError(err ?? "");
    if (!err) setScores(BLANK);
  };

  return (
    <Card title={`${LEVEL_LABEL[level]} test`}>
      <p className="mb-3 text-sm text-mu">Meet all four minimums to pass. Record what you managed.</p>
      {CATEGORIES.map((c) => (
        <ScoreRow key={c} level={level} category={c} value={scores[c]} onChange={(v) => setScores({ ...scores, [c]: v })} />
      ))}
      {error && <p className="mt-2 text-sm text-red-500">Save failed: {error}</p>}
      <Button className="mt-3 w-full" onClick={submit}>
        Record result
      </Button>
      {latest && <Shortfalls result={latest} />}
    </Card>
  );
}
