export interface Exercise {
  name: string;
  /** Duration in seconds. */
  duration: number;
  instruction: string;
}

export interface Preset {
  name: string;
  description: string;
  exercises: Exercise[];
}

export type PresetMap = Record<string, Preset>;
