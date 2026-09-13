export type Level = "basic";

export type WorkoutType = "ladder" | "interval" | "superset" | "tabata" | "stappers";

export interface LadderDay {
  type: "ladder";
  focus: string;
  exercises: string[];
}

export interface IntervalDay {
  type: "interval";
  focus: string;
  exercises: string[];
}

export interface SupersetDay {
  type: "superset";
  focus: string;
  pairs: [string, string][];
}

export interface TabataDay {
  type: "tabata";
  focus: string;
  exercises: string[];
}

export interface StappersDay {
  type: "stappers";
  focus: string;
  exercises: string[];
}

export type Day = LadderDay | IntervalDay | SupersetDay | TabataDay | StappersDay;

export interface LadderEntry {
  name: string;
  top: number;
}

export interface IntervalEntry {
  name: string;
  sets: [number, number, number];
}

export interface SupersetEntry {
  a: string;
  b: string;
  sets: [[number, number], [number, number]];
}

export interface TabataEntry {
  name: string;
  reps: number;
}

export interface StappersEntry {
  name: "Rounds";
  rounds: number;
}

export type Entry = LadderEntry | IntervalEntry | SupersetEntry | TabataEntry | StappersEntry;

export interface Position {
  w: number;
  d: number;
}

export interface WorkoutRecord {
  level: Level;
  w: number;
  d: number;
  date: string;
  entries: Entry[];
  notes: string;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
}

export interface Program {
  name: string;
  weeks: { [week: number]: { [day: number]: Day } };
}
