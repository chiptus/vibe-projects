import type { ExerciseGuide } from "../../program/guides";

interface GuideDetailsProps {
  guide: ExerciseGuide;
  // The name as written in the program, e.g. "Push Ups w/hands elevated".
  name: string;
}

export function GuideDetails({ guide, name }: GuideDetailsProps) {
  return (
    <>
      <p className="mt-1 text-mu italic">{guide.muscles}</p>
      {name !== guide.title && <p className="mt-2.5 rounded-r-md border-l-3 border-ac bg-sf2 px-2.5 py-1.5">Today: {name}</p>}
      <Steps steps={guide.steps} />
      {guide.variations && <Variations variations={guide.variations} />}
      <BookPage page={guide.page} />
    </>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5">
      {steps.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  );
}

function Variations({ variations }: { variations: string[] }) {
  return (
    <>
      <h3 className="mt-4 mb-1 text-base font-bold text-ac">Variations</h3>
      <ul className="list-disc space-y-1.5 pl-5 text-mu">
        {variations.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </>
  );
}

function BookPage({ page }: { page: number }) {
  return (
    <p className="mt-4 text-xs text-mu">
      Photos: <i>You Are Your Own Gym</i>, p. {page}
    </p>
  );
}
