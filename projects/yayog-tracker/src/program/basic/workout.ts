import type { Day, Entry, Metric, Position, Program } from "../types";

// Ordered list of all workouts in a program, week by week.
export function sequence(program: Program): Position[] {
  const out: Position[] = [];
  for (let w = 1; w <= 10; w++) {
    const days = program.weeks[w]!;
    for (const d of Object.keys(days).map(Number).sort((a, b) => a - b)) out.push({ w, d });
  }
  return out;
}

// Blank entry shape per type.
export function blankEntries(day: Day): Entry[] {
  switch (day.type) {
    case "ladder":
      return day.exercises.map((name) => ({ name, top: 0 }));
    case "interval":
      return day.exercises.map((name) => ({ name, sets: [0, 0, 0] }));
    case "tabata":
      return day.exercises.map((name) => ({ name, reps: 0 }));
    case "stappers":
      return [{ name: "Rounds", rounds: 0 }];
    case "superset":
      return day.pairs.map(([a, b]) => ({
        a,
        b,
        sets: [
          [0, 0],
          [0, 0],
        ],
      }));
  }
}

// Summary metric per exercise for history.
export function metrics(day: Day, entries: Entry[]): Metric[] {
  switch (day.type) {
    case "ladder":
      return (entries as { name: string; top: number }[]).map((e) => ({
        name: e.name,
        value: e.top,
        unit: "top",
      }));
    case "interval":
      return (entries as { name: string; sets: [number, number, number] }[]).map((e) => ({
        name: e.name,
        value: e.sets.reduce((s, x) => s + x, 0),
        unit: `reps (${e.sets.join("/")})`,
      }));
    case "tabata":
      return (entries as { name: string; reps: number }[]).map((e) => ({
        name: e.name,
        value: e.reps,
        unit: "reps",
      }));
    case "stappers":
      return [{ name: "Stappers", value: (entries[0] as { rounds: number }).rounds, unit: "rounds" }];
    case "superset":
      return (
        entries as { a: string; b: string; sets: [[number, number], [number, number]] }[]
      ).map((e) => ({
        name: `${e.a} + ${e.b}`,
        value: e.sets.reduce((s, [x, y]) => s + x + y, 0),
        unit: `reps (${e.sets.map((s) => s.join("+")).join(", ")})`,
      }));
  }
}
