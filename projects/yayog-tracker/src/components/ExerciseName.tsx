import { useRef } from "react";
import { guideFor } from "../program/guides";

interface ExerciseNameProps {
  name: string;
}

// An exercise name that opens its how-to sheet when tapped. Falls back to
// plain text for names without a guide.
export function ExerciseName({ name }: ExerciseNameProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const guide = guideFor(name);
  if (!guide) return <>{name}</>;
  return (
    <>
      <button type="button" className="yg-ex" onClick={() => ref.current?.showModal()}>
        {name}
      </button>
      <dialog
        ref={ref}
        className="yg-sheet"
        // Tapping the backdrop (the dialog element itself, outside its content) closes it.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="yg-sheet-body">
          <div className="yg-sheet-head">
            <h2>{guide.title}</h2>
            <button type="button" className="yg-x" aria-label="Close" onClick={() => ref.current?.close()}>
              ×
            </button>
          </div>
          <p className="yg-sheet-muscles">{guide.muscles}</p>
          {name !== guide.title && <p className="yg-sheet-today">Today: {name}</p>}
          <ol>
            {guide.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {guide.variations && (
            <>
              <h3>Variations</h3>
              <ul>
                {guide.variations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </>
          )}
          <p className="yg-small">
            Photos: <i>You Are Your Own Gym</i>, p. {guide.page}
          </p>
        </div>
      </dialog>
    </>
  );
}
