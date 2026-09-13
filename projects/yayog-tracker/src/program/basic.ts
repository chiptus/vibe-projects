import type {
  Day,
  Entry,
  Metric,
  Position,
  Program,
  StappersDay,
  WorkoutType,
} from "./types";

// ---------- Program data: Basic level (transcribed from the book) ----------
// Treat as verified, do not edit.

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

const STAPPERS_BASIC: StappersDay = {
  type: "stappers",
  focus: "Stappers",
  exercises: ["10 Alternating Back Lunges", "8 Let Me Ins", "6 Push Ups"],
};

const W12: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: [
      "Push Ups w/hands elevated on platform",
      "Let Me Ins",
      "Seated Dips w/feet on ground",
      "Let Me Ups w/knees bent",
    ],
  },
  2: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: ["Alternating Back Lunges", "Alternating 1-Legged RDLs", "Squats", "Swimmers"],
  },
  3: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: [
      "Push Ups w/hands elevated on platform",
      "Let Me Ins",
      "Seated Dips w/feet on ground",
      "Let Me Ups w/knees bent",
    ],
  },
  4: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: [
      "Side Lunges",
      "Alternating 1-Legged RDLs",
      "Squats w/1–3 s pause at bottom",
      "Side Crunches",
    ],
  },
};

const W34: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: [
      "Push Ups",
      "Military Press w/hands elevated",
      "Close Grip Push Ups w/hands elevated",
      "Seated Dips",
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: [
      "Bulgarian Split Squats",
      "Side Lunges",
      "Squats w/1–3 s pause at bottom",
      "1-Legged RDLs on pillow",
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: ["Let Me Ins", "Let Me Ups w/knees bent", "Let Me Ins w/palms up", "Towel Curls"],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Leg Lifts", "Hyperextensions w/hands under chin", "Russian Twists", "Swimmers"],
  },
};

const W56: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["Push Ups w/feet elevated", "Shove Offs"],
      ["Military Press", "Thumbs Up"],
      ["Close Grip Push Ups", "Seated Dips"],
    ],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Alternating Back Lunges w/4–6 s pause at bottom", "Toyotas"],
      ["Alternating Front Lunges w/4–6 s pause at bottom", "Side Lunges"],
      ["Alternating 1-Legged RDLs on pillow", "Squats w/1–3 s pause at bottom"],
    ],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Assisted Door Pull Ups (feet on chair, or jump and control the negative)", "Let Me Ins"],
      ["Let Me Ins w/4–6 s contraction at top", "Towel Curls"],
      ["Let Me Ups w/reverse grip and straight legs", "Let Me Ins w/palms up"],
    ],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["V-Ups", "Russian Twists"],
      ["Supermans", "Swimmers"],
      ["Hanging Leg Lifts w/knees bent", "Leg Lifts"],
    ],
  },
};

const W7: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push",
    exercises: [
      "Military Press w/hands elevated",
      "Push Ups w/hands elevated",
      "Close Grip Push Ups w/hands elevated",
      "Seated Dips w/knees bent",
    ],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Alternating Back Lunges w/4–6 s pause at bottom", "Toyotas"],
      ["Alternating Front Lunges w/4–6 s pause at bottom", "Side Lunges"],
      ["Alternating 1-Legged RDLs on pillow w/1–3 s pause at middle", "Pogo Jumps"],
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: ["Let Me Ins", "Let Me Ups w/knees bent", "Let Me Ins w/palms up", "Towel Curls"],
  },
  4: {
    type: "tabata",
    focus: "Core",
    exercises: ["Russian Twists", "Beach Scissors", "Standing Knee Raises"],
  },
  5: STAPPERS_BASIC,
};

const W8: { [day: number]: Day } = {
  1: {
    type: "tabata",
    focus: "Push",
    exercises: [
      "Push Ups w/hands elevated about chest high",
      "Rocking Chairs",
      "Burpees w/hands elevated about waist high",
    ],
  },
  2: {
    type: "ladder",
    focus: "Legs",
    exercises: [
      "Alternating Back Lunges",
      "Alternating 1-Legged RDLs",
      "Squats w/1–3 s pause at bottom",
      "Good Mornings w/1–3 s pause at bottom",
    ],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Assisted Door Pull Ups (feet on chair, or jump and control the negative)", "Let Me Ins"],
      ["Let Me Ins w/4–6 s contraction at top", "Let Me Ups w/knees bent"],
      ["Let Me Ups w/reverse grip and straight legs", "Let Me Ins w/palms up"],
    ],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Leg Lifts", "Hyperextensions w/hands under chin", "Russian Twists", "Swimmers"],
  },
  5: STAPPERS_BASIC,
};

