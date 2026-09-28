import { useState } from "react";
import { guideFor } from "../../program/guides";
import { BottomSheet } from "./BottomSheet";
import { GuideDetails } from "./GuideDetails";

interface ExerciseNameProps {
  name: string;
}

// An exercise name that opens its how-to sheet when tapped. Falls back to
// plain text for names without a guide.
export function ExerciseName({ name }: ExerciseNameProps) {
  const [open, setOpen] = useState(false);
  const guide = guideFor(name);
  if (!guide) return <>{name}</>;
  return (
    <>
      <button type="button" className="yg-ex" onClick={() => setOpen(true)}>
        {name}
      </button>
      {open && (
        <BottomSheet title={guide.title} onClose={() => setOpen(false)}>
          <GuideDetails guide={guide} name={name} />
        </BottomSheet>
      )}
    </>
  );
}
