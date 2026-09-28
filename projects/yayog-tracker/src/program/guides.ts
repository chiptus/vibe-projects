// How-to notes for every exercise the Basic program uses. Written in our own
// words from "You Are Your Own Gym" — `page` is the book page to look up for
// the photos (the PDF of the exercise chapter starts at book p. 53, so PDF
// page = book page − 52).

export interface ExerciseGuide {
  title: string;
  muscles: string;
  steps: string[];
  // Notes on the easier/harder versions the program asks for (e.g. "w/hands
  // elevated", "w/knees bent").
  variations?: string[];
  page: number;
}

const G = {
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
} satisfies Record<string, ExerciseGuide>;

// First match wins, so more specific patterns come before general ones
// (e.g. "close grip push up" before "push up").
const MATCHERS: [RegExp, ExerciseGuide][] = [
  [/close grip push up/, G.closeGripPushUps],
  [/push up/, G.pushUps],
  [/let me in/, G.letMeIns],
  [/let me up/, G.letMeUps],
  [/seated dip/, G.seatedDips],
  [/military press/, G.militaryPress],
  [/shove off/, G.shoveOffs],
  [/thumbs up/, G.thumbsUp],
  [/rocking chair/, G.rockingChairs],
  [/burpee/, G.burpees],
  [/pull up/, G.pullUps],
  [/towel curl/, G.towelCurls],
  [/bam bam/, G.bamBams],
  [/side lunge/, G.sideLunges],
  [/back lunge/, G.backLunges],
  [/lunge/, G.lunges],
  [/bulgarian/, G.bulgarianSplitSquats],
  [/rdl/, G.rdls],
  [/good morning/, G.goodMornings],
  [/beat your boots/, G.beatYourBoots],
  [/toyota/, G.toyotas],
  [/pogo/, G.pogoJumps],
  [/squat/, G.squats],
  [/swimmer/, G.swimmers],
  [/superman/, G.supermans],
  [/hyperextension/, G.hyperextensions],
  [/hanging leg lift/, G.hangingLegLifts],
  [/leg lift/, G.legLifts],
  [/russian twist/, G.russianTwists],
  [/v-up/, G.vUps],
  [/bicycle/, G.bicycles],
  [/beach scissor/, G.beachScissors],
  [/knee raise/, G.standingKneeRaises],
  [/crunch it up/, G.crunchItUps],
  [/side crunch/, G.sideCrunches],
];

// Look up the guide for a program exercise name like
// "Push Ups w/hands elevated on platform" or "10 Alternating Back Lunges".
export function guideFor(name: string): ExerciseGuide | undefined {
  const n = name.toLowerCase();
  return MATCHERS.find(([re]) => re.test(n))?.[1];
}
