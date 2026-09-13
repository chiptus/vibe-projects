// Program data: Basic level (transcribed from the book). Treat as verified,
// do not edit. Blocks are named after the weeks they cover and kept in
// week-number order below.
import type { Day, StappersDay } from "../types";

const STAPPERS_BASIC: StappersDay = {
  type: "stappers",
  focus: "Stappers",
  exercises: ["10 Alternating Back Lunges", "8 Let Me Ins", "6 Push Ups"],
};

// Weeks 1-2
const W1_2: { [day: number]: Day } = {
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

// Weeks 3-4
const W3_4: { [day: number]: Day } = {
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

// Weeks 5-6
const W5_6: { [day: number]: Day } = {
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

// Week 7
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

// Week 8
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

// Week 9
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

// Week 10
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
