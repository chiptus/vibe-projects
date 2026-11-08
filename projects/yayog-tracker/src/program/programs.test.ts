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
  it.each([
    ["Alternating 1-Legged Squats while holding onto chairs", "1-Legged Squats"],
    ["Chinese Push Ups w/hands elevated", "Chinese Push Ups"],
    ["1-Arm Push Ups w/hands elevated", "1-Arm Push Ups"],
    ["Alternating 1-Arm Let Me Ins", "1-Arm Let Me Ins"],
    ["Sissy Squats w/1–3 s pause at bottom", "Sissy Squats"],
    ["Handstand Push Ups", "Handstand Push Ups"],
    ["Bouncing Push Ups", "Bouncing Push Ups"],
    ["Squat Thrusts", "Squat Thrusts"],
    ["Alternating Pistols", "Pistols"],
    ["Assisted Dips (legs bent behind you, feet on a chair to help push up)", "Dips"],
    ["Dive Bombers w/pauses when your chest is between your hands on the way up", "Dive Bombers"],
    ["Surface Tricep Extensions w/about knee height surface", "Surface Triceps Extensions"],
    ["Overhead Presses", "Overhead Press"],
    ["Alternating 1-Legged Hip Extensions", "Hip Extensions"],
    ["Ham Sandwiches (without using hands)", "Ham Sandwiches"],
    ["Iron Mikes", "Iron Mikes"],
    ["Side Jumps", "Side Jumps"],
    ["Box Jumps", "Box Jumps"],
    ["Iron Crosses w/knees bent", "Iron Crosses"],
    ["Jack Knives", "Jack Knives"],
    ["Side V-Ups w/bent legs", "Side V-Ups"],
    ["Flutter Kicks w/hands on chest", "Flutter Kicks"],
    ["Hello Darlings", "Hello Darlings"],
    ["Mountain Climbers", "Mountain Climbers"],
    ["Pillow Humpers", "Pillow Humpers"],
    ["Hanging Leg Raises (bringing legs parallel to ground)", "Hanging Leg Lifts"],
  ])("gives %s its own guide", (name, title) => {
    expect(guideFor(name)?.title).toBe(title);
  });

  it("keeps the plain guides for the plain movements", () => {
    expect(guideFor("Squats")?.title).toBe("Squats");
    expect(guideFor("Push Ups")?.title).toBe("Push Ups");
    expect(guideFor("Let Me Ins")?.title).toBe("Let Me Ins");
    expect(guideFor("Seated Dips")?.title).toBe("Seated Dips");
  });
});