const W9: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: ["Push Ups", "Military Press w/hands elevated", "Close Grip Push Ups w/hands elevated"],
  },
  2: {
    type: "tabata",
    focus: "Legs",
    exercises: ["Beat Your Boots", "Lunges", "Good Mornings"],
  },
  3: {
    type: "ladder",
    focus: "Pull",
    exercises: [
      "Let Me Ups w/knees bent",
      "Let Me Ins",
      "Let Me Ups w/reverse grip and knees bent",
      "Let Me Ins w/palms up",
    ],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["V-Ups", "Russian Twists"],
      ["Supermans", "Swimmers"],
      ["Bicycles", "Leg Lifts"],
    ],
  },
  5: STAPPERS_BASIC,
};

const W10: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["Push Ups w/feet elevated", "Shove Offs"],
      ["Military Press", "Thumbs Up"],
      ["Close Grip Push Ups", "Seated Dips w/feet on ground"],
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: [
      "Bulgarian Split Squats",
      "Side Lunges",
      "Squat w/4–6 s pause at bottom",
      "1-Legged RDLs on pillow",
    ],
  },
  3: {
    type: "tabata",
    focus: "Pull",
    exercises: [
      "Let Me Ins w/feet behind hands (step back from usual foot position)",
      "Bam Bams",
      "Towel Curls",
    ],
  },
  4: {
    type: "ladder",
    focus: "Core",
    exercises: ["Crunch It Ups", "Hyperextensions w/arms at side", "Leg Lifts", "Hyperextensions w/lower body only"],
  },
  5: STAPPERS_BASIC,
};

export function BLOCK_NAME(w: number): string {
  return w <= 2 ? "Muscular endurance" : w <= 4 ? "Strength" : w <= 6 ? "Power" : "Undulating";
}

export const BASIC_PROGRAM: Program = {
  name: "Basic",
  weeks: { 1: W12, 2: W12, 3: W34, 4: W34, 5: W56, 6: W56, 7: W7, 8: W8, 9: W9, 10: W10 },
};

// Ordered list of all workouts for the Basic level.
export function sequence(): Position[] {
  const out: Position[] = [];
  for (let w = 1; w <= 10; w++) {
    const days = BASIC_PROGRAM.weeks[w]!;
    for (const d of Object.keys(days).map(Number).sort((a, b) => a - b)) out.push({ w, d });
  }
  return out;
}

// Blank entry shape per type.
export function blankEntries(day: Day): Entry[] {
  switch (day.type) {
    case "ladder":
      return day.exercises.map((name) => ({ name, top: 0 }));
    case "interval":
      return day.exercises.map((name) => ({ name, sets: [0, 0, 0] }));
    case "tabata":
      return day.exercises.map((name) => ({ name, reps: 0 }));
    case "stappers":
      return [{ name: "Rounds", rounds: 0 }];
    case "superset":
      return day.pairs.map(([a, b]) => ({
        a,
        b,
        sets: [
          [0, 0],
          [0, 0],
        ],
      }));
  }
}

// Summary metric per exercise for history.
export function metrics(day: Day, entries: Entry[]): Metric[] {
  switch (day.type) {
    case "ladder":
      return (entries as { name: string; top: number }[]).map((e) => ({
        name: e.name,
        value: e.top,
        unit: "top",
      }));
    case "interval":
      return (entries as { name: string; sets: [number, number, number] }[]).map((e) => ({
        name: e.name,
        value: e.sets.reduce((s, x) => s + x, 0),
        unit: `reps (${e.sets.join("/")})`,
      }));
    case "tabata":
      return (entries as { name: string; reps: number }[]).map((e) => ({
        name: e.name,
        value: e.reps,
        unit: "reps",
      }));
    case "stappers":
      return [{ name: "Stappers", value: (entries[0] as { rounds: number }).rounds, unit: "rounds" }];
    case "superset":
      return (
        entries as { a: string; b: string; sets: [[number, number], [number, number]] }[]
      ).map((e) => ({
        name: `${e.a} + ${e.b}`,
        value: e.sets.reduce((s, [x, y]) => s + x + y, 0),
        unit: `reps (${e.sets.map((s) => s.join("+")).join(", ")})`,
      }));
  }
}
