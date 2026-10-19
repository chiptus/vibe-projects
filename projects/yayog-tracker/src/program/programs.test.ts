import { describe, expect, it } from "vitest";
import { guideFor } from "./guides";
import { sequence } from "./basic/workout";
import { PROGRAMS } from "./registry";
import { LEVELS, type Day } from "./types";

const exercisesOf = (day: Day): string[] => (day.type === "superset" ? day.pairs.flat() : day.exercises);

describe.each(LEVELS)("%s program", (level) => {
  const program = PROGRAMS[level];

  it("has 10 weeks: 4 days in weeks 1-6, 5 days in weeks 7-10", () => {
    expect(Object.keys(program.weeks).map(Number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (let w = 1; w <= 10; w++) {
      expect(Object.keys(program.weeks[w]!).map(Number)).toEqual(w <= 6 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5]);
    }
    expect(sequence(program)).toHaveLength(44);
  });

  it("follows the same block structure as Basic", () => {
    const basic = PROGRAMS.basic;
    for (let w = 1; w <= 10; w++) {
      for (const d of Object.keys(basic.weeks[w]!).map(Number)) {
        const a = basic.weeks[w]![d]!;
        const b = program.weeks[w]![d]!;
        expect([w, d, b.type]).toEqual([w, d, a.type]);
      }
    }
  });

  it("has named, non-empty exercises everywhere", () => {
    for (const w of Object.values(program.weeks)) {
      for (const day of Object.values(w)) {
        expect(exercisesOf(day).length).toBeGreaterThan(0);
        for (const e of exercisesOf(day)) expect(e.trim()).not.toBe("");
      }
    }
  });
});

describe("guideFor", () => {
  it("does not reuse a plain guide for a different movement", () => {
    expect(guideFor("Alternating 1-Legged Squats while holding onto chairs")).toBeUndefined();
    expect(guideFor("Chinese Push Ups")).toBeUndefined();
    expect(guideFor("Squats")).toBeDefined();
    expect(guideFor("Push Ups")).toBeDefined();
  });
});
