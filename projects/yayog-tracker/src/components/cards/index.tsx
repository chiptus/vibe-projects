import type { ReactElement } from "react";
import type {
  IntervalEntry,
  LadderEntry,
  StappersEntry,
  SupersetEntry,
  TabataEntry,
  WorkoutType,
} from "../../program/types";
import { IntervalCard } from "./IntervalCard";
import { LadderCard } from "./LadderCard";
import { StappersCard } from "./StappersCard";
import { SupersetCard } from "./SupersetCard";
import { TabataCard } from "./TabataCard";

type EntryFor<T extends WorkoutType> = T extends "ladder"
  ? LadderEntry
  : T extends "interval"
    ? IntervalEntry
    : T extends "superset"
      ? SupersetEntry
      : T extends "tabata"
        ? TabataEntry
        : StappersEntry;

export interface ExerciseCardProps<T extends WorkoutType = WorkoutType> {
  entry: EntryFor<T>;
  exercises: string[];
  onChange: (patch: Partial<EntryFor<T>>) => void;
}

type CardComponent<T extends WorkoutType> = (props: ExerciseCardProps<T>) => ReactElement;

// Each card component's own props (e.g. LadderCardProps) is a narrower,
// type-safe subset of ExerciseCardProps<T> for its T — `satisfies` checks
// that without widening or casting any of them.
const CARD_FOR = {
  ladder: LadderCard,
  interval: IntervalCard,
  superset: SupersetCard,
  tabata: TabataCard,
  stappers: StappersCard,
} satisfies { [T in WorkoutType]: CardComponent<T> };

// TS can't carry the correlation between a generic `type` param and the
// matching value in CARD_FOR through a plain indexed access, so this one
// assertion (rather than one per card) re-states what `satisfies` above
// already proved: CARD_FOR[T] is a CardComponent<T>.
export function getCard<T extends WorkoutType>(type: T): CardComponent<T> {
  return CARD_FOR[type] as unknown as CardComponent<T>;
}
