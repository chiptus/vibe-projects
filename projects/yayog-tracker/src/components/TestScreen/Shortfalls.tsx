import {
  CATEGORY_LABEL,
  formatMinimum,
  LEVEL_TESTS,
  shortfalls,
  type TestResult,
} from "../../program/levelTests";

// What a failed attempt missed, and nothing about any other Level.
export function Shortfalls({ result }: { result: TestResult }) {
  const missed = shortfalls(result.level, result.scores);
  if (missed.length === 0) return null;
  return (
    <div className="mt-3 border-t border-ln pt-3 text-base">
      <div className="text-mu">Last attempt, {result.date}: not passed yet</div>
      <ul className="mt-1">
        {missed.map((c) => (
          <li key={c}>
            {CATEGORY_LABEL[c]}: {result.scores[c]} of {formatMinimum(LEVEL_TESTS[result.level][c])} {LEVEL_TESTS[result.level][c].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
