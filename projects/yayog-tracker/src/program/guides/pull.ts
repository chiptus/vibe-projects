import type { ExerciseGuide } from "./types";

// Guides for the book's PULL exercises section.
export const PULL = {
  letMeIns: {
    title: "Let Me Ins",
    muscles: "lats, biceps, forearms, rear shoulders",
    steps: [
      "Face the edge of an open door and hold both doorknobs. Feet on either side of the door, heels right under the knobs (wear shoes for grip).",
      "Lean back with straight arms, knees bent, butt out — a right angle between back and thighs.",
      "Keeping that 90° angle and feet flat, pull your chest to the edge of the door and squeeze your shoulder blades together.",
      "Lower under control until your arms and shoulders are fully stretched.",
    ],
    variations: [
      "Easier: move your feet back from the door. Harder: move them forward.",
      "Palms up (under-hand grip, or a towel looped around the knobs): shifts the work to the biceps and inner forearms.",
      "Feet behind hands: step your feet back from your usual position for the fast Tabata version.",
      "4–6 s contraction at top: hold the squeezed-in position before lowering.",
    ],
    page: 85,
  },
  letMeUps: {
    title: "Let Me Ups",
    muscles: "lats, biceps, forearms, rear shoulders",
    steps: [
      "Lie on your back under something sturdy at about arm's reach above you — a table edge, or a broom across two chairs.",
      "Chest under the bar/edge, hands about shoulder width, palms toward your feet.",
      "Body rigid from ankles to shoulders, heels on the floor. Pull your chest up to it, squeezing your shoulder blades.",
      "Lower slowly to straight arms.",
    ],
    variations: [
      "Knees bent (feet flat, closer in): easier.",
      "Straight legs: the full version — only your heels touch the floor.",
      "Reverse grip (palms toward you): more biceps and inner forearms.",
    ],
    page: 87,
  },
  pullUps: {
    title: "Door Pull Ups",
    muscles: "lats, biceps, forearms",
    steps: [
      "Put a towel over the top of an open door and wedge the door so it can't swing.",
      "Grip the top shoulder-width apart, facing the door, knees bent so your body hangs along it.",
      "Pull up until your chin clears the top, then lower slowly to straight arms. No swinging or kicking.",
    ],
    variations: [
      "Assisted: feet on a chair behind you, using your legs as little as needed.",
      "Or jump to the top and just control the lowering as slowly as you can.",
    ],
    page: 89,
  },
  towelCurls: {
    title: "Towel Curls",
    muscles: "biceps, forearms",
    steps: [
      "Stand with your back against a wall. Hold each end of a towel and loop it under one raised foot.",
      "Resist with your leg while you curl the towel up for about 5 seconds, until your forearms are near your upper arms.",
      "Then push down with your foot for about 5 seconds while your arms resist on the way down.",
      "Elbows stay pinned to your sides; only the forearms move. Pull as hard as you can every rep.",
    ],
    page: 90,
  },
} satisfies Record<string, ExerciseGuide>;
