import type { WorkoutType } from "../types";

const LADDER_RULES =
  "1 rep, rest, 2 reps, rest, 3… stop before failure, come back down. 7.5 min per exercise. Rest = previous work time.";
const INTERVAL_RULES =
  "3 sets × 6–12 reps. 3-min intervals: work up to 1.5 min or failure, rest the remainder. Single-limb: one side then the other.";
const SUPERSET_RULES =
  "Pairs, 4-min intervals, 2 sets per pair. 1–5 reps of the first (not to failure, slow 2–3 s negative), then 6–12 of the second.";
const TABATA_RULES = "8 rounds of 20 s work / 10 s rest per exercise (4 min). As fast as possible.";
const STAPPER_RULES = "As many rounds as possible in 20 min, no rest. Short breaks OK if you hit failure.";

export const RULES: Record<WorkoutType, string> = {
  ladder: LADDER_RULES,
  interval: INTERVAL_RULES,
  superset: SUPERSET_RULES,
  tabata: TABATA_RULES,
  stappers: STAPPER_RULES,
};

export const TYPE_LABEL: Record<WorkoutType, string> = {
  ladder: "Ladders",
  interval: "Interval sets",
  superset: "Supersets",
  tabata: "Tabatas",
  stappers: "Stappers",
};

export function BLOCK_NAME(w: number): string {
  return w <= 2 ? "Muscular endurance" : w <= 4 ? "Strength" : w <= 6 ? "Power" : "Undulating";
}
