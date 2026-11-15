import { Fragment } from "react";
import type { ExerciseItem } from "../../program/types";
import { ExerciseName } from "./ExerciseName";

interface ExerciseNameListProps {
  names: ExerciseItem[];
}

// Several tappable exercise names on one line, separated by " · ". A group of
// alternatives renders each one tappable, joined by " or ".
export function ExerciseNameList({ names }: ExerciseNameListProps) {
  return names.map((item, i) => (
    <Fragment key={typeof item === "string" ? item : item.join("|")}>
      {i > 0 && " · "}
      {typeof item === "string" ? (
        <ExerciseName name={item} />
      ) : (
        item.map((name, j) => (
          <Fragment key={name}>
            {j > 0 && " or "}
            <ExerciseName name={name} />
          </Fragment>
        ))
      )}
    </Fragment>
  ));
}
