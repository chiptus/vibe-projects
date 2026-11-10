// Program data: 1st Class level (transcribed from the book, pending a
// spot-check). Blocks are named after the weeks they cover and kept in
// week-number order below.
import type { Day, StappersDay } from "../types";

const STAPPERS_FIRST_CLASS: StappersDay = {
  type: "stappers",
  focus: "Stappers",
  exercises: ["6 Let Me Ups w/knees bent", "12 Alternating Side Lunges", "8 Push Ups"],
};

const ASSISTED_DOOR_PULL_UPS = "Assisted Door Pull Ups (feet on chair, or jump and control the negative)";

// Weeks 1-2
const W1_2: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: ["Push Ups", "Let Me Ups", "Military Press", "Let Me Ins"],
  },
  2: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: [
      "Alternating Back Lunges w/1–3 s pause at bottom",
      "Alternating 1-Legged RDLs",
      "Toyotas w/1–3 s pause at bottom",
      "Hyperextensions w/arms at side",
    ],
  },
  3: {
    type: "ladder",
    focus: "Push/Pull",
    exercises: ["Push Ups", "Let Me Ups", "Military Press", "Let Me Ins"],
  },
  4: {
    type: "ladder",
    focus: "Legs/Core",
    exercises: [
      "Alternating Side Lunges w/1–3 s pause at bottom",
      "Alternating 1-Legged RDLs",
      "Toyotas w/1–3 s pause at bottom",
      "Russian Twists",
    ],
  },
};

// Weeks 3-4
const W3_4: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: [
      "Push Ups w/feet elevated",
      "Military Press",
      "Close Grip Push Ups",
      "Assisted Dips (legs bent behind you, feet on a chair to help push up)",
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: [
      "Bulgarian Split Squats w/1–3 s pause at bottom",
      "Side Lunges w/4–6 s pause at bottom",
      "Toyotas w/4–6 s pause at bottom",
      "1-Legged RDLs on pillow",
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: [ASSISTED_DOOR_PULL_UPS, "Let Me Ups", "Let Me Ins", "Towel Curls"],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Leg Lifts w/hands on chest", "Supermans", "Bicycles", "Hyperextensions w/hands under chin"],
  },
};

// Weeks 5-6
const W5_6: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["Push Ups w/feet elevated and 1–3 s pause at bottom", "Shove Offs"],
      ["Military Press w/feet elevated", "Thumbs Up"],
      ["Close Grip Push Ups w/feet elevated", "Assisted Dips"],
    ],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Alternating 1-Legged Squats while holding onto chairs with both hands", "Toyotas w/4–6 s pause at bottom"],
      ["Alternating Side Lunges w/4–6 s pause at bottom", "Alternating Back Lunges w/1–3 s pause at bottom"],
      ["Alternating 1-Legged RDLs on pillow and 1–3 s pause at bottom", "Box Jumps"],
    ],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Door Pull Ups", "Let Me Ins"],
      ["Let Me Ins w/4–6 s contraction at top", "Let Me Ups"],
      ["Let Me Ups w/reverse grip and feet elevated", "Let Me Ins w/palms up"],
    ],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["Hanging Leg Lifts w/knees bent", "Iron Crosses w/knees bent"],
      ["Alternating 1-Legged Hip Extensions", "Supermans"],
      ["V-Ups", "Russian Twists"],
    ],
  },
};

// Week 7
const W7: { [day: number]: Day } = {
  1: {
    type: "ladder",
    focus: "Push",
    exercises: ["Chinese Push Ups", "Push Ups", "Close Grip Push Ups", "Seated Dips"],
  },
  2: {
    type: "superset",
    focus: "Legs",
    pairs: [
      ["Alternating 1-Legged Squats while holding onto two chairs", "Toyotas w/4–6 s pause at bottom"],
      ["Alternating Side Lunges w/4–6 s pause at bottom", "Alternating Back Lunges w/1–3 s pause"],
      ["Alternating 1-Legged RDLs on pillow and 1–3 s pause", "Box Jumps"],
    ],
  },
  3: {
    type: "interval",
    focus: "Pull",
    exercises: [ASSISTED_DOOR_PULL_UPS, "Let Me Ups", "Let Me Ins", "Towel Curls"],
  },
  4: {
    type: "tabata",
    focus: "Core",
    exercises: ["Russian Twists", "Flutter Kicks", "Squats"],
  },
  5: STAPPERS_FIRST_CLASS,
};

// Week 8
const W8: { [day: number]: Day } = {
  1: {
    type: "tabata",
    focus: "Push",
    exercises: ["Push Ups w/hands elevated on platform", "Seated Dips w/feet on ground", "Squats"],
  },
  2: {
    type: "ladder",
    focus: "Legs",
    exercises: [
      "Alternating Back Lunges w/1–3 s pause at bottom",
      "Alternating Side Lunges",
      "Toyotas w/1–3 s at bottom",
      "Alternating 1-Legged RDLs",
    ],
  },
  3: {
    type: "superset",
    focus: "Pull",
    pairs: [
      ["Door Pull Ups", "Let Me Ins"],
      ["Let Me Ins w/4–6 s pause at top", "Let Me Ups"],
      ["Let Me Ups w/reverse grip and feet elevated", "Let Me Ins w/palms up"],
    ],
  },
  4: {
    type: "interval",
    focus: "Core",
    exercises: ["Leg Lifts w/hands on chest", "Supermans", "Bicycles", "Hyperextensions w/hands under chin"],
  },
  5: STAPPERS_FIRST_CLASS,
};

// Week 9
const W9: { [day: number]: Day } = {
  1: {
    type: "interval",
    focus: "Push",
    exercises: [
      "Push Ups w/feet elevated",
      "Chinese Push Ups w/hands elevated",
      "Close Grip Push Ups w/hands elevated",
      "Assisted Dips",
    ],
  },
  2: {
    type: "tabata",
    focus: "Legs",
    exercises: ["Iron Mikes", "Side Jumps", "Squats"],
  },
  3: {
    type: "ladder",
    focus: "Pull",
    exercises: ["Let Me Ups", "Let Me Ins", "Let Me Ups w/reverse grip", "Let Me Ins w/palms up"],
  },
  4: {
    type: "superset",
    focus: "Core",
    pairs: [
      ["Hanging Leg Lifts w/knees bent", "Iron Crosses"],
      ["Alternating 1-Legged Hip Extensions", "Supermans"],
      ["V-Ups", "Russian Twists"],
    ],
  },
  5: STAPPERS_FIRST_CLASS,
};

// Week 10
const W10: { [day: number]: Day } = {
  1: {
    type: "superset",
    focus: "Push",
    pairs: [
      ["Push Ups w/feet elevated and 1–3 s pause at bottom", "Shove Offs"],
      ["Military Press w/feet elevated", "Overhead Presses"],
      ["Close Grip Push Ups w/feet elevated", "Assisted Dips"],
    ],
  },
  2: {
    type: "interval",
    focus: "Legs",
    exercises: [
      "Bulgarian Split Squats w/1–3 s pause at bottom",
      "Side Lunges w/4–6 s pause at bottom",
      "Toyotas w/4–6 s at bottom",
      "1-Legged RDLs on pillow",
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
    exercises: ["Bicycles", "Hyperextensions w/hands under chin", "Hello Darlings", "Swimmers"],
  },
  5: STAPPERS_FIRST_CLASS,
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
