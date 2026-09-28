import type { ExerciseGuide } from "../../program/guides";

interface GuideDetailsProps {
  guide: ExerciseGuide;
  // The name as written in the program, e.g. "Push Ups w/hands elevated".
  name: string;
}

export function GuideDetails({ guide, name }: GuideDetailsProps) {
  return (
    <>
      <p className="yg-sheet-muscles">{guide.muscles}</p>
      {name !== guide.title && <p className="yg-sheet-today">Today: {name}</p>}
      <Steps steps={guide.steps} />
      {guide.variations && <Variations variations={guide.variations} />}
      <BookPage page={guide.page} />
    </>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol>
      {steps.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  );
}

function Variations({ variations }: { variations: string[] }) {
  return (
    <>
      <h3>Variations</h3>
      <ul>
        {variations.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </>
  );
}

function BookPage({ page }: { page: number }) {
  return (
    <p className="yg-small">
      Photos: <i>You Are Your Own Gym</i>, p. {page}
    </p>
  );
}
