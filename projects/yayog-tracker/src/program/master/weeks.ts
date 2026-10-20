// Program data: Master Class level (transcribed from the book, pending a
// spot-check). Blocks are named after the weeks they cover and kept in
// week-number order below.
import type { Day, StappersDay } from "../types";

const STAPPERS_MASTER: StappersDay = {
  type: "stappers",
  focus: "Stappers",
  exercises: ["12 Assisted Alternating 1-Legged Squats or Box Jumps", "6 Dive Bombers", "8 Let Me Ups"],
};

const ASSISTED_DOOR_PULL_UPS = "Assisted Door Pull Ups (feet on chair, or jump and control the negative)";
const ONE_LEGGED_SQUATS = "Alternating 1-Legged Squats assisted or off a platform";

// Weeks 1-2
const W1_2: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: ["Alternating 1-Arm Push Ups w/hands elevated", ASSISTED_DOOR_PULL_UPS, "Military Press w/feet elevated", "Let Me Ups"],
  },
  2: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: [ONE_LEGGED_SQUATS, "Alternating Back Lunges w/4–6 s pause at bottom", "Hip Extensions", "Supermans"],
  },
  3: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: ["Alternating 1-Arm Push Ups w/hands elevated", ASSISTED_DOOR_PULL_UPS, "Military Press", "Let Me Ins"],
  },
  4: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: [
      ONE_LEGGED_SQUATS,
      "Alternating Side Lunges w/1–3 s pause at bottom",
      "Alternating 1-Legged RDLs on pillow",
      "Iron Crosses w/knees bent",
    ],
  },
};

// Weeks 3-4
const W3_4: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: ["1-Arm Push Ups w/hands elevated", "Dive Bombers", "Military Press w/feet elevated", "Dips"],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: [
      "1-Legged Squats assisted or off a platform",
      "Bulgarian Split Squats w/4–6 s pause at bottom",
      "Side Lunges w/4–6 s pause at bottom",
      "1-Legged Hip Extensions",
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: ["Door Pull Ups", "Let Me Ins w/1–3 s contraction at top", "Let Me Ups", "Let Me Ups w/reverse grip"],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Hanging Leg Raises (bringing legs parallel to ground)", "Pillow Humpers", "V-Ups", "Supermans"],
  },
};

// Weeks 5-6
const W5_6: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["1-Arm Push Ups", "Bouncing Push Ups"],
      ["Military Press w/feet elevated", "Dive Bombers"],
      ["Surface Tricep Extensions", "Shove Offs"],
    ],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Pistols", "Box Jumps"],
      ["Sissy Squats", "Iron Mikes"],
      ["Ham Sandwiches", "Side Jumps"],
    ],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Door Pull Ups", "Let Me Ups"],
      ["1-Arm Let Me Ins", "Let Me Ups w/reverse grip"],
      ["Let Me Ins w/reverse grip and 4–6 s pause at top", "Towel Curls"],
    ],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["Hanging Leg Lifts", "Bicycles"],
      ["Pillow Humpers", "Supermans"],
      ["V-Ups", "Iron Crosses w/knees bent"],
    ],
  },
};

// Week 7
const W7: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push",
    exercises: ["1-Arm Push Ups w/hands on knee-high surface", "Dive Bombers", "Dips", "Seated Dips"],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Pistols", "Sissy Squats"],
      ["Box Jumps", "Iron Mikes"],
      ["Ham Sandwiches", "Side Jumps"],
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: ["Door Pull Ups", "Let Me Ins w/1–3 s contraction at top", "Let Me Ups", "Let Me Ups w/reverse grip"],
  },
  4: {
    type: "tabata",
    focus: "Core",
    exercises: ["Side V-Ups (4 sets on each side)", "Flutter Kicks w/hands on chest", "Squats"],
  },
  5: STAPPERS_MASTER,
};

// Week 8
const W8: { [day: number]: Day } = {
  1: {
    type: "tabata",
    focus: "Push",
    exercises: ["Push Ups", "Shove Offs", "Squats"],
  },
  2: {
    type: "ladder",
    focus: "Legs",
    exercises: ["Assisted 1-Legged Squats", "Sissy Squats", "Side Lunges w/1–3 s pause at bottom", "Hip Extensions"],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Door Pull Ups", "Let Me Ups"],
      ["1-Arm Let Me Ins", "Let Me Ups w/reverse grip and feet elevated"],
      ["Let Me Ins w/reverse grip", "Towel Curls"],
    ],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: [
      "Hanging Leg Lifts (bringing straight legs up parallel to ground)",
      "Pillow Humpers",
      "V-Ups",
      "Supermans",
    ],
  },
  5: STAPPERS_MASTER,
};

// Week 9
const W9: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: ["1-Arm Push Ups w/hands elevated", "Dive Bombers", "Military Press w/feet elevated", "Dips"],
  },
  2: {
    type: "tabata",
    focus: "Legs",
    exercises: ["Iron Mikes", "Side Jumps", "Squats"],
  },
  3: {
    type: "ladder",
    focus: "Pull",
    exercises: [ASSISTED_DOOR_PULL_UPS, "Let Me Ups", "Let Me Ups w/reverse grip", "Let Me Ins"],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["Hanging Leg Lifts", "Bicycles"],
      ["Pillow Humpers", "Supermans"],
      ["V-Ups", "Iron Crosses w/knees bent"],
    ],
  },
  5: STAPPERS_MASTER,
};

// Week 10
const W10: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["1-Arm Push Ups", "Bouncing Push Ups"],
      ["Military Press w/feet elevated", "Dive Bombers"],
      ["Surface Tricep Extensions", "Shove Offs"],
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: [
      "1-Legged Squats assisted or off a platform",
      "Bulgarian Split Squats w/4–6 s pause at bottom",
      "Side Lunges w/4–6 s pause at bottom",
      "1-Legged Hip Extensions",
    ],
  },
  3: {
    type: "tabata",
    focus: "Pull",
    exercises: ["Let Me Ups", "Let Me Ins", "Squats"],
  },
  4: {
    type: "ladder",
    focus: "Core",
    exercises: ["Side V-Ups w/bent legs", "Bam Bams", "Leg Lifts w/hands on chest", "Hyperextensions w/hands under chin"],
  },
  5: STAPPERS_MASTER,
};

// Week -> day map, in week-number order.
export const WEEKS: { [week: number]: { [day: number]: Day } } = {
  1: W1_2,
  2: W1_2,
  3: W3_4,
  4: W3_4,
  5: W5_6,
  6: W5_6,
  7: W7,
  8: W8,
  9: W9,
  10: W10,
};
