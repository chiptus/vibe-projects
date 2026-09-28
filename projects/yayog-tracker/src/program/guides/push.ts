import type { ExerciseGuide } from "./types";

// Guides for the book's PUSH exercises section.
export const PUSH = {
  pushUps: {
    title: "Push Ups",
    muscles: "chest, triceps, shoulders, core",
    steps: [
      "Lie face down, feet together, hands flat on the floor right under your shoulders.",
      "Press up until your arms are straight. Your body is one rigid line from heels to neck — hips don't sag, butt doesn't pike up.",
      "Lower until your upper arms are at least parallel to the floor; a full rep touches your chest down.",
    ],
    variations: [
      "Hands elevated (table, couch arm, wall): easier — the higher the surface, the easier. Better than knee push ups because the core still works.",
      "Feet elevated: harder, and shifts more work to the shoulders. The higher, the harder.",
      "Hands about chest/waist high: a high surface like a counter or desk, for the fast Tabata version.",
    ],
    page: 59,
  },
  closeGripPushUps: {
    title: "Close Grip Push Ups",
    muscles: "triceps, chest, shoulders, core",
    steps: [
      "Same as a regular push up, but with hands only one or two hand-widths apart.",
      "Keep your elbows tucked in against your sides at the bottom.",
    ],
    variations: [
      "Hands elevated: easier.",
      "Feet elevated: harder — the higher, the harder.",
    ],
    page: 71,
  },
  seatedDips: {
    title: "Seated Dips",
    muscles: "triceps",
    steps: [
      "Sit with your back to a surface between knee and waist height (chair, couch arm, table). Palms on its edge behind you, knuckles forward.",
      "Walk your feet out until your legs are straight and your butt is just in front of the edge.",
      "Bend only at the elbows and shoulders, lowering straight down until your upper arms are parallel to the floor. Forearms stay vertical, back stays close to the surface.",
      "Push back up to straight arms.",
    ],
    variations: [
      "Knees bent / feet on ground: easier — bring your feet in and flat on the floor.",
      "Feet up on a chair or box, or weight on your lap: harder.",
    ],
    page: 68,
  },
  militaryPress: {
    title: "Military Press",
    muscles: "shoulders, triceps",
    steps: [
      "Stand, bend over and put your hands on the floor shoulder-width apart, a few feet in front of your feet.",
      "Hips high: your body makes an upside-down V (about 90° at the hips), legs and back straight.",
      "Bend your elbows to lower your head toward the floor between your hands, then press back up. Only your arms move.",
    ],
    variations: [
      "Hands elevated: easier.",
      "Feet elevated (e.g. feet on a chair, hands on the floor or a couch arm): harder. Hands on two raised surfaces lets your head go below them for more range.",
    ],
    page: 76,
  },
  shoveOffs: {
    title: "Shove Offs",
    muscles: "chest, shoulders, triceps",
    steps: [
      "Stand facing a sturdy raised surface (desk, windowsill, counter).",
      "Fall forward and catch yourself on it with your palms. Lower under control until it touches your lower chest.",
      "Explode back up hard enough to push yourself back to standing — don't bend at the waist.",
    ],
    variations: ["The lower the surface, the harder the shove needs to be."],
    page: 61,
  },
  thumbsUp: {
    title: "Thumbs Up",
    muscles: "rear shoulders, lower back",
    steps: [
      "Lie on your stomach, arms straight out to the sides, fists with thumbs pointing up.",
      "Lift your head and shoulders off the floor and raise your straight arms as high as you can.",
      "Squeeze your shoulders and hold 3 seconds at the top, then lower. Repeat.",
    ],
    page: 78,
  },
  rockingChairs: {
    title: "Rocking Chairs",
    muscles: "chest, triceps, shoulders, core",
    steps: [
      "Start at the top of a push up: body straight, arms straight, hands under shoulders.",
      "Using your toes, rock your whole body forward 15–25 cm, keeping arms straight.",
      "Slowly rock back to the start. Repeat.",
    ],
    variations: ["Harder: do it hovering near the bottom of a push up, a few cm off the floor."],
    page: 57,
  },
} satisfies Record<string, ExerciseGuide>;
