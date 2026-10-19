import { RecommendationCard } from "../components/test/RecommendationCard";
import { ResultsList } from "../components/test/ResultsList";
import { TestForm } from "../components/test/TestForm";
import { Card } from "../components/Card";
import { highestPassed, nextTest, type TestResult } from "../program/levelTests";
import type { Level } from "../program/types";

interface TestScreenProps {
  active: Level;
  results: TestResult[];
  onRecord: (result: TestResult) => Promise<string | null>;
  onSwitch: (level: Level) => void;
}

export function TestScreen({ active, results, onRecord, onSwitch }: TestScreenProps) {
  const recommended = highestPassed(results);
  const next = nextTest(results);
  const latest = next ? [...results].reverse().find((r) => r.level === next) : undefined;

  return (
    <>
      {recommended !== active && <RecommendationCard level={recommended} onSwitch={onSwitch} />}
      {next ? (
        <TestForm level={next} latest={latest} onRecord={onRecord} />
      ) : (
        <Card title="No further test">
          <p className="text-base text-mu">You have passed every Level test.</p>
        </Card>
      )}
      {results.length > 0 && <ResultsList results={results} />}
    </>
  );
}
