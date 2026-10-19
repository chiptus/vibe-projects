import { BASIC_PROGRAM } from "./basic";
import type { Level, Program } from "./types";

export const PROGRAMS: Record<Level, Program> = {
  basic: BASIC_PROGRAM,
};

export const LEVEL_LABEL: Record<Level, string> = {
  basic: "Basic",
};

// Levels the person may train at. Until Level tests exist this is Basic only.
export function unlockedLevels(): Level[] {
  return ["basic"];
}
