import type { ExerciseGuide } from "./types";

// Guides for the book's CORE exercises section.
export const CORE = {
  swimmers: {
    title: "Swimmers",
    muscles: "glutes, lower back",
    steps: [
      "Lie on your stomach, arms straight out in front.",
      "Lift your right leg and left arm as high as possible and hold 3 seconds, then lower slowly.",
      "Repeat with left leg and right arm. Keep alternating.",
    ],
    page: 130,
  },
  supermans: {
    title: "Supermans",
    muscles: "glutes, lower back",
    steps: [
      "Lie on your stomach, arms straight out in front.",
      "Keeping arms and legs straight, lift them all as high as you can so only your stomach and hips stay on the floor.",
      "Hold 3 seconds, lower, repeat.",
    ],
    page: 130,
  },
  hyperextensions: {
    title: "Hyperextensions",
    muscles: "glutes, lower back",
    steps: [
      "A Supermans variation: lie on your stomach and lift your chest and legs off the floor, hold briefly, lower.",
      "What changes is where your arms go.",
    ],
    variations: [
      "Hands under chin: keep hands tucked under your chin as you lift.",
      "Arms at side: arms along your body.",
      "Lower body only: keep your chest down and lift just your straight legs.",
    ],
    page: 130,
  },
  legLifts: {
    title: "Leg Lifts",
    muscles: "lower abs, hip flexors",
    steps: [
      "Lie on your back, hands under your butt, head slightly raised.",
      "Legs straight and together, start with your heels about 15 cm off the floor.",
      "Raise them to about 45°, hold 2 seconds, then lower slowly back to 15 cm — don't rest them on the floor.",
    ],
    variations: ["Harder: hands on your chest instead of under your butt."],
    page: 125,
  },
  hangingLegLifts: {
    title: "Hanging Leg Lifts",
    muscles: "abs, hip flexors, forearms",
    steps: [
      "Hang from something sturdy — a door frame, a pull up bar, a tree branch. If it's low, bend your knees so your feet clear the floor.",
      "Without swinging, bring your knees up toward your chest.",
      "Lower them under control.",
    ],
    variations: ["Knees bent: the program's version. Bringing knees to the sides also works the obliques."],
    page: 129,
  },
  russianTwists: {
    title: "Russian Twists",
    muscles: "abs, obliques",
    steps: [
      "Sit with knees bent, arms crossed on your chest, and lift your feet off the floor.",
      "Twist so your left elbow touches your right knee, then twist the other way.",
      "Keep going back and forth, twisting as far as you can without dropping your legs.",
    ],
    page: 123,
  },
  vUps: {
    title: "V-Ups",
    muscles: "abs, hip flexors",
    steps: [
      "Lie on your back, arms by your sides.",
      "Balancing on your butt, bring your chest and knees together until they almost touch.",
      "Lean back and straighten your legs so your shoulders and feet each hover a few cm off the floor. Repeat.",
    ],
    page: 127,
  },
  bicycles: {
    title: "Bicycles",
    muscles: "abs, obliques",
    steps: [
      "Lie on your back, hands behind your head, legs out straight about 15 cm off the floor.",
      "Pull one knee to your chest and touch it with the opposite elbow while the other leg stays extended.",
      "Switch sides in a pedaling motion, fully extending each leg. Slow and controlled beats fast.",
    ],
    page: 126,
  },
  beachScissors: {
    title: "Beach Scissors",
    muscles: "hip flexors, obliques",
    steps: [
      "Lie on your left side, head propped on your left hand.",
      "Raise your straight right leg as high as you can and hold 3 seconds, then lower.",
      "Finish the side, then roll over and do the other leg.",
    ],
    page: 122,
  },
  standingKneeRaises: {
    title: "Standing Knee Raises",
    muscles: "abs",
    steps: [
      "Stand upright, feet slightly apart.",
      "Raise one knee as high as you can and hold 3 seconds.",
      "Lower it slowly and do the other knee.",
    ],
    page: 122,
  },
  crunchItUps: {
    title: "Crunch It Ups",
    muscles: "abs (mainly upper)",
    steps: [
      "Lie on your back, knees bent, feet hooked under something (couch, bed). Feet closer to your butt = easier.",
      "Arms crossed and pressed against your stomach.",
      "Curl up just enough for your elbows to touch the bottoms of your thighs, then lower until your shoulder blades touch the floor. Small movement, big effect.",
    ],
    page: 124,
  },
  sideCrunches: {
    title: "Side Crunches",
    muscles: "abs, obliques",
    steps: [
      "Lie on your back, hands behind your head, thighs vertical and ankles crossed in the air.",
      "Crunch up and twist so your left elbow goes toward your right knee, lower, then right elbow toward left knee.",
      "Keep about a fist of space between chin and chest; the movement is small — just your shoulders leave the floor.",
    ],
    page: 124,
  },
  burpees: {
    title: "Burpees",
    muscles: "chest, triceps, shoulders, core, back, hips, legs",
    steps: [
      "Stand with feet together. Squat down and put your hands on the floor in front of your feet.",
      "Kick both feet back into a push up position and do one push up.",
      "Jump your feet back in to the squat, then jump up with your arms overhead.",
      "Land and go straight into the next rep.",
    ],
    variations: ["Hands elevated (coffee table, couch edge): easier, since the push up is easier."],
    page: 134,
  },
} satisfies Record<string, ExerciseGuide>;
