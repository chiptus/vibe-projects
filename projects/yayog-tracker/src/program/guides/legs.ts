import type { ExerciseGuide } from "./types";

// Guides for the book's LEGS & GLUTE exercises section.
export const LEGS = {
  bamBams: {
    title: "Bam Bams",
    muscles: "glutes",
    steps: [
      "Lie face down over the corner of a bed or sturdy table: pelvis on the edge, legs hanging off either side of the corner.",
      "Spread your legs wide, knees only slightly bent, and lift them as high as you can.",
      "Bring your heels together at the top, squeeze your glutes and hold 3 seconds, then lower slowly while spreading them again.",
    ],
    page: 100,
  },
  backLunges: {
    title: "Back Lunges",
    muscles: "quads, glutes, hamstrings, hip flexors",
    steps: [
      "Stand with feet together, toes forward, head up and back straight.",
      "Take a big step back and bend both knees to about 90°, back knee almost touching the floor. Front knee stays over the foot, not past the toes.",
      "Push through the front foot to step back to standing.",
    ],
    variations: [
      "Alternating: switch legs every rep.",
      "4–6 s pause at bottom: hold the low position before standing up.",
      "Hold onto a chair for balance if you need to.",
    ],
    page: 106,
  },
  lunges: {
    title: "Lunges",
    muscles: "quads, glutes, hamstrings, hip flexors",
    steps: [
      "Stand with feet together, toes forward.",
      "Take a big step forward and bend both knees to about 90°, back knee almost touching the floor. Front knee over the foot, not past the toes.",
      "Push off the front leg to step back to the start. Don't lock your knees.",
    ],
    variations: [
      "Alternating: switch legs every rep.",
      "4–6 s pause at bottom: hold the low position before pushing back.",
      "Easier: start already in a split stance and just go down and up.",
    ],
    page: 106,
  },
  sideLunges: {
    title: "Side Lunges",
    muscles: "quads, glutes, hip flexors, hamstrings",
    steps: [
      "Stand upright, feet a little apart. Take a wide step to the side, toes slightly out, and shift your weight onto that leg.",
      "Sit your hips straight down on that side while the other leg stays straight. Upper body stays upright, butt goes back, knee doesn't drift forward.",
      "Go down until that thigh is parallel to the floor, hold 2 seconds, then push through the heel back to standing.",
    ],
    variations: [
      "If you lose balance, take a narrower step.",
      "Do all reps on one side, then switch.",
    ],
    page: 107,
  },
  bulgarianSplitSquats: {
    title: "Bulgarian Split Squats",
    muscles: "quads, hamstrings, glutes",
    steps: [
      "Stand about 60 cm in front of a chair or bed and rest the top of your back foot on it (a pillow helps).",
      "Lower straight down like a lunge until your back knee nearly touches the floor.",
      "Push back up mainly through the front foot. Try to balance without holding onto anything.",
    ],
    variations: ["Single-limb: do all reps on one leg, then the other."],
    page: 113,
  },
  rdls: {
    title: "1-Legged Romanian Deadlifts",
    muscles: "hamstrings, lower back, balance",
    steps: [
      "Stand tall, feet together.",
      "Keeping your back flat, hinge forward and touch the floor in front of your standing foot while the other leg rises straight out behind you. Knees straight but not locked.",
      "Come back up and touch again with the other hand — both hands = one rep. Finish all reps, then switch legs.",
    ],
    variations: [
      "Alternating: switch standing leg every rep.",
      "On pillow: stand on a pillow or couch cushion to make balance harder.",
      "1–3 s pause at middle: hold the bent-over position briefly.",
    ],
    page: 98,
  },
  squats: {
    title: "Squats",
    muscles: "quads, hamstrings, glutes, lower back, hip flexors",
    steps: [
      "Feet shoulder-width apart, head up, eyes forward, arms out in front if it helps balance.",
      "Bend your knees until your butt is a few cm off the floor, leaning your chest forward so your shoulders go past your knees. Knees don't shoot past your toes.",
      "Keep your heels down and stand back up using only your legs.",
    ],
    variations: [
      "Pause at bottom: hold the low position 1–3 s (or 4–6 s) before standing.",
      "Can't go all the way down yet? Go as low as you can, or hold something waist-high.",
      "Tip: practice facing a wall with toes 10–15 cm away to keep knees back.",
    ],
    page: 102,
  },
  goodMornings: {
    title: "Good Mornings",
    muscles: "glutes, hamstrings, lower back",
    steps: [
      "Stand, feet shoulder-width apart, hands behind your head.",
      "Bend forward only at the waist, chest out and butt back, back arched, legs almost straight.",
      "Go down as far as you can while keeping the arch, then come back up.",
    ],
    variations: ["1–3 s pause at bottom: hold the lowest point before rising."],
    page: 95,
  },
  beatYourBoots: {
    title: "Beat Your Boots",
    muscles: "hamstrings, quads",
    steps: [
      "Stand with legs together, bend down and grab your ankles, legs as straight as is comfortable.",
      "Bend your knees until your butt touches your hands.",
      "Keeping hold of your ankles, raise your butt and straighten your legs again.",
    ],
    page: 104,
  },
  toyotas: {
    title: "Toyotas",
    muscles: "quads, glutes, hip flexors, hamstrings, calves",
    steps: [
      "Squat all the way down and put your palms on the floor.",
      "Jump as high as you can, shooting both hands straight overhead.",
      "Land as softly as possible and go straight into the next rep.",
    ],
    page: 108,
  },
  pogoJumps: {
    title: "Pogo Jumps",
    muscles: "calves",
    steps: [
      "Knees nearly straight but not locked.",
      "Bounce up as high and as quickly as you can, springing off the balls of your feet — heels never touch the floor.",
    ],
    page: 119,
  },
} satisfies Record<string, ExerciseGuide>;
