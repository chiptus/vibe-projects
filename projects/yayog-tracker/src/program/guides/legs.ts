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
  hipExtensions: {
    title: "Hip Extensions",
    muscles: "glutes, hamstrings, lower back",
    steps: [
      "Lie on your back, arms at your sides, heels resting on a chair or other raised platform, knees bent about 90°.",
      "Using only your legs, push your hips up as high as you can until your thighs line up with your back.",
      "Hold 2 seconds, squeezing glutes and hamstrings, then lower slowly.",
    ],
    variations: ["Harder: one leg at a time (the other leg raised)."],
    page: 99,
  },
  hamSandwich: {
    title: "Ham Sandwiches",
    muscles: "hamstrings, plus explosive power in chest and shoulders",
    steps: [
      "Kneel on a pillow with your heels hooked under something fixed or heavy (a railing base, a couch), or have a partner hold your ankles. Body upright, back straight.",
      "Bend only at the knees (hips stay straight) and fall forward in a controlled way, using your hamstrings to slow the fall as much as possible.",
      "Catch yourself with your fingers first, then palms, almost silently, and let your chest touch the floor like a push up.",
      "Explode back up as in a bouncing push up, and once your fingers leave the floor use only your hamstrings to bring your body upright.",
    ],
    variations: ["Harder: one hand at a time, using your arms less and less — eventually none at all."],
    page: 101,
  },
  ironMikes: {
    title: "Iron Mikes",
    muscles: "quads, glutes, hip flexors, hamstrings, balance",
    steps: [
      "Start in the bottom of a lunge: front knee bent 90° over the foot, back knee bent 90° just above the floor. Back straight, head up, shoulders square.",
      "Pushing mainly off the front foot, spring up high enough to switch legs in the air and land with the other leg in front.",
      "Drop straight into the next rep. Keep going until you can't leave the ground.",
    ],
    variations: ["Harder: stay up on your toes throughout."],
    page: 108,
  },
  sideJumps: {
    title: "Side Jumps",
    muscles: "quads, hamstrings, glutes, hip flexors, calves",
    steps: [
      "Put a low object beside you (a pillow, or two shoes about a foot apart). Stand with feet closer than shoulder-width, toes ahead or slightly out.",
      "Jump sideways over the object, landing with your feet in the same position as you started.",
      "Jump back to the other side, again landing in the same stance.",
    ],
    variations: [
      "Harder: on one leg until clearing it gets hard, then switch legs, then both feet.",
      "Safer to use something flat or low than a tall box you could trip over late in a set.",
    ],
    page: 109,
  },
  boxJumps: {
    title: "Box Jumps",
    muscles: "quads, hamstrings, glutes, hip flexors, calves",
    steps: [
      "Find something solid to jump on: stairs, a sturdy box, a table. Stand shoulder-width apart and drop into a quarter to half squat.",
      "Explode up onto it, pulling your knees up for clearance. Try to jump as high as you can, even if that's more than the object needs.",
      "Step back down with an alternating backward lunge and reset.",
    ],
    variations: [
      "Higher surface = harder. Stairs, one step at a time, are a good way to track progress.",
      "Harder: one leg at a time — builds balance and coordination too.",
    ],
    page: 110,
  },
  squatThrusts: {
    title: "Squat Thrusts",
    muscles: "quads, hamstrings, glutes, lower back, shoulders, triceps",
    steps: [
      "Hold a weighted backpack or similar at chest height.",
      "Drop into a deep squat, butt as low as possible, knees not past your toes.",
      "Stand and press the weight straight overhead in one fluid motion.",
      "Lower it while sinking into the next deep squat, again as one movement.",
    ],
    variations: ["Harder: jump at the top, landing softly on your toes, then straight back into the squat."],
    page: 112,
  },
  oneLeggedSquats: {
    title: "1-Legged Squats",
    muscles: "quads, hamstrings, glutes, lower back, hip flexors",
    steps: [
      "Stand on one leg with the other lifted in front, holding something waist-high (like a chair) lightly for balance. Head up, back straight.",
      "Lower by bending at the waist and knee until your thigh is parallel to the floor, shoulders forward past your knee. Keep the knee from travelling past your toes.",
      "Push back up with that leg alone — the hand is for balance, not for pulling. Don't quite lock the knee at the top.",
      "When you can't do any more, switch legs.",
    ],
    variations: [
      "Easier — assisted: sit down onto a low surface (a chair or coffee table) and stand up from it. The higher it is, the easier; lower it as you get stronger.",
      "Off a platform: stand on a raised surface so your free leg can hang down.",
      "Holding onto chairs: hold lightly onto one or two chairs for balance.",
      "Free leg bent behind you: lean forward, arms out in front, and lightly touch that knee to the floor.",
      "Harder: let go of everything and use your arms for balance. See Pistols for the next step.",
    ],
    page: 114,
  },
  pistols: {
    title: "Pistols",
    muscles: "quads, hamstrings, glutes, lower back, hip flexors",
    steps: [
      "A one-legged squat taken all the way down: butt to the heel of your working foot, free leg held straight out in front.",
      "Lower slowly and under control, then explode back up.",
    ],
    variations: [
      "Tight ankles or hips? Put something thin, like a flip-flop, under your working heel.",
      "Easier range: stand on a sturdy waist-high surface with its edge between your feet and your free leg hanging off the edge, so you can go deeper without the leg-out flexibility.",
      "Harder: hold weight at your chest (water jugs, a loaded backpack); or hold your free foot behind you and lower until that knee lightly touches the floor (use a pillow if the floor is hard).",
      "Harder: pause twice on the way up, about 5 seconds each, just below and just above parallel.",
      "Harder: finish with a jump, land on the other leg, and squat again.",
    ],
    page: 115,
  },
  sissySquats: {
    title: "Sissy Squats",
    muscles: "thighs, hamstrings, glutes",
    steps: [
      "Stand with feet shoulder-width apart, lightly holding something waist-high for balance.",
      "Bending only at the knees, lower yourself while leaning back until your butt reaches your heels. You'll be up on your toes. Keep your back and thighs in one straight line — no bending at the hips.",
      "Reverse it, driving up from your butt to your calves, until you're standing again.",
    ],
    variations: [
      "Harder: hold something heavy to your chest with your free hand, or wear a loaded backpack.",
      "Hardest: one leg at a time, holding lightly onto two waist-high things, free leg straight in front and barely off the floor.",
    ],
    page: 116,
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
