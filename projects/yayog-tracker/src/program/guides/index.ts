import { CORE } from "./core";
import { LEGS } from "./legs";
import { PULL } from "./pull";
import { PUSH } from "./push";
import type { ExerciseGuide } from "./types";

export type { ExerciseGuide } from "./types";

// First match wins, so more specific patterns come before general ones
// (e.g. "close grip push up" before "push up").
const MATCHERS: [RegExp, ExerciseGuide][] = [
  // Dips come first: names like "Assisted Dips (… to help push up)" mention
  // "push up" in their description.
  [/seated dip/, PUSH.seatedDips],
  [/dip/, PUSH.dips],
  [/1-arm push up/, PUSH.oneArmPushUps],
  [/chinese push up/, PUSH.chinesePushUps],
  [/handstand push up/, PUSH.handstandPushUps],
  [/bouncing push up/, PUSH.bouncingPushUps],
  [/close grip push up/, PUSH.closeGripPushUps],
  [/push up/, PUSH.pushUps],
  [/dive bomber/, PUSH.diveBombers],
  [/surface tricep/, PUSH.surfaceTricepsExtensions],
  [/overhead press/, PUSH.overheadPress],
  [/mountain climber/, PUSH.mountainClimbers],
  [/1-arm let me in/, PULL.oneArmLetMeIns],
  [/let me in/, PULL.letMeIns],
  [/let me up/, PULL.letMeUps],
  [/military press/, PUSH.militaryPress],
  [/shove off/, PUSH.shoveOffs],
  [/thumbs up/, PUSH.thumbsUp],
  [/rocking chair/, PUSH.rockingChairs],
  [/burpee/, CORE.burpees],
  [/pull up/, PULL.pullUps],
  [/towel curl/, PULL.towelCurls],
  [/bam bam/, LEGS.bamBams],
  [/side lunge/, LEGS.sideLunges],
  [/back lunge/, LEGS.backLunges],
  [/lunge/, LEGS.lunges],
  [/bulgarian/, LEGS.bulgarianSplitSquats],
  [/rdl/, LEGS.rdls],
  [/hip extension/, LEGS.hipExtensions],
  [/ham sandwich/, LEGS.hamSandwich],
  [/iron mike/, LEGS.ironMikes],
  [/side jump/, LEGS.sideJumps],
  [/box jump/, LEGS.boxJumps],
  [/squat thrust/, LEGS.squatThrusts],
  [/1-legged squat/, LEGS.oneLeggedSquats],
  [/pistol/, LEGS.pistols],
  [/sissy squat/, LEGS.sissySquats],
  [/good morning/, LEGS.goodMornings],
  [/beat your boots/, LEGS.beatYourBoots],
  [/toyota/, LEGS.toyotas],
  [/pogo/, LEGS.pogoJumps],
  [/squat/, LEGS.squats],
  [/swimmer/, CORE.swimmers],
  [/superman/, CORE.supermans],
  [/hyperextension/, CORE.hyperextensions],
  [/flutter kick/, CORE.flutterKicks],
  [/hello darling/, CORE.helloDarlings],
  [/side v-up/, CORE.sideVUps],
  [/iron cross/, CORE.ironCrosses],
  [/jack knive/, CORE.jackKnives],
  [/pillow hump/, CORE.pillowHumpers],
  [/hanging leg (lift|raise)/, CORE.hangingLegLifts],
  [/leg lift/, CORE.legLifts],
  [/russian twist/, CORE.russianTwists],
  [/v-up/, CORE.vUps],
  [/bicycle/, CORE.bicycles],
  [/beach scissor/, CORE.beachScissors],
  [/knee raise/, CORE.standingKneeRaises],
  [/crunch it up/, CORE.crunchItUps],
  [/side crunch/, CORE.sideCrunches],
];

// Look up the guide for a program exercise name like
// "Push Ups w/hands elevated on platform" or "10 Alternating Back Lunges".
export function guideFor(name: string): ExerciseGuide | undefined {
  const n = name.toLowerCase();
  return MATCHERS.find(([re]) => re.test(n))?.[1];
}
