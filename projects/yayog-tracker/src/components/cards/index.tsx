import type { ReactElement } from "react";
import type { Entry, WorkoutType } from "../../program/types";
import { IntervalCard } from "./IntervalCard";
import { LadderCard } from "./LadderCard";
import { StappersCard } from "./StappersCard";
import { SupersetCard } from "./SupersetCard";
import { TabataCard } from "./TabataCard";

export interface ExerciseCardProps {
  entry: Entry;
  exercises: string[];
  onChange: (patch: Partial<Entry>) => void;
}

type CardComponent = (props: ExerciseCardProps) => ReactElement;

export const CARD_FOR: Record<WorkoutType, CardComponent> = {
  ladder: LadderCard as CardComponent,
  interval: IntervalCard as CardComponent,
  superset: SupersetCard as CardComponent,
  tabata: TabataCard as CardComponent,
  stappers: StappersCard as CardComponent,
};
