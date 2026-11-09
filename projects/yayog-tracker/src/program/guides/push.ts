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
  dips: {
    title: "Dips",
    muscles: "triceps, pectorals",
    steps: [
      "Find two stable surfaces a couple of feet apart, roughly equal in height and at least waist high, strong enough to hold your full weight (counters, bed posts, desks, bureaus, stools, a window sill).",
      "Put a palm on each surface, lock your arms straight at your sides, bend your knees and suspend your body between the surfaces.",
      "Lower yourself as far as possible, knees hanging in the air, then push back up. Only your elbows and shoulders bend — don't swing your legs.",
    ],
    variations: [
      "Assisted (easier): push off the ground lightly with your legs, or put a chair behind you, bend your knees and put your feet on it to help push up.",
      "Build up to unassisted: lift your legs off the surface during the lowering part and control the fall back down.",
      "Surfaces needn't be exactly equal in height (e.g. mantle and chair back) — switch sides every other set.",
      "Harder: wear a weighted backpack.",
    ],
    page: 74,
  },
  chinesePushUps: {
    title: "Chinese Push Ups",
    muscles: "triceps, shoulders",
    steps: [
      "Stand with heels together, bend forward and place your hands on the floor about five hand-lengths in front of your feet, forming a diamond: index fingertips and thumbs touching.",
      "Bend at the hips to roughly 90° between torso and legs, butt high, back straight. Legs stay as straight as is comfortable.",
      "Bend only your elbows to bring the top of your head almost to the floor between your hands, then press back up.",
    ],
    variations: [
      "Hands elevated: easier.",
      "Feet elevated: harder. Whatever the variation, keep your butt high and the 90° bend at the waist.",
    ],
    page: 71,
  },
  oneArmPushUps: {
    title: "1-Arm Push Ups",
    muscles: "shoulders, triceps, chest, abs, obliques, lower back",
    steps: [
      "Warm up with some easy regular push ups. Start with your hand on a raised surface (chair, table, desk, windowsill) and move to lower surfaces as you get stronger, until you're on the floor.",
      "Take a push up position with feet a bit wider than shoulder-width and hands closer together than shoulder-width. Put one hand behind your back and spread the fingers of the working hand wide for balance.",
      "Keeping your shoulders level with the ground, lower as far as you can, then press back up.",
      "Tuck the working elbow into your ribs, put your weight on the outer edge of the palm (below the pinky), keep your shoulders squared and away from your ears, and stay on your toes.",
    ],
    variations: [
      "Hands elevated: easier — the lower the surface, the harder.",
      "Feet elevated: harder.",
      "Alternating: switch arms every rep. Non-alternating: finish your reps on one arm, then switch.",
    ],
    page: 66,
  },
  handstandPushUps: {
    title: "Handstand Push Ups",
    muscles: "shoulders, triceps, core",
    steps: [
      "Wear socks or non-marking shoes if the wall can be scuffed. Start on hands and knees with your hands about 3 feet from the wall, heels against it.",
      "Walk your feet up the wall, then walk your hands back toward it until they're about a foot away and your body is a straight vertical line.",
      "Lower slowly until your head almost touches the floor between your hands, then press up until your elbows are nearly locked. Core tight, back not arched.",
      "To come down, swing your legs down to the side one at a time, or walk your hands out and your feet down the wall.",
    ],
    variations: [
      "Not ready yet? Hold a static handstand against the wall for 15–30 seconds to get used to the head rush.",
      "Hands close together in a triangle: more triceps. Shrugs in the handstand: more traps.",
      "Later: a static one-handed handstand, one hand under your head and the other lifted.",
    ],
    page: 81,
  },
  bouncingPushUps: {
    title: "Bouncing Push Ups",
    muscles: "chest, triceps, shoulders, core",
    steps: [
      "A regular push up, but press up so hard and fast that your hands leave the floor at the top.",
      "Land softly: fingertips first, then palms, letting your arms bend to absorb the landing in a controlled way.",
      "Go straight into the next explosive rep.",
    ],
    variations: ["Harder: land on phone books or a low stack just outside or inside your hands, then push off them back to the floor, alternating between floor and books."],
    page: 62,
  },
  mountainClimbers: {
    title: "Mountain Climbers",
    muscles: "shoulders, abs, core stability",
    steps: [
      "Start at the top of a push up: neck, spine and legs in a line, arms straight, hands under shoulders.",
      "Keeping the rest of your body still, bring one knee to your chest and put that foot on the floor.",
      "Jump that leg back while bringing the other knee in at the same moment. Keep swapping fast, as if running in place in the push up position.",
    ],
    page: 62,
  },
  diveBombers: {
    title: "Dive Bombers",
    muscles: "chest, triceps, shoulders, core",
    steps: [
      "Start with straight legs and feet a few inches apart. Bend at the waist and put your hands on the floor three or four feet ahead of your toes, butt as high as possible, arms straight in line with your back.",
      "Chest out, swoop your upper body down in an arc until your chest almost brushes the floor (like the bottom of a push up).",
      "Keep sweeping forward and up until your back is fully arched, head and shoulders high, pelvis only a couple of inches off the floor.",
      "Reverse it: sweep back down close to the floor, and only then push your butt back up to the start.",
    ],
    variations: [
      "Easier: feet wider than shoulder-width, or hands on a raised surface like a coffee table.",
      "If the reverse is too hard late in a set, from the bottom just lift your butt back up without retracing the arc.",
      "Harder: do them with one foot off the ground.",
    ],
    page: 64,
  },
  surfaceTricepsExtensions: {
    title: "Surface Triceps Extensions",
    muscles: "triceps, core",
    steps: [
      "Find a stable horizontal surface around waist height — a chair, couch arm, railing, table, mantle or windowsill. Grip it overhand, hands shoulder-width apart.",
      "Lock your arms and step back a little further than in a push up, body in one straight line.",
      "Bend your elbows to lower until your head comes just below your hands (your feet need to be far enough back for your head to clear the surface), then press forward and up to straight arms.",
      "Keep your midsection tight so you don't fold at the waist, and keep your elbows pointing straight down rather than flaring out.",
    ],
    variations: ["Beginners: use a face-high surface like a bureau top or mantle. The lower the surface, the harder it gets."],
    page: 73,
  },
  overheadPress: {
    title: "Overhead Press",
    muscles: "shoulders, traps, triceps",
    steps: [
      "Stand with feet shoulder-width apart, holding something heavy at your chest — a weighted backpack or a loaded box. An upside-down armchair works too; the less stable the load, the more muscle it uses.",
      "Abs tight, back straight: press it straight overhead until your arms lock.",
      "At the top, shrug your shoulders as high as you can and hold for 1–2 seconds.",
      "Lower under control back to your chest.",
    ],
    variations: [
      "Change the weight to change the difficulty.",
      "Harder: do the press from the bottom of a squat, a lunge or a Bulgarian split squat.",
    ],
    page: 78,
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
