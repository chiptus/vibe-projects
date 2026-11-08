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
  flutterKicks: {
    title: "Flutter Kicks",
    muscles: "lower abs, hip flexors",
    steps: [
      "Lie on your back, hands under your butt, head up. Legs straight and together, feet about 15 cm off the floor.",
      "Raise your right leg to about three feet in the air, then bring it back down to level with your left, which stays 15 cm up.",
      "Repeat with the left leg. Fast or slow, but always controlled.",
    ],
    variations: ["Harder: hands on your chest."],
    page: 125,
  },
  helloDarlings: {
    title: "Hello Darlings",
    muscles: "lower abs, hip flexors",
    steps: [
      "Lie on your back, hands under your butt, head up (it strengthens your neck). Lift your feet about 15 cm off the floor.",
      "Open your legs as wide as you can, then close them.",
    ],
    variations: [
      "Harder: hands on your chest.",
      "Cross your ankles each time you close, alternating which foot is on top.",
    ],
    page: 125,
  },
  sideVUps: {
    title: "Side V-Ups",
    muscles: "intercostals, obliques, abs",
    steps: [
      "Lie on your left side, left arm straight out ahead of you on the floor, palm down. Right hand behind your head with the elbow up.",
      "Legs straight and together, bend only at the hips and bring your knees up toward your right elbow, until your legs are at 90° to your upper body.",
      "Lower slowly without letting your feet touch the floor before the next rep. Then switch sides after your reps.",
    ],
    variations: ["Bent legs: easier. Straight legs: harder."],
    page: 127,
  },
  ironCrosses: {
    title: "Iron Crosses",
    muscles: "abs, obliques, intercostals",
    steps: [
      "Lie on your back, arms straight out to the sides, palms down. Legs straight up so your body makes an L.",
      "With your head off the floor, lower your legs to the right, staying in an L shape.",
      "Just before your feet touch down, raise them back to vertical, then lower to the left. Keep alternating.",
    ],
    variations: ["Knees bent: easier."],
    page: 128,
  },
  jackKnives: {
    title: "Jack Knives",
    muscles: "abs, hip flexors",
    steps: [
      "For strong abs and good coordination. Lie on your back, feet about 15 cm up, arms straight overhead.",
      "Balancing on your butt, bring your chest and straight legs up together until your hands touch your feet.",
      "Lean back and lower your arms and legs until shoulders and feet hover a few inches off the floor.",
    ],
    variations: ["Easier: let your shoulders rest all the way on the floor at the bottom."],
    page: 128,
  },
  pillowHumpers: {
    title: "Pillow Humpers",
    muscles: "glutes, lower back, hamstrings, spinal erectors, back of neck",
    steps: [
      "Lie face down, feet hooked under a couch or pressed flat against a wall so your legs stay still. Tightly rolled pillow under your hips.",
      "Hands behind your head, lift your upper body as high as you can while your toes stay down.",
      "Look at the ceiling at the top and squeeze your back and glutes hard.",
    ],
    page: 130,
  },
  hangingLegLifts: {
    title: "Hanging Leg Lifts",
    muscles: "abs, hip flexors, forearms",
    steps: [
      "Hang from something sturdy — a door frame, a pull up bar, a tree branch. If it's low, bend your knees so your feet clear the floor.",
      "Without swinging, bring your knees up toward your chest.",
      "Lower them under control.",
    ],
    variations: [
      "Knees bent: the easier version.",
      "Bringing your legs up to one side, then the other, works the ribs and obliques more.",
      "Harder: straight legs. For the elite, bring your feet all the way up to your hands without swinging — easier on a bar than a door, which blocks your upper body from leaning back.",
    ],
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
