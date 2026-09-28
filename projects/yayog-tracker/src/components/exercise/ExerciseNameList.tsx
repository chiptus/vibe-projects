import { Fragment } from "react";
import { ExerciseName } from "./ExerciseName";

interface ExerciseNameListProps {
  names: string[];
}

// Several tappable exercise names on one line, separated by " · ".
export function ExerciseNameList({ names }: ExerciseNameListProps) {
  return names.map((name, i) => (
    <Fragment key={name}>
      {i > 0 && " · "}
      <ExerciseName name={name} />
    </Fragment>
  ));
}
