import { LEVELS, type Level } from "./types";

export type Category = "push" | "pull" | "legs" | "core";
export const CATEGORIES: Category[] = ["push", "pull", "legs", "core"];
export type Scores = Record<Category, number>;

export type TestedLevel = Exclude<Level, "basic">;

// How a Minimum is counted. "side" is entered as the count for each side.
export type Unit = "reps" | "side" | "seconds";

export interface Minimum {
  label: string;
  how: string;
  min: number;
  unit: Unit;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  core: "Core",
};

// The Level tests, paraphrased from the book. Basic has none.
export const LEVEL_TESTS: Record<TestedLevel, Record<Category, Minimum>> = {
  "first-class": {
    push: { label: "Push Ups", how: "Pause 2 s at the top and at the bottom of every rep.", min: 10, unit: "reps" },
    pull: { label: "Let Me Ups", how: "Legs straight, feet on the ground.", min: 10, unit: "reps" },
    legs: { label: "Back Lunges", how: "Pause 3 s at the bottom of every rep. Count each leg.", min: 15, unit: "side" },
    core: { label: "Push-up position hold", how: "Hold the top of a push up without sagging.", min: 60, unit: "seconds" },
  },
  master: {
    push: {
      label: "One-Arm Push Ups",
      how: "Hands on a surface about mid-thigh high, alternating arms every rep.",
      min: 8,
      unit: "side",
    },
    pull: { label: "Pull Ups", how: "Pause 2 s at the top and at the bottom of every rep.", min: 5, unit: "reps" },
    legs: {
      label: "One-Legged Squats",
      how: "Touch your butt lightly onto a platform just below knee height, alternating legs every rep.",
      min: 12,
      unit: "side",
    },
    core: { label: "Push-up position hold", how: "Hold the top of a push up without sagging.", min: 180, unit: "seconds" },
  },
  chief: {
    push: { label: "One-Arm Push Ups", how: "Alternating arms every rep.", min: 8, unit: "side" },
    pull: { label: "Pull Ups", how: "Pause 1 s at the top and at the bottom of every rep.", min: 12, unit: "reps" },
    legs: { label: "Pistols", how: "Alternating legs every rep.", min: 12, unit: "side" },
    core: { label: "Push-up position hold", how: "Hold the top of a push up without sagging.", min: 300, unit: "seconds" },
  },
};

export interface TestResult {
  level: TestedLevel;
  date: string;
  scores: Scores;
}

export const isTested = (l: Level): l is TestedLevel => l !== "basic";

/** Categories whose Minimum was missed; empty means the test is passed. */
export function shortfalls(level: TestedLevel, scores: Scores): Category[] {
  return CATEGORIES.filter((c) => scores[c] < LEVEL_TESTS[level][c].min);
}

/** The top Level with a passing result; a pass counts for every Level below it. */
export function highestPassed(results: TestResult[]): Level {
  let best = 0;
  for (const r of results) {
    if (shortfalls(r.level, r.scores).length === 0) best = Math.max(best, LEVELS.indexOf(r.level));
  }
  return LEVELS[best]!;
}

/** Levels the person may train at: Basic up to the Highest passed. */
export function unlockedLevels(results: TestResult[]): Level[] {
  return LEVELS.slice(0, LEVELS.indexOf(highestPassed(results)) + 1);
}

/** The only test to show: the Level above the Highest passed, if any. */
export function nextTest(results: TestResult[]): TestedLevel | null {
  const next = LEVELS[LEVELS.indexOf(highestPassed(results)) + 1];
  return next && isTested(next) ? next : null;
}

export function formatMinimum(m: Minimum): string {
  if (m.unit === "seconds") {
    return `${m.min} s (${Math.floor(m.min / 60)}:${String(m.min % 60).padStart(2, "0")})`;
  }
  return m.unit === "side" ? `${m.min} per side` : `${m.min}`;
}
