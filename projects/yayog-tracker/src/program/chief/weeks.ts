// Program data: Chief Class level (transcribed from the book, pending a
// spot-check). Blocks are named after the weeks they cover and kept in
// week-number order below.
import type { Day, StappersDay } from "../types";

const STAPPERS_CHIEF: StappersDay = {
  type: "stappers",
  focus: "Stappers",
  exercises: [
    "12 Alternating Pistols (6 total on each side) or 24 Iron Mikes (jumping as high as possible)",
    "6 Handstand Push Ups",
    "8 Door Pull Ups",
  ],
};

const ASSISTED_DOOR_PULL_UPS = "Assisted Door Pull Ups (feet on chair, or jump and control the negative)";

// Weeks 1-2
const W1_2: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: ["Alternating 1-Arm Push Ups w/hands elevated", "Door Pull Ups", "Dive Bombers", "Let Me Ups w/feet elevated"],
  },
  2: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: ["Alternating Pistols", "Iron Mikes", "Alternating 1-Legged Hip Extensions", "Pillow Humpers"],
  },
  3: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: [
      "Alternating 1-Arm Push Ups w/hands elevated",
      "Door Pull Ups",
      "Military Press w/feet elevated",
      "Alternating 1-Arm Let Me Ins",
    ],
  },
  4: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: ["Alternating 1-Legged Squats", "Box Jumps", "Sissy Squats", "Iron Crosses"],
  },
};

// Weeks 3-4
const W3_4: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: [
      "1-Arm Push Ups",
      "Handstand Push Ups",
      "Dive Bombers",
      "Surface Triceps Extensions w/about hip height surface",
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: ["Pistols", "Bulgarian Split Squats w/4–6 s pause at bottom", "Sissy Squats", "Iron Mikes"],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: [
      "Door Pull Ups w/1–3 s pause at top",
      "1-Arm Let Me Ins",
      "Let Me Ups w/reverse grip and feet elevated",
      "Let Me Ins w/4–6 s contraction at top",
    ],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Hanging Leg Lifts (all the way up)", "Pillow Humpers", "Jack Knives", "Supermans"],
  },
};

// Weeks 5-6
const W5_6: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["1-Arm Push Ups w/feet elevated", "Bouncing Push Ups"],
      ["Handstand Push Ups w/1–3 s pause at bottom", "Dive Bombers"],
      ["Surface Triceps Extensions w/about knee height surface", "Shove Offs"],
    ],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Alternating Pistols w/1–3 s pause at bottom", "Box Jumps"],
      ["Sissy Squats w/1–3 s pause at bottom", "Iron Mikes"],
      ["Ham Sandwiches", "Side Jumps"],
    ],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Door Pull Ups w/4–6 s pause at top", "Let Me Ups w/feet elevated"],
      ["1-Arm Let Me Ins w/1–3 s contraction at top", "Let Me Ups w/reverse grip and feet elevated"],
      ["Pull Ups (touching sternum)", "Let Me Ins w/reverse grip and 4–6 s contraction at top"],
    ],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["Hanging Leg Lifts w/4–6 s pause at top (bringing feet to hands)", "Slow Bicycles (taking 2 s to pull each knee in)"],
      ["Pillow Humpers", "Supermans"],
      ["Jack Knives", "Iron Crosses"],
    ],
  },
};

// Week 7
const W7: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push",
    exercises: ["1-Arm Push Ups", "Handstand Push Ups", "Dive Bombers", "Dips w/1–3 s pause at bottom"],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Alternating Pistols w/1–3 s pause at bottom", "Box Jumps"],
      ["Sissy Squats w/1–3 s pause at bottom", "Iron Mikes"],
      ["Ham Sandwiches (without using hands)", "Side Jumps"],
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: [
      "Door Pull Ups w/1–3 s pause at top",
      "1-Arm Let Me Ins",
      "Let Me Ups w/reverse grip and feet elevated",
      "Let Me Ins w/reverse grip and 4–6 s contraction at top",
    ],
  },
  4: {
    type: "tabata",
    focus: "Core",
    exercises: [
      "V-Ups",
      "Side V-Ups (alternating sides after each set, for a total of 4 sets on each side)",
      "Mountain Climbers",
      "Squats",
    ],
  },
  5: STAPPERS_CHIEF,
};

// Week 8
const W8: { [day: number]: Day } = {
  1: {
    type: "tabata",
    focus: "Push",
    exercises: ["Push Ups", "Shove Offs", "Mountain Climbers", "Burpees"],
  },
  2: {
    type: "ladder",
    focus: "Legs",
    exercises: ["1-Legged Squats", "Sissy Squats", "Iron Mikes", "1-Legged Hip Extensions"],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Door Pull Ups w/4–6 s pause at top", "Let Me Ups w/feet elevated"],
      ["1-Arm Let Me Ins w/1–3 s contraction at top", "Let Me Ups w/reverse grip and feet elevated"],
      ["Pull Ups (touching sternum)", "Let Me Ins w/reverse grip and 4–6 s contraction at top"],
    ],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Hanging Leg Lifts (all the way up)", "Pillow Humpers", "Jack Knives", "Supermans"],
  },
  5: STAPPERS_CHIEF,
};

// Week 9
const W9: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: [
      "1-Arm Push Ups",
      "Handstand Push Ups",
      "Dive Bombers",
      "Surface Triceps Extensions w/about hip height surface",
    ],
  },
  2: {
    type: "tabata",
    focus: "Legs",
    exercises: ["Iron Mikes", "Side Jumps", "Squat Thrusts", "Squats"],
  },
  3: {
    type: "ladder",
    focus: "Pull",
    exercises: ["Door Pull Ups", "Let Me Ups", "Let Me Ups w/reverse grip", "Alternating 1-Arm Let Me Ins"],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      [
        "Hanging Leg Lifts (bringing feet to hands) w/4–6 s pause at top",
        "Bicycles (12 slowly on each side, 24 total)",
      ],
      ["Pillow Humpers", "Supermans"],
      ["Jack Knives", "Iron Crosses (6 slowly on each side, 12 total)"],
    ],
  },
  5: STAPPERS_CHIEF,
};

// Week 10
const W10: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["1-Arm Push Ups w/feet elevated", "Bouncing Push Ups"],
      ["Handstand Push Ups", "Dive Bombers w/pauses when your chest is between your hands on the way up"],
      ["Surface Tricep Extensions w/about knee height surface", "Shove Offs"],
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: ["1-Legged Squats", "Bulgarian Split Squats w/overhead backpack press at bottom", "Iron Mikes", "Ham Sandwiches"],
  },
  3: {
    type: "tabata",
    focus: "Pull",
    exercises: [ASSISTED_DOOR_PULL_UPS, "Let Me Ups", "Let Me Ins", "Mountain Climbers"],
  },
  4: {
    type: "ladder",
    focus: "Core",
    exercises: ["Jack Knives", "Pillow Humpers", "Alternating Side V-Ups w/legs straight", "Supermans"],
  },
  5: STAPPERS_CHIEF,
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
