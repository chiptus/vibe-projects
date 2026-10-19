import { describe, expect, it } from "vitest";
import { highestPassed, nextTest, shortfalls, unlockedLevels, type Scores, type TestResult } from "./levelTests";

const FIRST: Scores = { push: 10, pull: 10, legs: 15, core: 60 };
const MASTER: Scores = { push: 8, pull: 5, legs: 12, core: 180 };
const r = (level: TestResult["level"], scores: Scores): TestResult => ({ level, date: "2026-01-01", scores });

describe("level tests", () => {
  it("starts with Basic and the 1st Class test only", () => {
    expect(highestPassed([])).toBe("basic");
    expect(unlockedLevels([])).toEqual(["basic"]);
    expect(nextTest([])).toBe("first-class");
  });

  it("passes only when all four Minimums are met", () => {
    expect(shortfalls("first-class", FIRST)).toEqual([]);
    expect(shortfalls("first-class", { ...FIRST, pull: 7, core: 59 })).toEqual(["pull", "core"]);
  });

  it("a failed test unlocks nothing and keeps the same test next", () => {
    const results = [r("first-class", { ...FIRST, pull: 7 })];
    expect(highestPassed(results)).toBe("basic");
    expect(nextTest(results)).toBe("first-class");
  });

  it("passing a test unlocks that Level and reveals the next test", () => {
    const results = [r("first-class", FIRST)];
    expect(highestPassed(results)).toBe("first-class");
    expect(unlockedLevels(results)).toEqual(["basic", "first-class"]);
    expect(nextTest(results)).toBe("master");
  });

  it("a pass at a higher Level counts for the Levels below", () => {
    const results = [r("master", MASTER)];
    expect(unlockedLevels(results)).toEqual(["basic", "first-class", "master"]);
    expect(nextTest(results)).toBe("chief");
  });

  it("has no next test after Chief", () => {
    const results = [r("chief", { push: 8, pull: 12, legs: 12, core: 300 })];
    expect(highestPassed(results)).toBe("chief");
    expect(nextTest(results)).toBeNull();
  });
});
